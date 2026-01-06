
export enum ContentType {
  IMAGE = 'image',
  VIDEO = 'video',
  TEXT = 'text',
  MONITOR = 'monitor',
  WEB_H5 = 'webh5',
  QUEUE_TABLE = 'queueTable',
  WEATHER = 'weather',
  PRODUCT = 'product',
  CAROUSEL_TABLE = 'carouselTable'
}

export enum ItemType {
  ROOM = 'room',
  CINEMA = 'cinema',
  STUDY = 'study'
}

export interface FieldConfig {
  id: string;
  label: string;
  enabled: boolean;
  fontSize: number;
  color: string;
  isBold: boolean;
  order: number;
  // Spatial coordinates for layout editing (relative to cell container 0-100)
  x: number;
  y: number;
}

export interface CarouselConfig {
  itemType: ItemType;
  rows: number;
  cols: number;
  width: number;
  height: number;
  duration: number; // in seconds
  fields: FieldConfig[];
}

export interface AppState {
  activeLayers: ContentType[];
  selectedType: ContentType | null;
  carousel: CarouselConfig;
  productConfig: any;
  queueConfig: any;
  isEditingLayout: boolean; // Tracking layout editing mode
}
