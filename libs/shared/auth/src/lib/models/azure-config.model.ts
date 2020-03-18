export class AzureConfig {
  public constructor(
    public tenantId: string,
    public clientId: string,
    public appId: string,
    public showDebugInfo: boolean
  ) {}
}
