export class InputType {
  constructor(
    public readonly type: 'autocomplete' | 'select',
    public readonly label: string
  ) {}
}
