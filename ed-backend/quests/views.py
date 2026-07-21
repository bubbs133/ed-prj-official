from rest_framework.decorators import (
    api_view,
    permission_classes,
    parser_classes,
)

from rest_framework.permissions import IsAuthenticated

from rest_framework.parsers import (
    MultiPartParser,
    FormParser,
)

from rest_framework.response import Response
from rest_framework import status

from .models import Quest, QuestImage
from .serializers import QuestSerializer


@api_view(["GET"])
def quest_list(request):
    quests = Quest.objects.all()

    serializer = QuestSerializer(quests, many=True)

    return Response(serializer.data)


@api_view(["POST"])
@permission_classes([IsAuthenticated])
@parser_classes(
    [
        MultiPartParser,
        FormParser,
    ]
)
def quest_submission(request):

    quest = Quest.objects.create(
        user=request.user,
        quest_summary=request.data.get("quest_summary"),
    )

    uploaded_images = request.FILES.getlist("images")

    for image in uploaded_images:
        QuestImage.objects.create(quest=quest, image=image)

    return Response(
        QuestSerializer(quest).data,
        status=status.HTTP_201_CREATED,
    )
