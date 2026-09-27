import { IntersectionType, OmitType, PartialType } from '@nestjs/swagger';
import { DefaultQueryParamsDto } from '@/common/meta/meta.js';
import { IsDateString, IsInt, IsOptional, IsString } from 'class-validator';

export class LayerDto {
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

export class CreateLayerDto extends OmitType(LayerDto, [
  'id',
  'updatedAt',
  'createdAt',
]) {}
export class UpdateLayerDto extends PartialType(CreateLayerDto) {}

class LayerFilterDto {
  @IsOptional()
  @IsInt()
  public id?: number;

  @IsOptional()
  @IsString()
  public name?: string;

  @IsOptional()
  @IsString()
  public description?: string;

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

export class LayerQueryDto extends IntersectionType(
  LayerFilterDto,
  DefaultQueryParamsDto<LayerDto>([
    'id',
    'name',
    'description',
    'updatedAt',
    'createdAt',
  ]),
) {}
