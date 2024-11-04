export const LAYOUT_IDS = ['1', '2'] as const;

export type LayoutId = (typeof LAYOUT_IDS)[number];

export const LOCALSTORAGE_LAYOUT = 'material-customer-selected-layout';
