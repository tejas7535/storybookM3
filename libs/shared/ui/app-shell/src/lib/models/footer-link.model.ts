export interface AppShellFooterLink {
  link: string;
  title: string;
  external?: boolean;
  onClick?: ($event: MouseEvent) => void;
}
