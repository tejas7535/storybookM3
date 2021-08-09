export class DoughnutSeriesConfig {
  public constructor(
    public data: { value: number; name?: string }[],
    public title: string,
    public color: string,
    public subTitle?: string
  ) {}
}
