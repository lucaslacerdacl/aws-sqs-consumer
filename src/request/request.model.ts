export class RequestModel {
  method!: 'POST' | 'PUT' | 'PATCH';
  url!: string;
  data!: unknown;
  headers!: unknown;
}
