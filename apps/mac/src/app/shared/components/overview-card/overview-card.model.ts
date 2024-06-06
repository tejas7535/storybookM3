export interface OverviewCard {
  image: string;
  icon: string;
  title: string;
  description: string;
  link: string;
  learnMoreLink?: string;
  noAccessText?: string;
  requestAccessLink?: string;
  disableImageHoverEffect?: boolean;
  learnMoreExternal?: boolean;
  external?: boolean;
  noAccess?: boolean;
  requiredRoles?: string[];
  inverted?: boolean;
  translationKey?: string;
}
