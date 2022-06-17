export interface DialogResponseListValue {
  id: string;
  text: string;
  imageUrl?: string;
}

export interface DialogResponseMember {
  id: string;
  text: string;
  type: string;
  listValues: DialogResponseListValue[];
  defaultValue: string;
}

export interface DialogResponseGroup {
  isIteratorGroup: boolean;
  members: DialogResponseMember[];
}

export interface DialogResponsePageVisibility {
  value: boolean;
}

export interface DialogResponsePage {
  id: string;
  title: string;
  text: string;
  visible: DialogResponsePageVisibility;
  groups: DialogResponseGroup[];
  subPages?: [];
  helpId?: string;
  runtimeId?: string;
}

export interface DialogResponse {
  pages: DialogResponsePage[];
}
