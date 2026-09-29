import {
  ApiProperty,
  ApiPropertyOptional,
  OmitType,
  PartialType,
} from '@nestjs/swagger';
import { DefaultQueryParamsDto } from '@/common/meta/meta.js';
import {
  IsArray,
  IsDateString,
  IsInt,
  IsOptional,
  IsString,
} from 'class-validator';
import { TransformToNumberArray } from '@/common/utils/transform-to-number-array.js';
import { TransformToStringArray } from '@/common/utils/transform-to-string-array.js';

export class LayerDto {
  @ApiProperty({ type: Number, example: 1 })
  @IsInt()
  public id: number;

  @ApiProperty({ type: Number, example: 1 })
  @IsInt()
  public projectId: number;

  @ApiProperty({ type: String, example: 'Ground floor' })
  @IsString()
  public name: string;

  @ApiPropertyOptional({
    type: String,
    example: 'Entrance, registration and first aid',
  })
  @IsOptional()
  @IsString()
  public description?: string;

  @ApiProperty({
    type: Number,
    description:
      'Order within the project. Positions are normalized to 0..n-1 on create',
    example: 0,
  })
  @IsInt()
  public position: number;

  @ApiPropertyOptional({
    type: String,
    description: 'Icon identifier',
    example: 'layers',
  })
  @IsOptional()
  @IsString()
  public icon?: string;

  @ApiProperty({
    type: String,
    format: 'date-time',
    example: '2026-09-28T10:15:00.000Z',
  })
  @IsDateString()
  public updatedAt: Date;

  @ApiProperty({
    type: String,
    format: 'date-time',
    example: '2026-09-20T08:00:00.000Z',
  })
  @IsDateString()
  public createdAt: Date;
}

export class CreateLayerDto extends OmitType(LayerDto, [
  'id',
  'updatedAt',
  'createdAt',
]) {}
export class UpdateLayerDto extends PartialType(
  OmitType(LayerDto, ['updatedAt', 'createdAt']),
) {}

export class BatchLayerDto {
  @IsArray()
  create: CreateLayerDto[];

  @IsArray()
  update: UpdateLayerDto[];
}

export const LAYER_SEARCH_WHITELIST = ['name', 'description'] as const;

export class LayerQueryDto extends DefaultQueryParamsDto({
  sortFields: ['id', 'name', 'description', 'updatedAt', 'createdAt'],
  searchFields: LAYER_SEARCH_WHITELIST,
  defaultSortBy: 'createdAt',
}) {
  @ApiPropertyOptional({
    type: [Number],
    description: 'Filter by ids (comma-separated or repeated param)',
    example: [1, 2],
  })
  @IsOptional()
  @IsInt({ each: true })
  @TransformToNumberArray()
  public id?: number[];

  @ApiPropertyOptional({
    type: [String],
    description: 'Filter by exact names (comma-separated or repeated param)',
    example: ['Ground floor', 'Basement'],
  })
  @IsOptional()
  @IsString({ each: true })
  @TransformToStringArray()
  public name?: string[];

  @ApiPropertyOptional({
    type: [String],
    description:
      'Filter by exact descriptions (comma-separated or repeated param)',
    example: ['Entrance, registration and first aid'],
  })
  @IsOptional()
  @IsString({ each: true })
  @TransformToStringArray()
  public description?: string[];

  @ApiPropertyOptional({
    type: String,
    format: 'date-time',
    description: 'Updated at or after',
    example: '2026-09-01T00:00:00.000Z',
  })
  @IsOptional()
  @IsDateString()
  public updatedAtFrom?: Date;

  @ApiPropertyOptional({
    type: String,
    format: 'date-time',
    description: 'Updated at or before',
    example: '2026-09-30T23:59:59.999Z',
  })
  @IsOptional()
  @IsDateString()
  public updatedAtTo?: Date;

  @ApiPropertyOptional({
    type: String,
    format: 'date-time',
    description: 'Created at or after',
    example: '2026-09-01T00:00:00.000Z',
  })
  @IsOptional()
  @IsDateString()
  public createdAtFrom?: Date;

  @ApiPropertyOptional({
    type: String,
    format: 'date-time',
    description: 'Created at or before',
    example: '2026-09-30T23:59:59.999Z',
  })
  @IsOptional()
  @IsDateString()
  public createdAtTo?: Date;
}
