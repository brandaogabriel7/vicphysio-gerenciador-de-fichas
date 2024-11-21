export default class Customer {
  private _id: string;
  private _name: string;

  constructor(id: string, name: string) {
    this._id = id;
    this._name = name;
    this._validate();
  }

  private _validate() {
    if (!this._id) {
      throw new Error('Id is required');
    }

    if (!this._name) {
      throw new Error('Name is required');
    }
  }

  changeName(name: string) {
    this._name = name;
    this._validate();
  }

  get id() {
    return this._id;
  }

  get name() {
    return this._name;
  }
}
