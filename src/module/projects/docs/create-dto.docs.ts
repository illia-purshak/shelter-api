import { applyDecorators } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiCreatedResponse,
  ApiOperation,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { CreateProjectDto, ProjectDto } from '../projects.dto.js';
import { PROJECT_RESPONSE_EXAMPLE } from './get-by-id-dto.docs.js';

export const CREATE_PROJECT_EXAMPLE = {
  name: 'Shelter North',
  description: 'Main evacuation shelter for the northern district',
  icon: 'home',
};

export function CreateProjectsApiDocs() {
  return applyDecorators(
    ApiOperation({ summary: 'Create project' }),
    ApiBody({
      type: CreateProjectDto,
      examples: { default: { value: CREATE_PROJECT_EXAMPLE } },
    }),
    ApiCreatedResponse({
      description: 'Project created',
      type: ProjectDto,
      example: PROJECT_RESPONSE_EXAMPLE,
    }),
    ApiBadRequestResponse({ description: 'Validation failed' }),
    ApiUnauthorizedResponse({ description: 'Missing or invalid access token' }),
  );
}
