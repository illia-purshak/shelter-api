import { applyDecorators } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiParam,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { CreateLayerDto, LayerDto } from '../layers.dto.js';
import { LAYER_RESPONSE_EXAMPLE } from './get-by-id-dto.docs.js';

export const CREATE_LAYER_EXAMPLE = [
  {
    name: 'Basement',
    description: 'Storage and backup generators',
    position: 1,
    icon: 'archive',
  },
  {
    name: 'First floor',
    description: 'Sleeping quarters',
    position: 2,
    icon: 'bed',
  },
];

export const CREATE_LAYER_RESPONSE_EXAMPLE = [
  LAYER_RESPONSE_EXAMPLE,
  { ...LAYER_RESPONSE_EXAMPLE, ...CREATE_LAYER_EXAMPLE[0], id: 2 },
  { ...LAYER_RESPONSE_EXAMPLE, ...CREATE_LAYER_EXAMPLE[1], id: 3 },
];

export function CreateLayersApiDocs() {
  return applyDecorators(
    ApiOperation({
      summary: 'Create layers in project',
      description:
        'Creates several layers at once. New and existing layers of the project are sorted by `position` and renumbered from 0; the response contains all layers of the project after renumbering.',
    }),
    ApiParam({
      name: 'projectId',
      type: Number,
      description: 'Parent project id',
      example: 1,
    }),
    ApiBody({
      type: CreateLayerDto,
      isArray: true,
      examples: { default: { value: CREATE_LAYER_EXAMPLE } },
    }),
    ApiCreatedResponse({
      description: 'All layers of the project after renumbering',
      type: LayerDto,
      isArray: true,
      example: CREATE_LAYER_RESPONSE_EXAMPLE,
    }),
    ApiBadRequestResponse({
      description:
        'Validation failed, body is not an array, or projectId is not an integer',
    }),
    ApiNotFoundResponse({ description: 'Project not found' }),
    ApiUnauthorizedResponse({ description: 'Missing or invalid access token' }),
  );
}
