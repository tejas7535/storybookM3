import { AccountInfo as AzureAccountInfo } from '@azure/msal-browser';

export type AccountInfo = AzureAccountInfo & {
  department: string;
  backendRoles?: string[];
  accessToken?: string;
};
