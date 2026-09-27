import { Transform, Type } from 'class-transformer';
import {
  IsEnum,
  IsIn,
  IsInt,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';

export class MetaDto {
  pageSize: number;
  currentPage: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export class ResponseListDto<T> {
  items: T[];
  meta: MetaDto;
}

export enum SortOrder {
  ASC = 'ASC',
  DESC = 'DESC',
}

const PAGE_NUMBER_DEFAULT = 1;
const PAGE_SIZE_DEFAULT = 10;

// TODO: add ?include= and ?fields= Q params
export function DefaultQueryParamsDto<
  const sortFields extends string,
  const searchFields extends string,
>(opts: {
  sortFields: readonly sortFields[];
  searchFields: readonly searchFields[];
  defaultSortBy: NoInfer<sortFields>;
}) {
  class QueryParamsDto {
    @IsOptional()
    @IsIn(opts.searchFields)
    searchField?: keyof searchFields;

    @IsOptional()
    @IsString()
    @MinLength(3)
    @MaxLength(100)
    search?: string;

    @IsOptional()
    @IsIn(opts.sortFields)
    sortBy: sortFields = opts.defaultSortBy;

    @IsOptional()
    @Transform(({ value }) => String(value).toUpperCase())
    @IsEnum(SortOrder)
    sortOrder: SortOrder = SortOrder.DESC;

    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    page: number = PAGE_NUMBER_DEFAULT;

    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    @Max(100)
    pageSize: number = PAGE_SIZE_DEFAULT;
  }

  return QueryParamsDto;
}
