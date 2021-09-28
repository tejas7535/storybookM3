export interface Step {
  name: string;
  index: number;
  link: string;
}

export interface EnabledStep extends Step {
  enabled: boolean;
}
