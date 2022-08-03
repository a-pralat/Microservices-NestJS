import { AbstractDocument } from './abstract.schema';
import {
  Connection,
  FilterQuery,
  Model,
  SaveOptions,
  Types,
  UpdateQuery,
} from 'mongoose';
import { Logger, NotFoundException } from '@nestjs/common';

export abstract class AbstractRepository<TDoc extends AbstractDocument> {
  protected abstract readonly logger: Logger;

  constructor(
    protected readonly model: Model<TDoc>,
    private readonly connection: Connection,
  ) {}

  // TODO: make it more readable
  async create(
    document: Omit<TDoc, '_id'>,
    options?: SaveOptions,
  ): Promise<TDoc> {
    const createdDocument = new this.model({
      _id: new Types.ObjectId(),
      ...document,
    });

    return (await createdDocument.save(options)).toJSON() as TDoc;
  }

  async find(filterQuery: FilterQuery<TDoc>) {
    return this.model.find(filterQuery, {}, { lean: true });
  }

  async findOne(filterQuery: FilterQuery<TDoc>): Promise<TDoc> {
    const document = await this.model.findOne(filterQuery, {}, { lean: true });

    if (!document) {
      this.logger.warn('Document not found with filterQuery', filterQuery);
      // TODO: make enum for errors
      throw new NotFoundException('Document not found');
    }

    return document;
  }

  async findOneAndUpdate(
    filterQuery: FilterQuery<TDoc>,
    update: UpdateQuery<TDoc>,
  ): Promise<TDoc> {
    const document = await this.model.findOneAndUpdate(filterQuery, update, {
      lean: true,
      new: true,
    });

    if (!document) {
      this.logger.warn('Document not found with filterQuery', filterQuery);
      // TODO: make enum for errors
      throw new NotFoundException('Document not found');
    }

    return document;
  }

  async upsert(
    filterQuery: FilterQuery<TDoc>,
    document: Partial<TDoc>,
  ): Promise<TDoc> {
    return this.model.findOneAndUpdate(filterQuery, document, {
      lean: true,
      new: true,
      upsert: true,
    });
  }

  // TODO: make delete function
  // async delete(id) {
  // }

  async startTransaction() {
    const session = await this.connection.startSession();
    session.startTransaction();
    return session;
  }
}
