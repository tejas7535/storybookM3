export interface HomepageCard {
  mainTitle: string;
  templateId: string;
  subTitle?: string;
  imagePath?: string;
  cardAction: () => void;
}
