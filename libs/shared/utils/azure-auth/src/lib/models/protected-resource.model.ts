export class ProtectedResource {
  public constructor(
    public route: string,
    public scopes: string[]
  ) {}
}
