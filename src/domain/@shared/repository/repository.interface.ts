interface RepositoryInterface<T> {
  create(entity: T): Promise<T>;
  update(entity: T): Promise<T>;
  delete(id: string): Promise<T>;
  find(id: string): Promise<T>;
  findAll(): Promise<T[]>;
}

export default RepositoryInterface;
