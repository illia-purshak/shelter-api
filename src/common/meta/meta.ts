import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
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
  @ApiProperty({ type: Number, example: 10 })
  pageSize: number;

  @ApiProperty({ type: Number, example: 1 })
  currentPage: number;

  @ApiProperty({ type: Number, example: 5 })
  totalPages: number;

  @ApiProperty({ type: Boolean, example: true })
  hasNextPage: boolean;

  @ApiProperty({ type: Boolean, example: false })
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
    @ApiPropertyOptional({
      enum: [...opts.searchFields],
      description: 'Limit `search` to one field',
    })
    @IsOptional()
    @IsIn(opts.searchFields)
    searchField?: keyof searchFields;

    @ApiPropertyOptional({
      type: String,
      minLength: 3,
      maxLength: 100,
      description: 'Case-insensitive partial match',
      example: 'shelter',
    })
    @IsOptional()
    @IsString()
    @MinLength(3)
    @MaxLength(100)
    search?: string;

    @ApiPropertyOptional({
      enum: [...opts.sortFields],
      default: opts.defaultSortBy,
    })
    @IsOptional()
    @IsIn(opts.sortFields)
    sortBy: sortFields = opts.defaultSortBy;

    @ApiPropertyOptional({
      enum: SortOrder,
      default: SortOrder.DESC,
      description: 'Case-insensitive',
    })
    @IsOptional()
    @Transform(({ value }) => String(value).toUpperCase())
    @IsEnum(SortOrder)
    sortOrder: SortOrder = SortOrder.DESC;

    @ApiPropertyOptional({
      type: Number,
      minimum: 1,
      default: PAGE_NUMBER_DEFAULT,
    })
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    page: number = PAGE_NUMBER_DEFAULT;

    @ApiPropertyOptional({
      type: Number,
      minimum: 1,
      maximum: 100,
      default: PAGE_SIZE_DEFAULT,
    })
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    @Max(100)
    pageSize: number = PAGE_SIZE_DEFAULT;
  }

  return QueryParamsDto;
}
