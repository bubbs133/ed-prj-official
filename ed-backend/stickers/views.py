from django.http import JsonResponse
from django.shortcuts import get_object_or_404
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status

from .models import Sticker, PointTransaction, Sticker, StickerCashIn
from users.models import Profile, UserSticker


def serialize_sticker(sticker, unlocked, request):
    image_url = None
    if sticker.image and hasattr(sticker.image, 'url'):
        image_url = request.build_absolute_uri(sticker.image.url)

    return {
        'id': sticker.id,
        'name': sticker.name,
        'image': image_url,
        'points': sticker.point_cost,
        'rarity': 'Rare' if sticker.point_cost > 5 else 'Common',
        'unlocked': unlocked,
        'is_active': sticker.is_active,
    }


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def stickers_list(request):
    profile, _ = Profile.objects.get_or_create(
        user_name=request.user,
        defaults={'entry': ''}
    )

    owned_sticker_ids = set(
        UserSticker.objects.filter(user=request.user).values_list('sticker_id', flat=True)
    )

    stickers = Sticker.objects.filter(is_active=True).order_by('point_cost')
    serialized_stickers = [
        serialize_sticker(sticker, sticker.id in owned_sticker_ids, request)
        for sticker in stickers
    ]

    return JsonResponse({
        'stickers': serialized_stickers,
        'points': profile.points,
        'unlocked_count': len(owned_sticker_ids),
        'total_count': stickers.count(),
    }, safe=False)


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def redeem_sticker(request, sticker_id):
    sticker = get_object_or_404(Sticker, id=sticker_id, is_active=True)
    profile, _ = Profile.objects.get_or_create(
        user_name=request.user,
        defaults={'entry': ''}
    )

    if UserSticker.objects.filter(user=request.user, sticker=sticker).exists():
        return Response(
            {'detail': 'Sticker already redeemed.'},
            status=status.HTTP_400_BAD_REQUEST
        )

    if profile.points < sticker.point_cost:
        return Response(
            {'detail': 'Not enough points to redeem this sticker.'},
            status=status.HTTP_400_BAD_REQUEST
        )

    profile.points -= sticker.point_cost
    profile.save()

    PointTransaction.objects.create(
        user=request.user,
        action_type=999,
        points=-sticker.point_cost
    )

    UserSticker.objects.create(user=request.user, sticker=sticker)
    StickerCashIn.objects.create(user=request.user, sticker=sticker, status='approved')

    return Response(
        {
            'detail': 'Sticker redeemed successfully.',
            'sticker': serialize_sticker(sticker, True, request),
            'points': profile.points,
        },
        status=status.HTTP_200_OK
    )