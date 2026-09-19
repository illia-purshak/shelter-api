import { IntersectionType, OmitType, PartialType } from '@nestjs/swagger';
import { DefaultQueryParamsDto } from '@/common/meta/meta.js';
import { IsDateString, IsInt, IsString } from 'class-validator';

export class ProjectDto {
  @IsInt()
  public id: number;

  @IsString()
  public name: string;

  @IsString()
  public description: string;

  @IsString()
  public icon?: string;

  @IsDateString()
  public updatedAt: Date;

  @IsDateString()
  public createdAt: Date;
}

export class CreateProjectDto extends OmitType(ProjectDto, ['id']) {}
export class UpdateProjectDto extends PartialType(CreateProjectDto) {}

class ProjectFilterDto {
  @IsInt()
  public id?: number;

  @IsString()
  public name?: string;

  @IsString()
  public description?: string;

  @IsDateString()
  public createdAtFrom?: Date;

  @IsDateString()
  public createdAtTo?: Date;
}

export class ProjectQueryDto extends IntersectionType(
  ProjectFilterDto,
  DefaultQueryParamsDto<ProjectDto>([
    'id',
    'name',
    'description',
    'updatedAt',
    'createdAt',
  ]),
) {}
