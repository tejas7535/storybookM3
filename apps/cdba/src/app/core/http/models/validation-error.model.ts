export interface ValidationError {
  status: number;
  title: string;
  type: string;
  violations: Violation[];
}

interface Violation {
  field: string;
  message: string;
}
