export interface Step {
  name: string;
  index: number;
  text: string;
  customContent: string;
  enabled?: boolean;
  complete?: boolean;
  editable?: boolean;
}
