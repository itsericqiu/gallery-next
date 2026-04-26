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
    'spain-014',
    'spain-007',
    'spain-010',
    'spain-011',
    'spain-013',
    'misc-061',
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
    'spain-013',
    'spain-007',
    'spain-012',
    'spain-010',
    'spain-011',
    'spain-019',
    'spain-020',
    'spain-009',
    'london-029',
    'london-028',
    'london-030',
    'misc-061',
    'spain-003',
    'spain-005',
    'spain-002',
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
    'misc-061',
    'iceland-046',
  ],
  inBetween: [
    'misc-053',
    'misc-047',
    'japan-052',
    'london-031',
    'iceland-034',
    'iceland-039',
    'iceland-033',
    'vietnam-057',
    'spain-020',
    'spain-009',
  ],
};

export const collections: Collection[] = [
  {
    id: 'selected',
    title: 'Selected',
    type: 'selected',
    slug: '/',
    description: 'A shorter edit from trips, walks, and old folders.',
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
    seoTitle: 'Photos by Eric Qiu',
    seoDescription: 'Selected photographs of places, weather, city light, and everyday scenes by Eric Qiu.',
  },
  {
    id: 'archive',
    title: 'Archive',
    type: 'archive',
    slug: '/archive/',
    description: 'Everything currently published here, outside the shorter front-page edit.',
    coverPhotoId: 'spain-014',
    photoIds: allPhotoIds,
  },
  {
    id: 'places/spain',
    title: 'Spain',
    type: 'place',
    slug: '/places/spain/',
    description: 'Plazas, courtyards, facades, and late light.',
    coverPhotoId: 'spain-014',
    photoIds: idsByPlace('Spain'),
  },
  {
    id: 'places/iceland',
    title: 'Iceland',
    type: 'place',
    slug: '/places/iceland/',
    description: 'Waterfalls, coastlines, roads, and fast-changing weather.',
    coverPhotoId: 'iceland-044',
    photoIds: idsByPlace('Iceland'),
  },
  {
    id: 'places/japan',
    title: 'Japan',
    type: 'place',
    slug: '/places/japan/',
    description: 'Rain, night color, and a small first edit from the city.',
    coverPhotoId: 'japan-052',
    photoIds: idsByPlace('Japan'),
  },
  {
    id: 'places/london',
    title: 'London',
    type: 'place',
    slug: '/places/london/',
    description: 'Street views, landmarks, crowds, and slightly off-center angles.',
    coverPhotoId: 'london-029',
    photoIds: idsByPlace('London'),
  },
  {
    id: 'places/new-york-city',
    title: 'New York City',
    type: 'place',
    slug: '/places/new-york-city/',
    description: 'Two views across the water, with more to add later.',
    coverPhotoId: 'new-york-city-049',
    photoIds: idsByPlace('New York City'),
  },
  {
    id: 'places/vietnam',
    title: 'Vietnam',
    type: 'place',
    slug: '/places/vietnam/',
    description: 'Green water, limestone cliffs, and river passages.',
    coverPhotoId: 'vietnam-056',
    photoIds: idsByPlace('Vietnam'),
  },
  {
    id: 'series/cities',
    title: 'Cities',
    type: 'series',
    slug: '/series/cities/',
    description: 'Streets, skylines, civic buildings, and city views.',
    coverPhotoId: 'japan-052',
    photoIds: seriesPhotoIds.cities,
  },
  {
    id: 'series/landscapes',
    title: 'Landscapes',
    type: 'series',
    slug: '/series/landscapes/',
    description: 'Mountains, coastlines, roads, and open views.',
    coverPhotoId: 'iceland-044',
    photoIds: seriesPhotoIds.landscapes,
  },
  {
    id: 'series/built-places',
    title: 'Built Places',
    type: 'series',
    slug: '/series/built-places/',
    description: 'Arches, bridges, rooms, facades, and built details.',
    coverPhotoId: 'spain-004',
    photoIds: seriesPhotoIds.built,
  },
  {
    id: 'series/waterlines',
    title: 'Waterlines',
    type: 'series',
    slug: '/series/waterlines/',
    description: 'Rivers, falls, harbors, coasts, and reflections.',
    coverPhotoId: 'vietnam-056',
    photoIds: seriesPhotoIds.waterlines,
  },
  {
    id: 'series/weather',
    title: 'Weather',
    type: 'series',
    slug: '/series/weather/',
    description: 'Cloud, rain, mist, late light, and other weather-led frames.',
    coverPhotoId: 'iceland-038',
    photoIds: seriesPhotoIds.weather,
  },
  {
    id: 'series/details',
    title: 'Details',
    type: 'series',
    slug: '/series/details/',
    description: 'Surfaces, symbols, textures, and close architectural details.',
    coverPhotoId: 'spain-024',
    photoIds: seriesPhotoIds.details,
  },
  {
    id: 'series/in-between',
    title: 'In Between',
    type: 'series',
    slug: '/series/in-between/',
    description: 'Transit, thresholds, held phones, small figures, and side views.',
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

validateCollections();

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
