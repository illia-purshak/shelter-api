import { IsEnum, IsIn, IsInt, IsOptional, Min } from 'class-validator';

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

export function DefaultQueryParamsDto<T extends object>(
  sortFields: readonly (keyof T)[],
) {
  class QueryParamsDto {
    @IsOptional()
    @IsIn(sortFields)
    sortBy: keyof T = 'createdAt' as keyof T;

    @IsOptional()
    @IsIn([SortOrder.ASC, SortOrder.DESC])
    sortOrder: SortOrder = SortOrder.DESC;

    @IsOptional()
    @IsInt()
    @Min(1)
    page: number = PAGE_NUMBER_DEFAULT;

    @IsOptional()
    @IsInt()
    @Min(1)
    pageSize: number = PAGE_SIZE_DEFAULT;
  }

  return QueryParamsDto;
}
