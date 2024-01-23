export interface Card {
  mainTitle: string;
  svgIcon?: string;
  subTitle?: string;
  imagePath?: string;
  actionTitle?: string;
  action: () => void;
}
