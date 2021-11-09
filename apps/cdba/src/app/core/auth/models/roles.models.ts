export interface RoleDescription {
  id: string;
  title: string;
  description: string;
}

export interface RoleDescriptions {
  productLines: RoleDescription[];
  subRegions: RoleDescription[];
}
