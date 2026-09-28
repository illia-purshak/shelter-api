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

export const PROJECT_RESPONSE_EXAMPLE = {
  id: 1,
  name: 'Shelter North',
  description: 'Main evacuation shelter for the northern district',
  icon: 'home',
  updatedAt: '2026-09-28T10:15:00.000Z',
  createdAt: '2026-09-20T08:00:00.000Z',
};

export function GetByIdProjectsApiDocs() {
  return applyDecorators(
    ApiOperation({ summary: 'Get project by id' }),
    ApiParam({
      name: 'id',
      type: Number,
      description: 'Project id',
      example: 1,
    }),
    ApiOkResponse({ type: ProjectDto, example: PROJECT_RESPONSE_EXAMPLE }),
    ApiBadRequestResponse({ description: 'id is not an integer' }),
    ApiNotFoundResponse({ description: 'Project not found' }),
    ApiUnauthorizedResponse({ description: 'Missing or invalid access token' }),
  );
}
