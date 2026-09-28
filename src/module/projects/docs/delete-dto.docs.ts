import { applyDecorators } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { ProjectDto } from '../projects.dto.js';
import { PROJECT_RESPONSE_EXAMPLE } from './get-by-id-dto.docs.js';

// TypeORM remove() returns the entity with its primary key cleared
const { id: _id, ...DELETED_PROJECT_EXAMPLE } = PROJECT_RESPONSE_EXAMPLE;

export function DeleteProjectsApiDocs() {
  return applyDecorators(
    ApiOperation({ summary: 'Delete project' }),
    ApiParam({
      name: 'id',
      type: Number,
      description: 'Project id',
      example: 1,
    }),
    ApiOkResponse({
      description: 'Deleted project (without id)',
      type: ProjectDto,
      example: DELETED_PROJECT_EXAMPLE,
    }),
    ApiBadRequestResponse({ description: 'id is not an integer' }),
    ApiNotFoundResponse({ description: 'Project not found' }),
    ApiUnauthorizedResponse({ description: 'Missing or invalid access token' }),
  );
}
