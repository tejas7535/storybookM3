export interface ViewToggle {
  id: number;
  title?: string;
  disabled?: boolean;
  icons?: ViewToggleIcon[];
}

export interface ViewToggleIcon {
  name: string;
  disabled?: boolean;
}
