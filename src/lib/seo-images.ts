import type { Collection } from '@/data/collections';
import { getPhoto, type Photo } from '@/data/photos';
import { photoImage } from './media';

export type SeoImage = {
  src: string;
  width: number;
  height: number;
  alt: string;
};

export async function photoSeoImage(photo: Photo): Promise<SeoImage> {
  const image = await photoImage(photo, 'detail');

  return {
    src: image.src,
    width: image.width,
    height: image.height,
    alt: photo.alt,
  };
}

export function collectionCoverPhoto(collection: Collection): Photo {
  return getPhoto(collection.coverPhotoId);
}

export async function collectionSeoImage(collection: Collection): Promise<SeoImage> {
  return photoSeoImage(collectionCoverPhoto(collection));
}
