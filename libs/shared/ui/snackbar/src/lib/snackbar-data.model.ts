import { SnackBarType } from './snackbar-type.enum';

export class SnackBarData {
  constructor(
    public message: string,
    public action: string,
    public type: SnackBarType
  ) {}
}
