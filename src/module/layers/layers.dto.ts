import { IntersectionType, OmitType, PartialType } from '@nestjs/swagger';
import { DefaultQueryParamsDto } from '@/common/meta/meta.js';
import {
  IsDateString,
  isInt,
  IsInt,
  IsOptional,
  IsString,
} from 'class-validator';
import { TransformToNumberArray } from '@/common/utils/transform-to-number-array.js';
import { TransformToStringArray } from '@/common/utils/transform-to-string-array.js';

export class LayerDto {
  @IsInt()
  public id: number;

  @IsString()
  public name: string;

  @IsOptional()
  @IsString()
  public description?: string;

  @IsInt()
  public position: number;

  @IsOptional()
  @IsString()
  public icon?: string;

  @IsDateString()
  public updatedAt: Date;

  @IsDateString()
  public createdAt: Date;
}

export class CreateLayerDto extends OmitType(LayerDto, [
  'id',
  'updatedAt',
  'createdAt',
]) {}
export class UpdateLayerDto extends PartialType(CreateLayerDto) {}

export const LAYER_SEARCH_WHITELIST = ['name', 'description'] as const;

export class LayerQueryDto extends DefaultQueryParamsDto({
  sortFields: ['id', 'name', 'description', 'updatedAt', 'createdAt'],
  searchFields: LAYER_SEARCH_WHITELIST,
  defaultSortBy: 'createdAt',
}) {
  @IsOptional()
  @IsInt({ each: true })
  @TransformToNumberArray()
  public id?: number[];

  @IsOptional()
  @IsString({ each: true })
  @TransformToStringArray()
  public name?: string[];

  @IsOptional()
  @IsString({ each: true })
  @TransformToStringArray()
  public description?: string[];

  @IsOptional()
  @IsDateString()
  public updatedAtFrom?: Date;

  @IsOptional()
  @IsDateString()
  public updatedAtTo?: Date;

  @IsOptional()
  @IsDateString()
  public createdAtFrom?: Date;

  @IsOptional()
  @IsDateString()
  public createdAtTo?: Date;
}
