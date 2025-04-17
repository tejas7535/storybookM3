export interface Margins {
  left: number;
  top: number;
  bottom: number;
  right: number;
}

export type Paddings = Margins;

export interface FontOptions {
  fontFamily?: string;
  fontStyle?: string;
  fontSize?: number;
}

export enum ControlCommands {
  PageBreak = 'PageBreak',
}
