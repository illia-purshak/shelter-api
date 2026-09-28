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

export const LAYER_RESPONSE_EXAMPLE = {
  id: 1,
  projectId: 1,
  position: 0,
  name: 'Ground floor',
  description: 'Entrance, registration and first aid',
  icon: 'layers',
  updatedAt: '2026-09-28T10:15:00.000Z',
  createdAt: '2026-09-20T08:00:00.000Z',
};

export function GetByIdLayersApiDocs() {
  return applyDecorators(
    ApiOperation({ summary: 'Get layer by id' }),
    ApiParam({ name: 'id', type: Number, description: 'Layer id', example: 1 }),
    ApiOkResponse({ type: LayerDto, example: LAYER_RESPONSE_EXAMPLE }),
    ApiBadRequestResponse({ description: 'id is not an integer' }),
    ApiNotFoundResponse({ description: 'Layer not found' }),
    ApiUnauthorizedResponse({ description: 'Missing or invalid access token' }),
  );
}
