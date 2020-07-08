export interface OAuthRole {
  scheme: string;
  token: string;
  scopes: string[];
  flow: string;
}

export interface IotThing {
  '@context': Object[] | string[];
  id: string;
  description: string;
  descriptions: Object;
  securityDefinitions: { [key: string]: OAuthRole };
  security: string[];
  properties: { windTurbineProperties: Object; message: Object };
  events: { sensorDataStream: Object; forms: Object };
}
