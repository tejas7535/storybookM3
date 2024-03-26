export interface HardnessConversionFormValue {
  initialInput: {
    inputValue: number | null;
    inputUnit: string;
  };
  additionalInput: {
    [0]: number | null;
    [1]: number | null;
  }[];
}
