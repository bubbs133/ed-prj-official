from django.conf import settings
from django.core.mail import send_mail

from .models import EmailVerificationCode


def send_verification_code(user, purpose):
    code_obj = EmailVerificationCode.objects.create(
        user=user,
        code=EmailVerificationCode.generate_code(),
        purpose=purpose,
    )
    send_mail(
        subject="Your verification code",
        message=f"Your verification code is {code_obj.code}. It expires in "
        f"{settings.VERIFICATION_CODE_TTL_MINUTES} minutes.",
        from_email=getattr(settings, "DEFAULT_FROM_EMAIL", None),
        recipient_list=[user.email],
    )
    return code_obj
