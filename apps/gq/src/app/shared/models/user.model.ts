export interface GQUser {
  id: string;
  name: string;
}

export interface ActiveDirectoryUser {
  userId: string;
  firstName: string;
  lastName: string;
  mail?: string;
}

export interface MicrosoftUser {
  givenName: string;
  surname: string;
  displayName: string;
  userPrincipalName: string;
  mail: string;
}

export interface MicrosoftUsersResponse {
  value: MicrosoftUser[];
}
