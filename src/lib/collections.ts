import { collections, type Collection } from '@/data/collections';
import { getPhoto, type Photo } from '@/data/photos';

export function photosForCollection(collection: Collection): Photo[] {
  return collection.photoIds.map(getPhoto);
}

export function collectionSlugSegment(collection: Collection): string {
  return collection.slug.split('/').filter(Boolean).at(-1) ?? '';
}

export function relatedCollections(photo: Photo): Collection[] {
  return collections.filter((collection) => collection.photoIds.includes(photo.id));
}
