export interface FilterOptions {
  hue: number;
  saturation: number;
  lightness: number;
  posterize: number;
  noise: number;
  contrast: number;

  position: { x: number, y: number };
  zoom: number;
}
