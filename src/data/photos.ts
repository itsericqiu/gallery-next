export type AssetProvider = 'local' | 'r2';

export type Photo = {
  id: string;
  title?: string;
  caption?: string;
  alt: string;
  width: number;
  height: number;
  place?: string;
  year?: number;
  tags: string[];
  asset: {
    provider: AssetProvider;
    key: string;
  };
};

type PhotoTuple = [
  id: string,
  place: string | undefined,
  key: string,
  width: number,
  height: number,
  tags: string[],
];

const entries: PhotoTuple[] = [
  ['misc-061', undefined, 'Misc/eric-qiu-gallery-61.jpg', 2249, 4000, ['cities', 'built', 'details']],
  ['misc-058', undefined, 'Misc/eric-qiu-gallery-58.jpg', 6000, 4000, ['landscapes', 'waterlines', 'weather']],
  ['misc-059', undefined, 'Misc/eric-qiu-gallery-59.jpg', 5775, 3850, ['landscapes', 'weather']],
  ['misc-053', undefined, 'Misc/eric-qiu-gallery-53.jpg', 4000, 6000, ['in-between']],
  ['misc-047', undefined, 'Misc/eric-qiu-gallery-47.jpg', 2933, 3911, ['cities', 'in-between']],
  ['spain-014', 'Spain', 'Spain/eric-qiu-gallery-14.jpg', 6000, 4000, ['cities', 'built']],
  ['spain-002', 'Spain', 'Spain/eric-qiu-gallery-02.jpg', 6035, 8047, ['landscapes', 'built']],
  ['spain-003', 'Spain', 'Spain/eric-qiu-gallery-03.jpg', 7414, 5561, ['landscapes', 'built', 'weather']],
  ['spain-017', 'Spain', 'Spain/eric-qiu-gallery-17.jpg', 3642, 5463, ['built', 'details']],
  ['spain-013', 'Spain', 'Spain/eric-qiu-gallery-13.jpg', 3791, 5686, ['cities', 'built']],
  ['spain-007', 'Spain', 'Spain/eric-qiu-gallery-07.jpg', 6000, 4000, ['cities', 'built', 'weather']],
  ['spain-012', 'Spain', 'Spain/eric-qiu-gallery-12.jpg', 3773, 5660, ['built', 'weather']],
  ['spain-004', 'Spain', 'Spain/eric-qiu-gallery-04.jpg', 4488, 7979, ['built', 'details']],
  ['spain-010', 'Spain', 'Spain/eric-qiu-gallery-10.jpg', 6000, 4000, ['cities', 'built', 'weather']],
  ['spain-011', 'Spain', 'Spain/eric-qiu-gallery-11.jpg', 3874, 5811, ['cities', 'built', 'weather']],
  ['spain-005', 'Spain', 'Spain/eric-qiu-gallery-05.jpg', 6048, 8064, ['landscapes', 'built']],
  ['spain-020', 'Spain', 'Spain/eric-qiu-gallery-20.jpg', 3024, 4032, ['built', 'in-between']],
  ['spain-009', 'Spain', 'Spain/eric-qiu-gallery-09.jpg', 3984, 5976, ['built', 'in-between']],
  ['spain-023', 'Spain', 'Spain/eric-qiu-gallery-23.jpg', 8064, 6048, ['built', 'details']],
  ['spain-022', 'Spain', 'Spain/eric-qiu-gallery-22.jpg', 1924, 2886, ['built', 'details']],
  ['spain-019', 'Spain', 'Spain/eric-qiu-gallery-19.jpg', 3795, 5693, ['built', 'details']],
  ['spain-025', 'Spain', 'Spain/eric-qiu-gallery-25.jpg', 6048, 8064, ['built', 'details']],
  ['spain-024', 'Spain', 'Spain/eric-qiu-gallery-24.jpg', 3024, 4032, ['built', 'details']],
  ['japan-051', 'Japan', 'Japan/eric-qiu-gallery-51.jpg', 3941, 5912, ['cities']],
  ['japan-052', 'Japan', 'Japan/eric-qiu-gallery-52.jpg', 7485, 11227, ['cities', 'weather', 'in-between']],
  ['london-029', 'London', 'London/eric-qiu-gallery-29.jpg', 3134, 4701, ['cities', 'built']],
  ['london-028', 'London', 'London/eric-qiu-gallery-28.jpg', 3020, 4027, ['cities', 'built']],
  ['london-027', 'London', 'London/eric-qiu-gallery-27.jpg', 2932, 3910, ['cities', 'weather']],
  ['london-031', 'London', 'London/eric-qiu-gallery-31.jpg', 3007, 4008, ['cities', 'in-between']],
  ['london-030', 'London', 'London/eric-qiu-gallery-30.jpg', 3218, 4827, ['cities', 'built']],
  ['vietnam-057', 'Vietnam', 'Vietnam/eric-qiu-gallery-57.jpg', 6048, 8064, ['landscapes', 'waterlines', 'in-between']],
  ['vietnam-056', 'Vietnam', 'Vietnam/eric-qiu-gallery-56.jpg', 8064, 6048, ['landscapes', 'waterlines', 'weather']],
  ['vietnam-055', 'Vietnam', 'Vietnam/eric-qiu-gallery-55.jpg', 3024, 4032, ['landscapes', 'waterlines']],
  ['new-york-city-049', 'New York City', 'New York City/eric-qiu-gallery-49.jpg', 6000, 4000, ['cities', 'waterlines']],
  ['new-york-city-048', 'New York City', 'New York City/eric-qiu-gallery-48.jpg', 4000, 6000, ['cities', 'waterlines', 'weather']],
  ['iceland-038', 'Iceland', 'Iceland/eric-qiu-gallery-38.jpg', 3173, 4760, ['landscapes', 'waterlines', 'weather']],
  ['iceland-039', 'Iceland', 'Iceland/eric-qiu-gallery-39.jpg', 4000, 6000, ['landscapes', 'weather', 'in-between']],
  ['iceland-042', 'Iceland', 'Iceland/eric-qiu-gallery-42.jpg', 6000, 4000, ['landscapes', 'waterlines']],
  ['iceland-040', 'Iceland', 'Iceland/eric-qiu-gallery-40.jpg', 6000, 4000, ['landscapes', 'built', 'weather']],
  ['iceland-045', 'Iceland', 'Iceland/eric-qiu-gallery-45.jpg', 3086, 4629, ['landscapes', 'waterlines']],
  ['iceland-044', 'Iceland', 'Iceland/eric-qiu-gallery-44.jpg', 6000, 4000, ['landscapes', 'weather']],
  ['iceland-046', 'Iceland', 'Iceland/eric-qiu-gallery-46.jpg', 4000, 3091, ['landscapes', 'waterlines', 'details']],
  ['iceland-034', 'Iceland', 'Iceland/eric-qiu-gallery-34.jpg', 4241, 5655, ['landscapes', 'in-between']],
  ['iceland-035', 'Iceland', 'Iceland/eric-qiu-gallery-35.jpg', 3024, 4032, ['landscapes', 'waterlines', 'weather']],
  ['iceland-037', 'Iceland', 'Iceland/eric-qiu-gallery-37.jpg', 5931, 8897, ['landscapes']],
  ['iceland-032', 'Iceland', 'Iceland/eric-qiu-gallery-32.jpg', 3262, 4893, ['landscapes', 'waterlines', 'weather']],
  ['iceland-033', 'Iceland', 'Iceland/eric-qiu-gallery-33.jpg', 3969, 2646, ['landscapes', 'waterlines', 'in-between']],
];

const metadata: Record<string, Pick<Photo, 'title' | 'caption' | 'alt'>> = {
  'misc-061': {
    title: 'City Hall, Sideways',
    caption: 'A side angle on City Hall, mostly flag and clock.',
    alt: 'Canadian flag flying in front of a city hall building.',
  },
  'misc-058': {
    title: 'Afterglow',
    caption: 'Last color reflected across a still lake.',
    alt: 'Sunset colors reflected on a calm lake surrounded by dark mountains.',
  },
  'misc-059': {
    title: 'Ridge Light',
    caption: 'A short break in the clouds over the ridge.',
    alt: 'Green mountain ridge beneath bright clouds and distant snow-covered peaks.',
  },
  'misc-053': {
    title: 'On the Phone',
    caption: 'A photo being shown on a phone between stops.',
    alt: 'Person holding a phone showing a photo while seated outdoors.',
  },
  'misc-047': {
    title: 'Night Tram',
    caption: 'A red tram in the rain. Hard to improve on that.',
    alt: 'Red tram approaching at night on a rainy city street.',
  },
  'spain-014': {
    title: 'Plaza de Espana',
    caption: 'Evening light across the tilework, with a rare gap in the crowd.',
    alt: 'Arcades and tiled plaza at Plaza de Espana in warm evening light.',
  },
  'spain-002': {
    title: 'Above the City',
    caption: 'A hillside overlook above the city, taken mostly for the layers.',
    alt: 'View over a Spanish city from a tree-lined hillside overlook.',
  },
  'spain-003': {
    title: 'Alhambra Weather',
    caption: 'The Alhambra under a heavy sky.',
    alt: 'Alhambra walls and city view beneath a dramatic cloudy sky.',
  },
  'spain-017': {
    title: 'Courtyard',
    caption: 'Tile, shade, columns, and a narrow channel of water.',
    alt: 'Arched courtyard with tiled walls, columns, and a narrow reflecting channel.',
  },
  'spain-013': {
    title: 'Between Columns',
    caption: 'The plaza from the shaded side of the columns.',
    alt: 'View of an ornate Spanish plaza through dark brick columns.',
  },
  'spain-007': {
    title: 'Blue Hour',
    caption: 'The plaza lit up under a darkening sky.',
    alt: 'Illuminated Spanish plaza at blue hour beneath dark clouds.',
  },
  'spain-012': {
    title: 'Last Light, Arches',
    caption: 'Brick arches and towers catching the last light.',
    alt: 'Brick arcade and towers lit by sunset with a dramatic sky.',
  },
  'spain-004': {
    title: 'Stone Lace',
    caption: 'Carved stone catching warm light near the edge of the arch.',
    alt: 'Detailed carved stone arch with warm light passing through.',
  },
  'spain-010': {
    title: 'Open Square',
    caption: 'An open plaza under a pale evening sky.',
    alt: 'Wide Spanish plaza with ornate buildings and soft evening clouds.',
  },
  'spain-011': {
    title: 'Tower and Fountain',
    caption: 'A fountain and tower beneath fast-moving clouds.',
    alt: 'Spanish tower and fountain under dramatic evening clouds.',
  },
  'spain-005': {
    title: 'Granada Hillside',
    caption: 'White roofs, cypress trees, and the Alhambra above the hillside.',
    alt: 'Granada hillside with cypress trees, white buildings, and fortress walls.',
  },
  'spain-020': {
    title: 'Green Gate',
    caption: 'A green door set into old stone. Not the main doorway, but the better color.',
    alt: 'Old stone gate and cypress tree beside a quiet courtyard.',
  },
  'spain-009': {
    title: 'From the Arcade',
    caption: 'The plaza seen from under the arches.',
    alt: 'View through shaded arches toward an ornate Spanish plaza.',
  },
  'spain-023': {
    title: 'Courtyard Sky',
    caption: 'Balconies framing a square of blue sky.',
    alt: 'Looking up through a square courtyard toward blue sky and surrounding balconies.',
  },
  'spain-022': {
    title: 'Casa Batllo',
    caption: 'Curved facade and roofline in direct sun.',
    alt: 'Curved yellow facade and roof details of Casa Batllo under blue sky.',
  },
  'spain-019': {
    title: 'Yellow Facade',
    caption: 'A bright church facade with red doors.',
    alt: 'Yellow and white church facade with red doors and round windows.',
  },
  'spain-025': {
    title: 'Palau',
    caption: 'Stained glass and painted surfaces overhead. Not a subtle room.',
    alt: 'Ornate concert hall interior with stained glass and painted architectural details.',
  },
  'spain-024': {
    title: 'Tile Column',
    caption: 'Patterned tile columns in close detail.',
    alt: 'Close view of colorful patterned tile columns.',
  },
  'japan-051': {
    title: 'Tokyo Tower, Night',
    caption: 'Tokyo Tower above the street, not exactly hiding.',
    alt: 'Tokyo Tower glowing orange above a nighttime city street.',
  },
  'japan-052': {
    title: 'Rain at Senso-ji',
    caption: 'A rainy approach to Senso-ji under the lantern.',
    alt: 'Rainy temple entrance with a large red lantern and a person holding an umbrella.',
  },
  'london-029': {
    title: 'Under the Bridge',
    caption: 'The Shard framed by the bridge structure.',
    alt: 'The Shard seen through bridge structure above a busy London street.',
  },
  'london-028': {
    title: "St. Paul's Passage",
    caption: "St. Paul's seen through a narrow gap between buildings.",
    alt: "St. Paul's Cathedral dome seen between narrow London buildings.",
  },
  'london-027': {
    title: "St. Paul's, From Above",
    caption: "St. Paul's and the surrounding rooftops under cloud.",
    alt: "St. Paul's Cathedral and London skyline under a cloudy sky.",
  },
  'london-031': {
    title: 'Over London',
    caption: 'London and the Thames from the plane, before the window got worse.',
    alt: 'Aerial view of London and the Thames beside an airplane engine.',
  },
  'london-030': {
    title: 'Palace Gates',
    caption: 'Buckingham Palace, its gates, and the crowd outside.',
    alt: 'Buckingham Palace facade and gates with people gathered outside.',
  },
  'vietnam-057': {
    title: 'River Passage',
    caption: 'Small boats moving between limestone cliffs.',
    alt: 'Small boats traveling between steep green limestone cliffs.',
  },
  'vietnam-056': {
    title: 'Still Water',
    caption: 'Limestone cliffs reflected in calm water.',
    alt: 'Limestone cliffs reflected in calm water beneath a bright cloudy sky.',
  },
  'vietnam-055': {
    title: 'Green Karst',
    caption: 'Green limestone cliffs and their reflection.',
    alt: 'Green limestone karst cliffs and vegetation reflected in water.',
  },
  'new-york-city-049': {
    title: 'Lower Manhattan',
    caption: 'Lower Manhattan from across the water, exactly as advertised.',
    alt: 'Lower Manhattan skyline seen across the water in daylight.',
  },
  'new-york-city-048': {
    title: 'Violet Skyline',
    caption: 'The skyline in pink and violet light after sunset.',
    alt: 'Manhattan skyline and waterfront under pink and violet evening light.',
  },
  'iceland-038': {
    title: 'Waterfall Weather',
    caption: 'Low cloud, wet rock, and too much spray for a clean lens.',
    alt: 'Icelandic waterfall beneath misty low clouds and green hills.',
  },
  'iceland-039': {
    title: 'Window to Snow',
    caption: 'Snow outside, orange window frame inside.',
    alt: 'Snowy Icelandic landscape seen from beside a warm orange window frame.',
  },
  'iceland-042': {
    title: 'Sea Arch',
    caption: 'A hole in the cliff, ocean showing through.',
    alt: 'Rock sea arch and cliffs along the Icelandic coast.',
  },
  'iceland-040': {
    title: 'Orange Lighthouse',
    caption: 'An orange lighthouse against a very gray afternoon.',
    alt: 'Orange lighthouse in Iceland with mountains and clouds behind it.',
  },
  'iceland-045': {
    title: 'Whale Surface',
    caption: 'A whale surfacing in blue water for about a second.',
    alt: 'Whale surfacing in blue water with distant mountains behind.',
  },
  'iceland-044': {
    title: 'Black Mountain',
    caption: 'Dark mountain, gold moss, low cloud.',
    alt: 'Dark Icelandic mountain under heavy clouds with golden mossy plain below.',
  },
  'iceland-046': {
    title: 'Seals on the Rocks',
    caption: 'Seals resting on rocks along the shoreline.',
    alt: 'Seals resting on rocks along a bright Icelandic shoreline.',
  },
  'iceland-034': {
    title: 'Gravel Road',
    caption: 'A person walking a gravel road toward the mountains.',
    alt: 'Person walking along a gravel road toward distant Icelandic mountains.',
  },
  'iceland-035': {
    title: 'Cliff Edge',
    caption: 'Green cliffs and a waterfall above the coast.',
    alt: 'Green Icelandic cliffs with a waterfall dropping toward the coast.',
  },
  'iceland-037': {
    title: 'Moss Wall',
    caption: 'Moss, rock, and shadow in a steep ravine.',
    alt: 'Steep mossy ravine and dark rock wall in Iceland.',
  },
  'iceland-032': {
    title: 'Blue Steam',
    caption: 'Steam rising from a blue geothermal pool.',
    alt: 'Blue geothermal pool steaming beneath a cloudy Icelandic sky.',
  },
  'iceland-033': {
    title: 'Tail, Fjord',
    caption: 'A whale tail above the water with mountains behind it.',
    alt: 'Whale tail rising from water with mountains in the background.',
  },
};

export const photos: Photo[] = entries.map(([id, place, key, width, height, tags]) => ({
  id,
  title: metadata[id]?.title,
  caption: metadata[id]?.caption,
  alt: metadata[id]?.alt ?? (place ? `Photograph from ${place}` : 'Photograph by Eric Qiu'),
  width,
  height,
  place,
  tags,
  asset: {
    provider: 'local',
    key,
  },
}));

export const photoById = new Map(photos.map((photo) => [photo.id, photo]));

export function getPhoto(id: string): Photo {
  const photo = photoById.get(id);
  if (!photo) {
    throw new Error(`Unknown photo: ${id}`);
  }
  return photo;
}
