export interface PictureCardAction {
  text: string;
  disabled: boolean;
  click?(): void;
  toggleAction?: boolean;
  selectAction?: boolean;
}
