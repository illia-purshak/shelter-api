import { applyDecorators } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { LayerDto, UpdateLayerDto } from '../layers.dto.js';
import { LAYER_RESPONSE_EXAMPLE } from './get-by-id-dto.docs.js';

export const UPDATE_LAYER_EXAMPLE = {
  description: 'Entrance, registration, first aid and pet area',
};

export function UpdateLayersApiDocs() {
  return applyDecorators(
    ApiOperation({
      summary: 'Update layer',
      description:
        'Partial update — send only changed fields. Layer must belong to the given project.',
    }),
    ApiParam({
      name: 'projectId',
      type: Number,
      description: 'Project the layer belongs to',
      example: 1,
    }),
    ApiParam({ name: 'id', type: Number, description: 'Layer id', example: 1 }),
    ApiBody({
      type: UpdateLayerDto,
      examples: { default: { value: UPDATE_LAYER_EXAMPLE } },
    }),
    ApiOkResponse({
      type: LayerDto,
      example: { ...LAYER_RESPONSE_EXAMPLE, ...UPDATE_LAYER_EXAMPLE },
    }),
    ApiBadRequestResponse({
      description:
        'Validation failed, ids are not integers, or layer does not belong to the project',
    }),
    ApiNotFoundResponse({ description: 'Project or layer not found' }),
    ApiUnauthorizedResponse({ description: 'Missing or invalid access token' }),
  );
}
