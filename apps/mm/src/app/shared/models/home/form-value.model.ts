export interface FormValue {
  objects: [
    {
      properties: FormValueProperty[];
      requiresInitialization?: boolean;
      requiresUpdate?: boolean;
    },
  ];
}

export interface FormValueProperty {
  name: string;
  value: any;
  initialValue: any;
  dimension1: any;
}
