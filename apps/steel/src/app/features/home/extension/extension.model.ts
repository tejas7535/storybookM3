export interface Extension {
  name: string;
  description: string;
  WIP: boolean;
  path?: string;
  image?: string;
  icon?: string;
  manifest?: string;
  longDescription?: string;
  howToUse?: string[];
  notice?: string[];
  permissions?: string;
  screenshots?: string[];
}
