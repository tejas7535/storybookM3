export class UpdateDatesParams {
  constructor(
    public combinedKey: string,
    public verifiedEopDate: string,
    public edoDate: string
  ) {}
}
