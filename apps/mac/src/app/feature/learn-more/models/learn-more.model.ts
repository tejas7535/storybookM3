export interface LearnMoreData {
  translocoKey: string;
  imgUrl?: string;
  svgIconUrl?: string;
  guides: GuideGroup[];
  linkGroups: LinkGroup[];
  requiredRoles?: string[];
  samsLink?: string;
  appLink: string;
}

export interface LinkGroup {
  title: string;
  links: { uri: string; name: string }[];
}

export interface GuideGroup {
  title: string;
  content: string;
  image?: string;
}
