const SLUG_IMAGE_MAP = {
  'deluxe-queen-room': '/images/room_deluxe.jpg',
  'executive-twin-room': '/images/room_twin.jpg',
  'premium-king-room': '/images/room_king.jpg',
  'junior-suite': '/images/room_suite.jpg',
  'family-suite': '/images/room_family.jpg',
};

const DEFAULT_IMAGE = '/images/room_deluxe.jpg';

/**
 * Returns a high-resolution display image URL for a given room.
 * Prefers the room's primary_image or first image if valid, otherwise falls back
 * to the curated showcase photography matching the room slug.
 */
export function getRoomImageUrl(room) {
  if (!room) return DEFAULT_IMAGE;

  const directImage = room.primary_image?.image || (room.images && room.images[0]?.image);

  // If a valid external/absolute or custom uploaded image is present and not a broken path
  if (directImage && !directImage.includes('std_primary') && !directImage.includes('std_bath')) {
    return directImage;
  }

  // Fallback to high-res showcase photos matching slug or category
  if (room.slug && SLUG_IMAGE_MAP[room.slug]) {
    return SLUG_IMAGE_MAP[room.slug];
  }

  // Check room name keywords
  const name = (room.name || '').toLowerCase();
  if (name.includes('twin')) return SLUG_IMAGE_MAP['executive-twin-room'];
  if (name.includes('king')) return SLUG_IMAGE_MAP['premium-king-room'];
  if (name.includes('family')) return SLUG_IMAGE_MAP['family-suite'];
  if (name.includes('suite')) return SLUG_IMAGE_MAP['junior-suite'];

  return DEFAULT_IMAGE;
}

/**
 * Returns a full list of high-resolution images for room details gallery.
 */
export function getRoomGalleryImages(room) {
  if (!room) return [{ image: DEFAULT_IMAGE, alt_text: 'Coco Hotel Room' }];

  const baseImage = getRoomImageUrl(room);
  const images = [];

  if (room.images && room.images.length > 0) {
    room.images.forEach((img) => {
      if (img.image && !img.image.includes('std_')) {
        images.push(img);
      }
    });
  }

  if (images.length === 0) {
    images.push({ image: baseImage, alt_text: `${room.name} - Bedroom View` });
    images.push({ image: '/images/hotel_details.jpg', alt_text: `${room.name} - Architectural Detail` });
    images.push({ image: '/images/hotel_lounge.jpg', alt_text: `${room.name} - Interior Ambient` });
    images.push({ image: '/images/hero_exterior.jpg', alt_text: 'Coco Hotel Exterior' });
  }

  return images;
}
