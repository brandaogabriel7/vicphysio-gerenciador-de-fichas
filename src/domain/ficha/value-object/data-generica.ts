import Data from './data';

export default class DataGenerica {
  private _data: Data;

  constructor(data: string | Date) {
    this._data = new Data(data);
  }

  formatar(): string {
    return this._data.formatar();
  }
}
