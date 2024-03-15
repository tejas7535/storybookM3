export interface PictureCardAction {
  text: string;
  disabled: boolean;
  toggleAction?: boolean;
  selectAction?: boolean;
  click?(): void;
}
