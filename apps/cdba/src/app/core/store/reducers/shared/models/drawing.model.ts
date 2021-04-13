export class Drawing {
  constructor(
    public description: string,
    public type: string,
    public typeDescription: string,
    public version: string,
    public number: string,
    public part: string,
    public status: string,
    public statusDescription: string,
    public date: Date,
    public filename: string,
    public filetype: string,
    public url: string
  ) {}
}
