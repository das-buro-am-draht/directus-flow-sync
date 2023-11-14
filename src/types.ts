import { FlowRaw, OperationRaw, Query } from '@directus/types';

type PrimaryKey = string | number;

export interface AbstractService<T> {
  createOne(item: Partial<T>): Promise<PrimaryKey>;

  deleteOne(key: PrimaryKey): Promise<PrimaryKey>;

  readByQuery(query: Query): Promise<T[]>;

  readOne(key: PrimaryKey, query?: Query): Promise<T>;

  updateOne(key: PrimaryKey, item: Partial<T>): Promise<PrimaryKey>;
}

export interface ServiceApi {
  flows: AbstractService<FlowRaw>;
  operations: AbstractService<OperationRaw>;
}
