"""
Lightweight, explainable text analysis for detecting cognitive-distortion
language patterns ("ED voice") and general sentiment in journal / reflection
text.

Design notes
------------
This is intentionally RULE-BASED, not a black-box model:
  - It's auditable — you (or a clinical advisor) can read every trigger word.
  - It's cheap and instant — no model download, no inference latency, no
    external API cost, works fully offline/on-device if you ever need that.
  - It's easy to tune — add/remove phrases as you see false positives or
    misses in real usage.

It is deliberately NOT trying to be clever (no fuzzy matching, no ML) yet.
That's a feature: with journaling/mental-health text, false positives are
costly (feels invasive/preachy) and false negatives are recoverable (user
just doesn't get a prompt that day). A precise, conservative rule-based
layer is a safer default than an aggressive classifier.

Swapping in a trained model later
----------------------------------
Once you've got enough labeled data like the Reddit-sourced examples you
mentioned (main_label / sub_label), you can train a classifier and swap it
in without touching any calling code — just replace the body of `analyze()`
below (or add a new function) as long as it still returns an AnalysisResult.
Keep this rule-based version around as a fallback / sanity check even after
that, since the two disagreeing is itself a useful signal.
"""

from dataclasses import dataclass
from typing import List, Optional


@dataclass
class AnalysisResult:
    sentiment: str  # "positive" | "neutral" | "negative"
    sentiment_score: float  # -1.0 (very negative) to 1.0 (very positive)
    distortion_tags: List[str]  # e.g. ["all_or_nothing", "self_criticism"]
    is_flagged: bool  # True if entry warrants a gentle check-in
    reflection_prompt: Optional[str] = None


# ---------------------------------------------------------------------------
# Lexicons — tune these over time based on what you see in real entries.
# Keep everything lowercase; matching is done against lowercased text.
# ---------------------------------------------------------------------------

ALL_OR_NOTHING = [
    "always",
    "never",
    "completely",
    "totally",
    "every time",
    "everything",
    "nothing",
    "ruined",
    "perfect",
    "failure",
    "can't ever",
    "no matter what",
    "entirely",
    "absolutely",
    "everyone",
    "no one",
]

CATASTROPHIZING = [
    "ruined",
    "disaster",
    "the worst",
    "can't handle",
    "terrible",
    "out of control",
    "falling apart",
    "unbearable",
    "can't cope",
]

SELF_CRITICISM = [
    "disgusting",
    "fat",
    "i'm weak",
    "i'm a failure",
    "worthless",
    "useless",
    "pathetic",
    "i'm stupid",
    "i hate myself",
    "i'm gross",
    "i'm a mess",
    "i disgust myself",
    "i'm such a failure",
    "i'm ugly",
    "i don't deserve",
    "pig",
    "cow",
    "fat",

]

SHOULD_STATEMENTS = [
    "i should have",
    "i shouldn't have",
    "i need to",
    "i have to",
    "i must",
    "i'm supposed to",
    "i should be",
]

FOOD_MORALITY = [
    "good food",
    "bad food",
    "cheat day",
    "earned this",
    "earned it",
    "burn it off",
    "burn off",
    "being good today",
    "being bad today",
    "i was so bad",
    "i was good today",
    "i was bad today",
    "restricting"
]

POSITIVE_MARKERS = [
    "proud",
    "grateful",
    "energized",
    "hopeful",
    "strong",
    "calm",
    "peaceful",
    "capable",
    "nourished",
    "accomplished",
    "excited",
    "grounded",
    "fuel",
    "potential",
    "confident",
    "at peace",
]

NEGATIVE_MARKERS = [
    "guilty",
    "ashamed",
    "anxious",
    "panicked",
    "numb",
    "exhausted",
    "empty",
    "trapped",
    "hopeless",
    "overwhelmed",
    "disgusted",
    "shame",
    "freaking out",
    "scared"
]

DISTORTION_LEXICONS = {
    "all_or_nothing": ALL_OR_NOTHING,
    "catastrophizing": CATASTROPHIZING,
    "self_criticism": SELF_CRITICISM,
    "should_statements": SHOULD_STATEMENTS,
    "food_morality": FOOD_MORALITY,
}

# Order matters — first matching tag in an entry picks the prompt shown.
# Self-criticism and food-morality are surfaced ahead of generic
# all-or-nothing language since they're more clinically specific.
DISTORTION_PRIORITY = [
    "self_criticism",
    "food_morality",
    "catastrophizing",
    "should_statements",
    "all_or_nothing",
]

REFLECTION_PROMPTS = {
    "all_or_nothing": (
        "I noticed some all-or-nothing language in there. Would you like "
        "to try reframing this thought together?"
    ),
    "catastrophizing": (
        "Your last entries sound like you've been having really heavy moments. Want to try breaking it "
        "down with the Distortion Breaker?"
    ),
    "self_criticism": (
        "I heard some tough words about yourself in there. You deserve a "
        "gentler take — want to explore that together?"
    ),
    "should_statements": (
        "Lots of 'shoulds' in there. Want to try loosening that a bit "
        "with the Distortion Breaker?"
    ),
    "food_morality": (
        "I noticed some good/bad language around food. Want to explore "
        "where that idea comes from?"
    ),
    "default": (
        "I noticed some heavy language in your entry today. Would you "
        "like to try reframing this thought together?"
    ),
}


def _find_matches(text_lower: str, phrases: List[str]) -> List[str]:
    return [p for p in phrases if p in text_lower]


def analyze(text: str) -> AnalysisResult:
    """
    Analyze a block of free text (journal entry, care-log reflection, etc.)
    and return sentiment + any detected distortion patterns.

    This function has no Django/DB dependency on purpose — it's safe to
    import from any app (journal, care log, wherever you collect reflective
    text) without creating circular imports.
    """
    if not text or not text.strip():
        return AnalysisResult("neutral", 0.0, [], False, None)

    text_lower = text.lower()

    # --- distortion detection --------------------------------------------
    distortion_tags = [
        tag
        for tag in DISTORTION_PRIORITY
        if _find_matches(text_lower, DISTORTION_LEXICONS[tag])
    ]

    # --- sentiment (simple lexicon-based polarity) -------------------------
    pos_hits = len(_find_matches(text_lower, POSITIVE_MARKERS))
    neg_hits = len(_find_matches(text_lower, NEGATIVE_MARKERS))
    # distortion language nudges sentiment negative even without an
    # explicit negative-emotion word being present
    neg_hits += len(distortion_tags) * 0.5

    total = pos_hits + neg_hits
    sentiment_score = 0.0 if total == 0 else round((pos_hits - neg_hits) / total, 2)

    if sentiment_score > 0.2:
        sentiment = "positive"
    elif sentiment_score < -0.2:
        sentiment = "negative"
    else:
        sentiment = "neutral"

    # --- flagging + gentle prompt -------------------------------------------
    # Only flag when distortion language shows up AND the entry isn't
    # clearly positive overall (avoids flagging something like "I never
    # thought I'd feel this proud of myself").
    is_flagged = bool(distortion_tags) and sentiment != "positive"
    reflection_prompt = None
    if is_flagged:
        reflection_prompt = REFLECTION_PROMPTS.get(
            distortion_tags[0], REFLECTION_PROMPTS["default"]
        )

    return AnalysisResult(
        sentiment=sentiment,
        sentiment_score=sentiment_score,
        distortion_tags=distortion_tags,
        is_flagged=is_flagged,
        reflection_prompt=reflection_prompt,
    )
