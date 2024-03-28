import { IgnoreFlag } from '../../sales-summary/sales-row-details/enums/ignore-flag.enum';

export class UpdateIgnoreFlagParams {
  constructor(
    public combinedKey: string,
    public ignoreFlag: IgnoreFlag
  ) {}
}
