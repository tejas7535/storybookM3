export interface LinkGroup {
  title: string;
  links: {
    text: string;
    uri: string;
  }[];
}

export type LinkGroups = LinkGroup[];
