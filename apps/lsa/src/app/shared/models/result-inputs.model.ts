export interface ResultInputModel {
  sections: LubricationInputSection[];
}

export interface LubricationInputSection {
  title: string;
  stepIndex: number;
  inputs: LubricationInput[];
}

export interface LubricationInput {
  title: string;
  value: string | number;
}
