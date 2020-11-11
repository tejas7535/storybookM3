export interface AccessToken {
  acr: string;
  aio: string;
  amr: string[];
  appid: string;
  appidacr: string;
  aud: string;
  exp: number;
  family_name: string;
  given_name: string;
  iat: number;
  ipaddr: string;
  iss: string;
  name: string;
  nbf: number;
  oid: string;
  onprem_sid: string;
  rh: string;
  roles: string[];
  scp: string;
  sub: string;
  tid: string;
  unique_name: string;
  upn: string;
  uti: string;
  ver: string;
}
