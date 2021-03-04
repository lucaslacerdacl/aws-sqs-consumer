export enum Methods {
  POST = 'POST',
  PUT = 'PUT',
  PATCH = 'PATCH',
}

export interface RequestModel {
  method: Methods;
  url: string;
  data: unknown;
  headers: unknown;
}
