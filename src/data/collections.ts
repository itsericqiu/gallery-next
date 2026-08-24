import { photos } from './photos';

export type CollectionType = 'selected' | 'place' | 'series' | 'archive';

export type Collection = {
  id: string;
  title: string;
  type: CollectionType;
  slug: string;
  description: string;
  coverPhotoId: string;
  photoIds: string[];
  seoTitle?: string;
  seoDescription?: string;
};

const allPhotoIds = photos.map((photo) => photo.id);

function idsByPlace(place: string) {
  return photos.filter((photo) => photo.place === place).map((photo) => photo.id);
}

const seriesPhotoIds = {
  cities: [
    'japan-052',
    'misc-047',
    'japan-051',
    'new-york-city-048',
    'new-york-city-049',
    'london-029',
    'london-028',
    'london-027',
    'london-031',
    'london-030',
    'misc-061',
    'spain-014',
    'spain-007',
    'spain-010',
    'spain-011',
    'spain-013',
  ],
  landscapes: [
    'iceland-044',
    'iceland-038',
    'vietnam-056',
    'iceland-032',
    'iceland-042',
    'iceland-045',
    'iceland-033',
    'vietnam-057',
    'vietnam-055',
    'misc-058',
    'misc-059',
    'iceland-035',
    'iceland-037',
    'iceland-034',
    'iceland-039',
    'iceland-040',
    'iceland-046',
    'spain-003',
    'spain-005',
    'spain-002',
  ],
  built: [
    'spain-004',
    'spain-025',
    'spain-024',
    'spain-023',
    'spain-022',
    'spain-017',
    'spain-014',
    'spain-007',
    'spain-012',
    'spain-019',
    'spain-020',
    'spain-009',
    'london-029',
    'london-028',
    'london-030',
    'iceland-040',
  ],
  waterlines: [
    'vietnam-056',
    'iceland-038',
    'misc-058',
    'new-york-city-048',
    'new-york-city-049',
    'iceland-032',
    'iceland-045',
    'iceland-042',
    'iceland-033',
    'vietnam-057',
    'vietnam-055',
    'iceland-035',
    'iceland-046',
  ],
  weather: [
    'iceland-038',
    'iceland-044',
    'iceland-032',
    'misc-059',
    'misc-058',
    'spain-003',
    'spain-007',
    'spain-012',
    'spain-010',
    'spain-011',
    'london-027',
    'japan-052',
    'vietnam-056',
    'new-york-city-048',
    'iceland-039',
    'iceland-040',
    'iceland-035',
  ],
  details: [
    'spain-024',
    'spain-004',
    'spain-025',
    'spain-023',
    'spain-022',
    'spain-019',
    'spain-017',
  ],
  inBetween: [
    'misc-053',
    'misc-047',
    'japan-052',
    'london-031',
    'iceland-034',
    'iceland-039',
    'vietnam-057',
    'spain-020',
    'spain-009',
  ],
};

export const collections: Collection[] = [
  {
    id: 'selected',
    title: 'Favorites',
    type: 'selected',
    slug: '/',
    description: 'A few favorites from trips and walks.',
    coverPhotoId: 'iceland-044',
    photoIds: [
      'iceland-044',
      'vietnam-056',
      'japan-052',
      'spain-014',
      'iceland-033',
      'london-029',
      'new-york-city-049',
      'spain-023',
      'iceland-038',
      'misc-047',
      'spain-005',
      'misc-058',
      'spain-025',
    ],
    seoDescription: 'Photos of cities, weather, buildings, and water by Eric Qiu.',
  },
  {
    id: 'archive',
    title: 'Archive',
    type: 'archive',
    slug: '/archive/',
    description: 'Every photo on the site, not just the front-page favorites.',
    coverPhotoId: 'spain-014',
    photoIds: allPhotoIds,
  },
  {
    id: 'places/spain',
    title: 'Spain',
    type: 'place',
    slug: '/places/spain/',
    description: 'Plazas and courtyards, mostly around sunset.',
    coverPhotoId: 'spain-014',
    photoIds: idsByPlace('Spain'),
  },
  {
    id: 'places/iceland',
    title: 'Iceland',
    type: 'place',
    slug: '/places/iceland/',
    description: 'A week of waterfalls and coastlines, with weather that changed every twenty minutes.',
    coverPhotoId: 'iceland-044',
    photoIds: idsByPlace('Iceland'),
  },
  {
    id: 'places/japan',
    title: 'Japan',
    type: 'place',
    slug: '/places/japan/',
    description: 'Rain, neon, a few nights out walking.',
    coverPhotoId: 'japan-052',
    photoIds: idsByPlace('Japan'),
  },
  {
    id: 'places/london',
    title: 'London',
    type: 'place',
    slug: '/places/london/',
    description: 'Landmarks seen through gaps — a bridge, an alley, a plane window.',
    coverPhotoId: 'london-029',
    photoIds: idsByPlace('London'),
  },
  {
    id: 'places/new-york-city',
    title: 'New York City',
    type: 'place',
    slug: '/places/new-york-city/',
    description: 'Just two so far, both of the skyline from across the river.',
    coverPhotoId: 'new-york-city-049',
    photoIds: idsByPlace('New York City'),
  },
  {
    id: 'places/vietnam',
    title: 'Vietnam',
    type: 'place',
    slug: '/places/vietnam/',
    description: 'Green water and limestone cliffs, mostly from a boat.',
    coverPhotoId: 'vietnam-056',
    photoIds: idsByPlace('Vietnam'),
  },
  {
    id: 'series/cities',
    title: 'Cities',
    type: 'series',
    slug: '/series/cities/',
    description: 'Streets and skylines.',
    coverPhotoId: 'misc-047',
    photoIds: seriesPhotoIds.cities,
  },
  {
    id: 'series/landscapes',
    title: 'Landscapes',
    type: 'series',
    slug: '/series/landscapes/',
    description: 'Mountains, coastlines, open road.',
    coverPhotoId: 'misc-059',
    photoIds: seriesPhotoIds.landscapes,
  },
  {
    id: 'series/built-places',
    title: 'Architecture',
    type: 'series',
    slug: '/series/built-places/',
    description: 'Arches, bridges, facades, interiors.',
    coverPhotoId: 'spain-004',
    photoIds: seriesPhotoIds.built,
  },
  {
    id: 'series/waterlines',
    title: 'Water',
    type: 'series',
    slug: '/series/waterlines/',
    description: 'Rivers, harbors, coasts, reflections.',
    coverPhotoId: 'iceland-042',
    photoIds: seriesPhotoIds.waterlines,
  },
  {
    id: 'series/weather',
    title: 'Weather',
    type: 'series',
    slug: '/series/weather/',
    description: 'Cloud, rain, mist, good light.',
    coverPhotoId: 'iceland-038',
    photoIds: seriesPhotoIds.weather,
  },
  {
    id: 'series/details',
    title: 'Details',
    type: 'series',
    slug: '/series/details/',
    description: 'Tile, stone, and carved surfaces.',
    coverPhotoId: 'spain-024',
    photoIds: seriesPhotoIds.details,
  },
  {
    id: 'series/in-between',
    title: 'In Between',
    type: 'series',
    slug: '/series/in-between/',
    description: 'Doorways, windows, people on their phones.',
    coverPhotoId: 'misc-053',
    photoIds: seriesPhotoIds.inBetween,
  },
];

function validateCollections() {
  const validPhotoIds = new Set(allPhotoIds);
  const missingReferences: string[] = [];

  for (const collection of collections) {
    if (!validPhotoIds.has(collection.coverPhotoId)) {
      missingReferences.push(`${collection.id}.coverPhotoId: ${collection.coverPhotoId}`);
    }

    for (const photoId of collection.photoIds) {
      if (!validPhotoIds.has(photoId)) {
        missingReferences.push(`${collection.id}.photoIds: ${photoId}`);
      }
    }
  }

  if (missingReferences.length > 0) {
    throw new Error(`Unknown photo IDs in collections:\n${missingReferences.join('\n')}`);
  }
}

// Series membership is stored twice — tags in photos.ts and the lists above.
// Fail the build if the two ever drift.
function validateSeriesTags() {
  const tagBySlugSegment: Record<string, string> = { 'built-places': 'built' };
  const mismatches: string[] = [];

  for (const collection of collections.filter((candidate) => candidate.type === 'series')) {
    const segment = collection.slug.split('/').filter(Boolean).pop() ?? '';
    const tag = tagBySlugSegment[segment] ?? segment;
    const inList = new Set(collection.photoIds);

    for (const photo of photos) {
      const tagged = photo.tags.includes(tag);
      if (tagged && !inList.has(photo.id)) {
        mismatches.push(`${photo.id} has tag '${tag}' but is missing from ${collection.id}`);
      }
      if (!tagged && inList.has(photo.id)) {
        mismatches.push(`${photo.id} is in ${collection.id} but lacks tag '${tag}'`);
      }
    }
  }

  if (mismatches.length > 0) {
    throw new Error(`Series tags and membership lists disagree:\n${mismatches.join('\n')}`);
  }
}

validateCollections();
validateSeriesTags();

export function getCollection(id: string): Collection {
  const collection = collections.find((candidate) => candidate.id === id);
  if (!collection) {
    throw new Error(`Unknown collection: ${id}`);
  }
  return collection;
}

export function collectionsByType(type: CollectionType): Collection[] {
  return collections.filter((collection) => collection.type === type);
}
