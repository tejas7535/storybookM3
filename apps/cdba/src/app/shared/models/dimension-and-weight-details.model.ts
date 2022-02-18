export class DimensionAndWeightDetails {
  constructor(
    public height: number,
    public width: number,
    public length: number,
    public unitOfDimension: string,
    public volumeCubic: number,
    public volumeUnit: string,
    public weight: number,
    public weightUnit: string
  ) {}
}
