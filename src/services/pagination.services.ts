import { Injectable } from '@nestjs/common';
import { Model, PopulateOptions, SortOrder } from 'mongoose';

export interface IPaginationParams {
  limit: number;
  page: string;
  sortCriteria: string | { [key: string]: SortOrder };
}

@Injectable()
export class PaginationService {
  private DEFAULT_STEP: number = 1;
  constructor() {}

  async paginate<T>({
    MongoModel,
    filters,
    paginationParams,
    populateParams,
  }: {
    MongoModel: Model<T>;
    filters: Record<string, any>;
    paginationParams: IPaginationParams;
    populateParams?: Array<{
      path: string;
      select?: Array<string>;
      populate?: {
        path?: string;
        model?: string;
      };
    }>;
  }) {
    const { limit, sortCriteria, page } = paginationParams;
    if (Number.isNaN(parseInt(page))) {
      return { nextPage: null, data: [] };
    }

    const offset = (parseInt(page) - this.DEFAULT_STEP) * limit;

    const data = await MongoModel.find(filters)
      .populate(populateParams as unknown as PopulateOptions)
      .skip(offset)
      .limit(limit)
      .sort(sortCriteria)
      .exec();

    return { nextPage: data.length >= limit ? parseInt(page) + 1 : null, data };
  }
}
