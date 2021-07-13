export interface FormValue {
  objects: [
    {
      properties: FormValueProperty[];
    }
  ];
}

export interface FormValueProperty {
  name: string;
  value: any;
  initialValue: any;
  dimension1: any;
}
