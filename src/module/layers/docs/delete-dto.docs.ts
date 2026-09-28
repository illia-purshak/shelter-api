import { applyDecorators } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { LayerDto } from '../layers.dto.js';
import { LAYER_RESPONSE_EXAMPLE } from './get-by-id-dto.docs.js';

// TypeORM remove() returns the entity with its primary key cleared
const { id: _id, ...DELETED_LAYER_EXAMPLE } = LAYER_RESPONSE_EXAMPLE;

export function DeleteLayersApiDocs() {
  return applyDecorators(
    ApiOperation({ summary: 'Delete layer' }),
    ApiParam({ name: 'id', type: Number, description: 'Layer id', example: 1 }),
    ApiOkResponse({
      description: 'Deleted layer (without id)',
      type: LayerDto,
      example: DELETED_LAYER_EXAMPLE,
    }),
    ApiBadRequestResponse({ description: 'id is not an integer' }),
    ApiNotFoundResponse({ description: 'Layer not found' }),
    ApiUnauthorizedResponse({ description: 'Missing or invalid access token' }),
  );
}
