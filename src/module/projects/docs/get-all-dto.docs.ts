import { applyDecorators } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiOperation,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { ApiPaginatedResponse } from '@/common/docs/api-paginated-response.decorator.js';
import { ProjectDto } from '../projects.dto.js';

export function GetAllProjectsApiDocs() {
  return applyDecorators(
    ApiOperation({
      summary: 'List projects',
      description:
        'Paginated list. `search` matches name and description (or only `searchField` when set). Filter by id, name, description and updatedAt/createdAt ranges.',
    }),
    ApiPaginatedResponse(ProjectDto),
    ApiBadRequestResponse({ description: 'Invalid query parameters' }),
    ApiUnauthorizedResponse({ description: 'Missing or invalid access token' }),
  );
}
