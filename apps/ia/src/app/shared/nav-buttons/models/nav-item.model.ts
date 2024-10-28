export class NavItem {
  constructor(
    public label: string,
    public translation: string,
    public badge?: string,
    public icon?: 'info' | 'warning',
    public tooltipTranslation?: string
  ) {}
}
