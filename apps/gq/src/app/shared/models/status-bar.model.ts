export class StatusBar {
  constructor(
    public total = new StatusBarProperties(),
    public selected = new StatusBarProperties()
  ) {}
}

export class StatusBarProperties {
  constructor(
    public netValue = 0,
    public gpi = 0,
    public gpm = 0,
    public priceDiff = 0,
    public rows = 0
  ) {}
}
