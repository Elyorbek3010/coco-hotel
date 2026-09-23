from django.core.exceptions import ValidationError
from django.core.validators import MinValueValidator
from django.db import models
from django.db.models import CheckConstraint, F, Q


class HotelInformation(models.Model):
    """
    Singleton model representing primary Coco Hotel information.
    Only one record is permitted in the system.
    """
    name = models.CharField(max_length=150, default="Coco Hotel", help_text="Hotel name")
    hero_title = models.CharField(
        max_length=200,
        default="Welcome to Coco Hotel",
        help_text="Homepage hero section main title"
    )
    hero_subtitle = models.TextField(
        blank=True,
        default="",
        help_text="Homepage hero section supporting description"
    )
    about_title = models.CharField(
        max_length=200,
        default="About Coco Hotel",
        help_text="About section heading"
    )
    about_text = models.TextField(help_text="Detailed overview and story of the hotel")
    phone = models.CharField(max_length=50, help_text="Primary contact phone number")
    secondary_phone = models.CharField(
        max_length=50,
        blank=True,
        default="",
        help_text="Alternative contact phone number"
    )
    email = models.EmailField(help_text="Official contact email address")
    address = models.CharField(max_length=255, help_text="Physical hotel address")
    map_url = models.URLField(
        blank=True,
        default="",
        help_text="External link to Google Maps / Yandex Maps location"
    )
    latitude = models.DecimalField(
        max_digits=9,
        decimal_places=6,
        null=True,
        blank=True,
        help_text="Geographic latitude coordinate (-90 to 90)"
    )
    longitude = models.DecimalField(
        max_digits=9,
        decimal_places=6,
        null=True,
        blank=True,
        help_text="Geographic longitude coordinate (-180 to 180)"
    )
    check_in_time = models.TimeField(null=True, blank=True, help_text="Standard daily check-in time")
    check_out_time = models.TimeField(null=True, blank=True, help_text="Standard daily check-out time")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Hotel Information"
        verbose_name_plural = "Hotel Information"
        constraints = [
            CheckConstraint(
                check=Q(latitude__isnull=True) | (Q(latitude__gte=-90) & Q(latitude__lte=90)),
                name="hotel_info_latitude_valid"
            ),
            CheckConstraint(
                check=Q(longitude__isnull=True) | (Q(longitude__gte=-180) & Q(longitude__lte=180)),
                name="hotel_info_longitude_valid"
            ),
        ]

    def __str__(self):
        return self.name

    def clean(self):
        super().clean()
        if not self.pk and HotelInformation.objects.exists():
            raise ValidationError(
                "Only one Hotel Information record is permitted. Please edit the existing record."
            )

    def save(self, *args, **kwargs):
        if not self.pk and HotelInformation.objects.exists():
            raise ValidationError(
                "Only one Hotel Information record is permitted. Please edit the existing record."
            )
        super().save(*args, **kwargs)


class Service(models.Model):
    """
    Hotel service/amenity (e.g. Wi-Fi, Breakfast, Parking).
    """
    name = models.CharField(max_length=100, unique=True, help_text="Service title")
    description = models.TextField(blank=True, default="", help_text="Concise service description")
    icon = models.CharField(
        max_length=50,
        blank=True,
        default="",
        help_text="Icon identifier for frontend icon mapping"
    )
    sort_order = models.PositiveIntegerField(
        default=0,
        validators=[MinValueValidator(0)],
        help_text="Display order"
    )
    is_active = models.BooleanField(default=True, help_text="Whether this service is active and offered")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['sort_order', 'name']
        verbose_name = "Service"
        verbose_name_plural = "Services"
        constraints = [
            CheckConstraint(
                check=Q(sort_order__gte=0),
                name="service_sort_order_gte_0"
            )
        ]

    def __str__(self):
        return self.name

    def clean(self):
        super().clean()
        if self.sort_order < 0:
            raise ValidationError({'sort_order': 'Sort order must be non-negative.'})


class GalleryImage(models.Model):
    """
    Hotel showcase image displayed in the website photo gallery.
    """
    image = models.ImageField(upload_to="gallery/", help_text="Upload gallery image")
    title = models.CharField(max_length=150, blank=True, default="", help_text="Optional image title")
    alt_text = models.CharField(
        max_length=200,
        blank=True,
        default="",
        help_text="Accessible image description"
    )
    sort_order = models.PositiveIntegerField(
        default=0,
        validators=[MinValueValidator(0)],
        help_text="Display order in gallery"
    )
    is_active = models.BooleanField(default=True, help_text="Whether this image appears in the gallery")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['sort_order', 'id']
        verbose_name = "Gallery Image"
        verbose_name_plural = "Gallery Images"
        constraints = [
            CheckConstraint(
                check=Q(sort_order__gte=0),
                name="gallery_image_sort_order_gte_0"
            )
        ]

    def __str__(self):
        return self.title or f"Gallery Image #{self.id or 'new'}"

    def clean(self):
        super().clean()
        if self.sort_order < 0:
            raise ValidationError({'sort_order': 'Sort order must be non-negative.'})


class Promotion(models.Model):
    """
    Special offer or promotion for Coco Hotel.
    """
    title = models.CharField(max_length=150, help_text="Offer headline")
    slug = models.SlugField(max_length=160, unique=True, help_text="URL-safe unique identifier")
    short_description = models.CharField(max_length=300, help_text="Concise summary for promotion cards")
    description = models.TextField(help_text="Full promotional details and terms")
    image = models.ImageField(
        upload_to="promotions/",
        null=True,
        blank=True,
        help_text="Promotional banner image"
    )
    valid_from = models.DateField(
        null=True,
        blank=True,
        help_text="Start date of promotion (optional)"
    )
    valid_until = models.DateField(
        null=True,
        blank=True,
        help_text="End date of promotion (optional)"
    )
    is_active = models.BooleanField(
        default=True,
        help_text="Master toggle for promotion availability"
    )
    sort_order = models.PositiveIntegerField(
        default=0,
        validators=[MinValueValidator(0)],
        help_text="Display order"
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['sort_order', 'id']
        verbose_name = "Promotion"
        verbose_name_plural = "Promotions"
        constraints = [
            CheckConstraint(
                check=Q(sort_order__gte=0),
                name="promotion_sort_order_gte_0"
            ),
            CheckConstraint(
                check=Q(valid_from__isnull=True) | Q(valid_until__isnull=True) | Q(valid_until__gte=F('valid_from')),
                name="promotion_valid_until_gte_valid_from"
            ),
        ]

    def __str__(self):
        return self.title

    def clean(self):
        super().clean()
        if self.sort_order < 0:
            raise ValidationError({'sort_order': 'Sort order must be non-negative.'})
        if self.valid_from and self.valid_until and self.valid_until < self.valid_from:
            raise ValidationError({
                'valid_until': 'valid_until must be on or after valid_from.'
            })
