import { HeaderClassParams } from 'ag-grid-community';

export const COLUMN_MOVE_STYLE_GROUPS = (p: HeaderClassParams) =>
  p.context.activeDrag() ? { 'background-color': '#F1F1F1' } : {};
