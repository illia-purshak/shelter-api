import {
  ApiProperty,
  ApiPropertyOptional,
  IntersectionType,
  OmitType,
  PartialType,
} from '@nestjs/swagger';
import { DefaultQueryParamsDto } from '@/common/meta/meta.js';
import { IsDateString, IsInt, IsOptional, IsString } from 'class-validator';
import { TransformToStringArray } from '@/common/utils/transform-to-string-array.js';
import { TransformToNumberArray } from '@/common/utils/transform-to-number-array.js';

export class ProjectDto {
  @ApiProperty({ type: Number, example: 1 })
  @IsInt()
  public id: number;

  @ApiProperty({ type: String, example: 'Shelter North' })
  @IsString()
  public name: string;

  @ApiPropertyOptional({
    type: String,
    example: 'Main evacuation shelter for the northern district',
  })
  @IsOptional()
  @IsString()
  public description?: string;

  @ApiPropertyOptional({
    type: String,
    description: 'Icon identifier',
    example: 'home',
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

export class CreateProjectDto extends OmitType(ProjectDto, [
  'id',
  'updatedAt',
  'createdAt',
]) {}
export class UpdateProjectDto extends PartialType(CreateProjectDto) {}

export const PROJECT_SEARCH_WHITELIST = ['name', 'description'] as const;

export class ProjectQueryDto extends DefaultQueryParamsDto({
  sortFields: ['id', 'name', 'description', 'updatedAt', 'createdAt'],
  searchFields: PROJECT_SEARCH_WHITELIST,
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
    example: ['Shelter North', 'Shelter South'],
  })
  @IsOptional()
  @IsString({ each: true })
  @TransformToStringArray()
  public name?: string[];

  @ApiPropertyOptional({
    type: [String],
    description:
      'Filter by exact descriptions (comma-separated or repeated param)',
    example: ['Main evacuation shelter for the northern district'],
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
