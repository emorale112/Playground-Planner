export type ElementType = 'soccer' | 'playground' | 'coop' | 'garden' | 'building' | 'custom' | 'turf' | 'sod' | 'peagravel' | 'toddler' | 'tree' | 'play_structure' | 'play_zone' | 'walkway' | 'plot_outline' | 'gazebo' | 'shed' | 'picnic_table' | 'soccer_field' | 'play_set';

export type ElementShape = 'rect' | 'ellipse' | 'triangle' | 'l-shape' | 'polygon';

export interface PlaygroundElement {
  id: string;
  type: ElementType;
  name: string;
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
  shape?: ElementShape;
  variant?: 'solid' | 'outline';
  rotation?: number;
  points?: {x: number, y: number}[];
}
