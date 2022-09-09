import { DataResult, MaterialFormValue } from '@mac/msd/models';

export interface DialogData {
  editMaterial?: {
    row: DataResult;
    parsedMaterial: Partial<MaterialFormValue>;
    column: string;
    materialNames: { id: number; materialName: string }[];
    standardDocuments: { id: number; standardDocument: string }[];
  };
  minimizedDialog?: { id: number; value: Partial<MaterialFormValue> };
}
