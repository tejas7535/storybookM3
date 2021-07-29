import { SnackBarType } from './snackbar-type.enum';

export class SnackBarData {
  public constructor(
    public message: string,
    public action: string | undefined,
    public type: SnackBarType
  ) {}
}
