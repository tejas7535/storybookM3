export interface HomepageCard {
  mainTitle: string;
  templateId: string;
  subTitle?: string;
  imagePath?: string;
  additionalDescription?: string;
  cardAction: () => void;
}
