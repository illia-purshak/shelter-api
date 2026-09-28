import { applyDecorators } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiOperation,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { ApiPaginatedResponse } from '@/common/docs/api-paginated-response.decorator.js';
import { LayerDto } from '../layers.dto.js';

export function GetAllLayersApiDocs() {
  return applyDecorators(
    ApiOperation({
      summary: 'List layers',
      description:
        'Paginated list across all projects. `search` matches name and description (or only `searchField` when set). Filter by id, name, description and updatedAt/createdAt ranges.',
    }),
    ApiPaginatedResponse(LayerDto),
    ApiBadRequestResponse({ description: 'Invalid query parameters' }),
    ApiUnauthorizedResponse({ description: 'Missing or invalid access token' }),
  );
}
