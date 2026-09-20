import { IntersectionType, OmitType, PartialType } from '@nestjs/swagger';
import { DefaultQueryParamsDto } from '@/common/meta/meta.js';
import { IsDateString, IsInt, IsString } from 'class-validator';

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

export class CreateLayerDto extends OmitType(LayerDto, ['id']) {}
export class UpdateLayerDto extends PartialType(CreateLayerDto) {}

class LayerFilterDto {
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
