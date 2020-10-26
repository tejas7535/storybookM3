export class Page<ContentType> {
  constructor(
    public totalPageCount: number,
    public totalItemsCount: number,
    public pageNumber: number,
    public pageSize: number,
    public content: ContentType[]
  ) {}
}
