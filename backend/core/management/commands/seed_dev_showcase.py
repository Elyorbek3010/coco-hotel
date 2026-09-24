import io
from datetime import date, time, timedelta
from decimal import Decimal
from django.core.files.base import ContentFile
from django.core.management.base import BaseCommand
from django.db import transaction
from PIL import Image, ImageDraw, ImageFont

from hotel.models import HotelInformation, Service, GalleryImage, Promotion
from rooms.models import Room, RoomImage, Amenity


def create_luxury_placeholder_image(title, subtitle="COCO HOTEL", width=1200, height=800, bg_color=(24, 23, 22), accent_color=(197, 168, 128)):
    """
    Generate an elegant, high-resolution placeholder image with a dark luxury aesthetic.
    Uses charcoal/stone background, gold geometric border, and clean typography.
    """
    image = Image.new("RGB", (width, height), bg_color)
    draw = ImageDraw.Draw(image)

    # Outer decorative gold border
    margin = 40
    draw.rectangle(
        [(margin, margin), (width - margin, height - margin)],
        outline=accent_color,
        width=2
    )

    # Inner subtle border
    inner_margin = 48
    inner_color = (accent_color[0] // 2, accent_color[1] // 2, accent_color[2] // 2)
    draw.rectangle(
        [(inner_margin, inner_margin), (width - inner_margin, height - inner_margin)],
        outline=inner_color,
        width=1
    )

    # Corner accents
    corner_size = 20
    for cx, cy, dx, dy in [
        (margin, margin, 1, 1),
        (width - margin, margin, -1, 1),
        (margin, height - margin, 1, -1),
        (width - margin, height - margin, -1, -1)
    ]:
        draw.line([(cx, cy), (cx + dx * corner_size, cy)], fill=accent_color, width=3)
        draw.line([(cx, cy), (cx, cy + dy * corner_size)], fill=accent_color, width=3)

    # Subtle center badge
    cx, cy = width // 2, height // 2

    # Draw diamond accent
    diamond_size = 14
    draw.polygon(
        [
            (cx, cy - 80 - diamond_size),
            (cx + diamond_size, cy - 80),
            (cx, cy - 80 + diamond_size),
            (cx - diamond_size, cy - 80),
        ],
        outline=accent_color,
        fill=None
    )

    # Draw Subtitle (e.g. "COCO HOTEL")
    sub_text = subtitle.upper()
    try:
        # Default bitmap font fallback if TTF is not accessible
        font_sub = ImageFont.load_default()
        font_main = ImageFont.load_default()
    except Exception:
        font_sub = None
        font_main = None

    draw.text((cx, cy - 40), sub_text, fill=accent_color, anchor="mm", font=font_sub)

    # Draw Title (e.g. "Deluxe Queen Room")
    draw.text((cx, cy + 10), title, fill=(245, 245, 240), anchor="mm", font=font_main)

    # Bottom subtle hospitality line
    draw.text((cx, cy + 60), "BOUTIQUE HOSPITALITY & TRANQUILITY", fill=(140, 130, 120), anchor="mm", font=font_sub)

    buffer = io.BytesIO()
    image.save(buffer, format="JPEG", quality=90)
    return buffer.getvalue()


class Command(BaseCommand):
    help = "Deterministically seeds Neon DEV with realistic Coco Hotel demo data and luxury placeholders."

    @transaction.atomic
    def handle(self, *args, **options):
        self.stdout.write(self.style.NOTICE("--- Starting Coco Hotel DEV Showcase Data Seeding ---"))

        # 1. Hotel Information (Singleton)
        hotel_info = HotelInformation.objects.first()
        if not hotel_info:
            hotel_info = HotelInformation.objects.create(
                name="Coco Hotel",
                hero_title="Sanctuary in the Heart of the City",
                hero_subtitle="An intimate boutique hotel offering tranquil rest, tailored hospitality, and timeless architectural elegance.",
                about_title="A Quiet Haven of Discerning Hospitality",
                about_text=(
                    "Coco Hotel is an intimate boutique haven designed for travelers who seek serenity, "
                    "understated elegance, and exceptional comfort in the city.\n\n"
                    "From our quiet rooms and peaceful courtyard to attentive concierge service around "
                    "the clock, every element of Coco Hotel is curated to ensure your stay is restful, "
                    "effortless, and restorative."
                ),
                phone="+998 71 200 4545",
                secondary_phone="+998 90 910 4545",
                email="concierge@coco-hotel.uz",
                address="14 Afrosiyob Street, Mirabad District, Tashkent, Uzbekistan",
                map_url="https://maps.google.com/?q=Tashkent+Uzbekistan",
                latitude=Decimal("41.2995"),
                longitude=Decimal("69.2401"),
                check_in_time=time(14, 0),
                check_out_time=time(12, 0),
            )
            self.stdout.write(self.style.SUCCESS("[+] Created singleton HotelInformation."))
        else:
            # Normalize missing fields if empty
            updated = False
            if not hotel_info.about_text:
                hotel_info.about_text = (
                    "Coco Hotel is an intimate boutique haven designed for travelers who seek serenity, "
                    "understated elegance, and exceptional comfort in the city.\n\n"
                    "From our quiet rooms and peaceful courtyard to attentive concierge service around "
                    "the clock, every element of Coco Hotel is curated to ensure your stay is restful, "
                    "effortless, and restorative."
                )
                updated = True
            if not hotel_info.hero_subtitle:
                hotel_info.hero_subtitle = "An intimate boutique hotel offering tranquil rest, tailored hospitality, and timeless architectural elegance."
                updated = True
            if not hotel_info.check_in_time:
                hotel_info.check_in_time = time(14, 0)
                updated = True
            if not hotel_info.check_out_time:
                hotel_info.check_out_time = time(12, 0)
                updated = True
            if updated:
                hotel_info.save()
                self.stdout.write(self.style.SUCCESS("[~] Normalized existing HotelInformation."))
            else:
                self.stdout.write("[=] HotelInformation already complete.")

        # 2. Amenities
        amenities_data = [
            ("Wi-Fi", "wifi", 1),
            ("Breakfast", "coffee", 2),
            ("Parking", "car", 3),
            ("Air Conditioning", "snowflake", 4),
            ("Daily Cleaning", "sparkles", 5),
            ("24/7 Reception", "clock", 6),
            ("Private Bathroom", "bath", 7),
            ("Smart TV", "tv", 8),
            ("Mini Bar", "drink", 9),
            ("Work Desk", "desk", 10),
        ]
        amenity_objs = {}
        for name, icon, order in amenities_data:
            amenity, created = Amenity.objects.get_or_create(
                name=name,
                defaults={"icon": icon, "sort_order": order, "is_active": True}
            )
            amenity_objs[name] = amenity
            if created:
                self.stdout.write(f"[+] Created Amenity: {name}")

        # 3. Rooms & Room Images
        rooms_data = [
            {
                "name": "Deluxe Queen Room",
                "slug": "deluxe-queen-room",
                "short_description": "Comfortable queen bed, acoustic soundproofing, modern walk-in shower, and dedicated workspace.",
                "description": (
                    "Crafted for solitary business travelers or couples seeking a quiet city sanctuary. "
                    "The Deluxe Queen Room features a plush queen-size bed dressed in high-thread-count linens, "
                    "warm ambient lighting, double-glazed acoustic windows for undisturbed rest, high-speed fiber internet, "
                    "and an ensuite stone-tiled bathroom with organic botanical toiletries."
                ),
                "price_per_night": Decimal("850000.00"),
                "max_adults": 2,
                "max_children": 1,
                "bed_type": "1 Queen Bed",
                "room_size": Decimal("28.00"),
                "is_featured": True,
                "sort_order": 1,
                "amenities": ["Wi-Fi", "Air Conditioning", "Daily Cleaning", "Private Bathroom", "Smart TV", "Work Desk"],
                "images": [
                    ("Deluxe Queen Bed & Sanctuary View", True),
                    ("Stone Bathroom & Rain Shower", False),
                ],
            },
            {
                "name": "Executive Twin Room",
                "slug": "executive-twin-room",
                "short_description": "Two twin beds, spacious interior, marble vanity, and courtyard garden views.",
                "description": (
                    "Ideal for colleagues or friends traveling together. The Executive Twin Room provides two twin beds "
                    "with orthopaedic mattresses, bespoke wooden furnishings, a generous work desk with international power outlets, "
                    "and serene views overlooking our private courtyard garden."
                ),
                "price_per_night": Decimal("950000.00"),
                "max_adults": 2,
                "max_children": 1,
                "bed_type": "2 Twin Beds",
                "room_size": Decimal("32.00"),
                "is_featured": True,
                "sort_order": 2,
                "amenities": ["Wi-Fi", "Air Conditioning", "Daily Cleaning", "Private Bathroom", "Smart TV", "Mini Bar", "Work Desk"],
                "images": [
                    ("Executive Twin Sleeping Quarters", True),
                    ("Work Area & Courtyard View", False),
                ],
            },
            {
                "name": "Junior Suite",
                "slug": "junior-suite",
                "short_description": "Expansive suite featuring a king bed, integrated lounge seating area, and artisan tea station.",
                "description": (
                    "Our Junior Suite blends understated luxury with expansive living space. Offering a king-size bed, "
                    "a separate lounge corner with tailored armchairs, a complimentary artisan tea and coffee bar, "
                    "walk-in wardrobe, and an expansive bathroom with rain shower and soaking tub."
                ),
                "price_per_night": Decimal("1400000.00"),
                "max_adults": 2,
                "max_children": 1,
                "bed_type": "1 King Bed",
                "room_size": Decimal("42.00"),
                "is_featured": True,
                "sort_order": 3,
                "amenities": ["Wi-Fi", "Breakfast", "Air Conditioning", "Daily Cleaning", "24/7 Reception", "Private Bathroom", "Smart TV", "Mini Bar", "Work Desk"],
                "images": [
                    ("Junior Suite King Living Area", True),
                    ("Lounge Seating & Library Corner", False),
                    ("Ensuite Marble Soaking Tub", False),
                ],
            },
            {
                "name": "Family Suite",
                "slug": "family-suite",
                "short_description": "Two connected bedrooms with king and twin beds, living room, and family-sized dining table.",
                "description": (
                    "Designed for families requiring privacy and comfort. The Family Suite offers two bedrooms, "
                    "a central parlor with comfortable sofa seating, two full bathrooms, and ample wardrobe storage "
                    "to accommodate extended family holidays with ease."
                ),
                "price_per_night": Decimal("2100000.00"),
                "max_adults": 4,
                "max_children": 2,
                "bed_type": "1 King Bed + 2 Twin Beds",
                "room_size": Decimal("65.00"),
                "is_featured": False,
                "sort_order": 4,
                "amenities": ["Wi-Fi", "Breakfast", "Parking", "Air Conditioning", "Daily Cleaning", "24/7 Reception", "Private Bathroom", "Smart TV", "Mini Bar"],
                "images": [
                    ("Family Suite Primary Bedroom", True),
                    ("Family Living Room & Parlor", False),
                ],
            },
            {
                "name": "Premium King Room",
                "slug": "premium-king-room",
                "short_description": "Top-floor king room with private balcony, city skyline view, and espresso bar.",
                "description": (
                    "Perched on the upper floor, the Premium King Room features floor-to-ceiling windows leading to "
                    "a private outdoor balcony with views across the city. Complete with an Italian espresso machine, "
                    "evening turn-down service, and a lavish king bed."
                ),
                "price_per_night": Decimal("1200000.00"),
                "max_adults": 2,
                "max_children": 0,
                "bed_type": "1 King Bed",
                "room_size": Decimal("36.00"),
                "is_featured": False,
                "sort_order": 5,
                "amenities": ["Wi-Fi", "Breakfast", "Air Conditioning", "Daily Cleaning", "Private Bathroom", "Smart TV", "Mini Bar", "Work Desk"],
                "images": [
                    ("Premium King Room & Balcony View", True),
                    ("Balcony Seating Area", False),
                ],
            },
        ]

        for r_info in rooms_data:
            room, created = Room.objects.get_or_create(
                slug=r_info["slug"],
                defaults={
                    "name": r_info["name"],
                    "short_description": r_info["short_description"],
                    "description": r_info["description"],
                    "price_per_night": r_info["price_per_night"],
                    "max_adults": r_info["max_adults"],
                    "max_children": r_info["max_children"],
                    "bed_type": r_info["bed_type"],
                    "room_size": r_info["room_size"],
                    "is_featured": r_info["is_featured"],
                    "is_active": True,
                    "sort_order": r_info["sort_order"],
                }
            )

            # Associate amenities
            room_amenity_objs = [amenity_objs[name] for name in r_info["amenities"] if name in amenity_objs]
            room.amenities.set(room_amenity_objs)

            # Seed placeholder images if none exist
            if not room.images.exists():
                for idx, (img_title, is_primary) in enumerate(r_info["images"]):
                    image_bytes = create_luxury_placeholder_image(f"{r_info['name']} — {img_title}")
                    file_name = f"dev_room_{room.slug}_{idx + 1}.jpg"
                    room_image = RoomImage(
                        room=room,
                        alt_text=f"{room.name} — {img_title}",
                        is_primary=is_primary,
                        sort_order=idx,
                    )
                    room_image.image.save(file_name, ContentFile(image_bytes), save=True)
                self.stdout.write(f"[+] Created Room & Images: {room.name}")
            else:
                self.stdout.write(f"[=] Room exists with images: {room.name}")

        # 4. Gallery Images (6–8 items)
        gallery_items = [
            ("Lobby & Concierge Lounge", "Coco Hotel entrance and concierge desk", 1),
            ("Courtyard Garden", "Tranquil outdoor hotel courtyard and seating", 2),
            ("Boutique Suite Interior", "Spacious boutique suite with king bed and soft lighting", 3),
            ("Morning Dining Room", "Artisan breakfast service and dining tables", 4),
            ("Evening Lounge", "Cozy reading library and evening lounge area", 5),
            ("Executive Workspace", "Quiet guest workspace with high-speed internet", 6),
            ("Stone Bath & Spa Vanity", "Ensuite stone vanity and walk-in rain shower", 7),
            ("Architectural Facade", "Coco Hotel exterior building facade at dusk", 8),
        ]

        existing_gallery_titles = set(GalleryImage.objects.values_list("title", flat=True))
        for title, alt, order in gallery_items:
            if title not in existing_gallery_titles:
                image_bytes = create_luxury_placeholder_image(f"Gallery — {title}")
                file_name = f"dev_gallery_{order}.jpg"
                gallery_entry = GalleryImage(
                    title=title,
                    alt_text=alt,
                    sort_order=order,
                    is_active=True
                )
                gallery_entry.image.save(file_name, ContentFile(image_bytes), save=True)
                self.stdout.write(f"[+] Created Gallery image: {title}")
            else:
                self.stdout.write(f"[=] Gallery image exists: {title}")

        # 5. Promotions (1–2 active offers)
        promotions_data = [
            {
                "title": "Weekend Escape Package",
                "slug": "weekend-escape-package",
                "short_description": "Enjoy complimentary artisan breakfast and late check-out on Friday and Saturday stays.",
                "description": (
                    "Unwind with our curated Weekend Escape package at Coco Hotel. Valid for stays checking in on "
                    "Friday or Saturday, this privilege includes artisan morning breakfast for two, an extended "
                    "check-out until 14:00, and a dedicated concierge to arrange local reservations during your visit.\n\n"
                    "Terms: Subject to room availability. Complimentary late check-out must be requested at arrival."
                ),
                "valid_from": date.today(),
                "valid_until": date.today() + timedelta(days=90),
                "is_active": True,
                "sort_order": 1,
            },
            {
                "title": "Advance Rest Privileges",
                "slug": "advance-rest-privileges",
                "short_description": "Plan your journey at least 14 days in advance and receive priority room selection.",
                "description": (
                    "Reward foresight with priority suite selection and personalized arrival amenities when booking "
                    "your Coco Hotel accommodation 14 days or more ahead of your stay dates.\n\n"
                    "Terms: Applies to all room and suite categories. Subject to advance confirmation by hotel reservations."
                ),
                "valid_from": date.today(),
                "valid_until": date.today() + timedelta(days=120),
                "is_active": True,
                "sort_order": 2,
            },
        ]

        for p_info in promotions_data:
            promo, created = Promotion.objects.get_or_create(
                slug=p_info["slug"],
                defaults={
                    "title": p_info["title"],
                    "short_description": p_info["short_description"],
                    "description": p_info["description"],
                    "valid_from": p_info["valid_from"],
                    "valid_until": p_info["valid_until"],
                    "is_active": p_info["is_active"],
                    "sort_order": p_info["sort_order"],
                }
            )
            if created or not promo.image:
                image_bytes = create_luxury_placeholder_image(f"Special Offer — {p_info['title']}")
                file_name = f"dev_promo_{promo.slug}.jpg"
                promo.image.save(file_name, ContentFile(image_bytes), save=True)
                self.stdout.write(f"[+] Created Promotion: {promo.title}")
            else:
                self.stdout.write(f"[=] Promotion exists: {promo.title}")

        # 6. Verify Services (Keep existing 6 services)
        existing_services = set(Service.objects.values_list("name", flat=True))
        base_services = [
            ("Wi-Fi", "wifi", 1),
            ("Breakfast", "coffee", 2),
            ("Parking", "car", 3),
            ("24/7 Reception", "clock", 4),
            ("Daily Cleaning", "sparkles", 5),
            ("Air Conditioning", "snowflake", 6),
        ]
        for s_name, s_icon, s_order in base_services:
            if s_name not in existing_services:
                Service.objects.create(
                    name=s_name,
                    icon=s_icon,
                    sort_order=s_order,
                    is_active=True,
                    description=f"Complimentary {s_name.lower()} available for all registered hotel guests."
                )
                self.stdout.write(f"[+] Created missing base Service: {s_name}")

        self.stdout.write(self.style.SUCCESS("--- DEV Showcase Data Seeding Completed Successfully ---"))
