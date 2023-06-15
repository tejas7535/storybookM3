export interface GQUser {
  id: string;
  name: string;
}

export interface ActiveDirectoryUser {
  userId: string;
  firstName: string;
  lastName: string;
}

export interface MicrosoftUser {
  givenName: string;
  surname: string;
  displayName: string;
  userPrincipalName: string;
}

export interface MicrosoftUsersResponse {
  value: MicrosoftUser[];
}
