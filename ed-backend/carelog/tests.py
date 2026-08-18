from django.contrib.auth import get_user_model
from django.test import TestCase

from carelog.models import CareLog
from carelog.views import _build_language_insight
from journal.models import JournalEntry


class WeeklyLanguageInsightTests(TestCase):
    def setUp(self):
        self.user = get_user_model().objects.create_user(
            username="testuser",
            email="test@example.com",
            password="secret123",
        )

    def test_combines_journal_and_carelog_sources_in_language_insight(self):
        CareLog.objects.create(
            user=self.user,
            notes="I am worthless and everything is ruined.",
            sentiment="negative",
            sentiment_score=-1.0,
            distortion_tags=["self_criticism", "all_or_nothing"],
            is_flagged=True,
        )
        JournalEntry.objects.create(
            entry_author=self.user,
            entry="I should have been better today.",
            sentiment="negative",
            sentiment_score=-0.8,
            distortion_tags=["should_statements"],
            is_flagged=True,
        )

        insight = _build_language_insight(
            list(CareLog.objects.filter(user=self.user)),
            list(JournalEntry.objects.filter(entry_author=self.user)),
        )

        self.assertEqual(insight["total_entries"], 2)
        self.assertIn("carelog", insight["source_breakdown"])
        self.assertIn("journal", insight["source_breakdown"])
        self.assertEqual(insight["source_breakdown"]["carelog"]["total_entries"], 1)
        self.assertEqual(insight["source_breakdown"]["journal"]["total_entries"], 1)
        self.assertIn("self_criticism", insight["distortion_counts"])
        self.assertIn("should_statements", insight["distortion_counts"])
