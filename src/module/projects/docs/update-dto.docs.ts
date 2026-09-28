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
import { ProjectDto, UpdateProjectDto } from '../projects.dto.js';
import { PROJECT_RESPONSE_EXAMPLE } from './get-by-id-dto.docs.js';

export const UPDATE_PROJECT_EXAMPLE = {
  description: 'Expanded to include the east wing',
};

export function UpdateProjectsApiDocs() {
  return applyDecorators(
    ApiOperation({
      summary: 'Update project',
      description: 'Partial update — send only changed fields.',
    }),
    ApiParam({
      name: 'id',
      type: Number,
      description: 'Project id',
      example: 1,
    }),
    ApiBody({
      type: UpdateProjectDto,
      examples: { default: { value: UPDATE_PROJECT_EXAMPLE } },
    }),
    ApiOkResponse({
      type: ProjectDto,
      example: { ...PROJECT_RESPONSE_EXAMPLE, ...UPDATE_PROJECT_EXAMPLE },
    }),
    ApiBadRequestResponse({
      description: 'Validation failed or id is not an integer',
    }),
    ApiNotFoundResponse({ description: 'Project not found' }),
    ApiUnauthorizedResponse({ description: 'Missing or invalid access token' }),
  );
}
