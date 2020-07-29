import { FlowType } from './flow-type.enum';

export class AzureConfig {
  public constructor(
    public tenantId: string,
    public clientId: string,
    public appId: string,
    public flow: FlowType,
    public showDebugInfo: boolean,
    public loginUrl: string = 'https://login.microsoftonline.com/',
    public redirectUrl: string = ''
  ) {}
}
