import { IntersectionType, OmitType, PartialType } from '@nestjs/swagger';
import { DefaultQueryParamsDto } from '@/common/meta/meta.js';
import { IsDateString, IsInt, IsOptional, IsString } from 'class-validator';
import { TransformToStringArray } from '@/common/utils/transform-to-string-array.js';
import { TransformToNumberArray } from '@/common/utils/transform-to-number-array.js';

export class ProjectDto {
  @IsInt()
  public id: number;

  @IsString()
  public name: string;

  @IsOptional()
  @IsString()
  public description?: string;

  @IsOptional()
  @IsString()
  public icon?: string;

  @IsDateString()
  public updatedAt: Date;

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
