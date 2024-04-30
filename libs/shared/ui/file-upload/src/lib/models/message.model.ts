export interface Message {
  id?: string | number;
  type: 'error' | 'warning' | 'info';
  title: string;
  description: string;
}
