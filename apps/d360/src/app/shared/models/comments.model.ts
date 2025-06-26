// POST
export interface CommentCreateRequest {
  text: string;
}

export enum Sort {
  ASC = 'asc',
  DESC = 'desc',
}

export interface CommentParams {
  startRow: number;
  endRow: number;
  sortModel?: { colId: string; sort: Sort }[];
  selectionFilters?: { [key: string]: string[] };
}

export enum CommentKeys {
  ID = 'id',
  TEXT = 'text',
  CREATED_BY_USER_ID = 'createdByUserId',
  CREATED_BY_USER_NAME = 'createdByUserName',
  CREATED_AT = 'createdAt',
}

export interface Comment {
  [CommentKeys.ID]: string;
  [CommentKeys.TEXT]: string;
  [CommentKeys.CREATED_BY_USER_ID]: string;
  [CommentKeys.CREATED_BY_USER_NAME]: string;
  [CommentKeys.CREATED_AT]: Date;
}
