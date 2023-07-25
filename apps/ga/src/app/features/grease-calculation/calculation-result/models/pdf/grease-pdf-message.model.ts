export interface GreasePdfMessageItem {
  title: string;
  items: string[];
}

export interface GreasePdfMessage {
  sectionTitle: string;
  messageItems: GreasePdfMessageItem[];
}
