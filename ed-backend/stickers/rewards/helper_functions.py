from ..models import PointTransaction
from users.models import Profile

def award_points(user, action_type, points):
    profile, _ = Profile.objects.get_or_create(
        user_name=user,
        defaults={'entry': ''}
    )

    profile.points += points
    profile.lifetime_points += points
    profile.save()

    PointTransaction.objects.create(
        user=user,
        action_type=action_type,
        points=points
    )