export interface Step {
  name: string;
  index: number;
  link: string;
  enabled?: boolean;
  complete?: boolean;
  editable?: boolean;
}
