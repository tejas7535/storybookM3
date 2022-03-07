export interface HttpCall {
  url: string;
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  status: number;
}

export const IGNORE_HTTP_CALLS: HttpCall[] = [
  {
    url: '/api/v1/user-settings',
    method: 'GET',
    status: 404,
  },
];
