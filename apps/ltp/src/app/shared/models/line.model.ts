export interface Line {
  color: string;
  value: number;
  label: {
    horizontalAlignment: string;
    position: string;
    verticalAlignment: string;
  };
  displayBehindSeries: boolean;
}
