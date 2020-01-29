export class FileStatus {
  public constructor(
    public fileName: string,
    public fileType: string,
    public success?: boolean
  ) {}
}
