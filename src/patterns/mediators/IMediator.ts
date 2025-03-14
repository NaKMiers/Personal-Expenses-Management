export interface IMediator {
  create(data: any, refresh?: any): any
  edit(id: string, data: any, update?: any): any
  validate(data: any, setError: any): boolean
}
