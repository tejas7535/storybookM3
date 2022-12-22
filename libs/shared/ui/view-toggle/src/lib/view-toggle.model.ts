export interface ViewToggle {
  id: number;
  active: boolean;
  title?: string;
  disabled?: boolean;
  icons?: ViewToggleIcon[];
}

export interface ViewToggleIcon {
  name: string;
  disabled?: boolean;
}
