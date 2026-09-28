# Swaggerize templates

Shapes to copy. Names below use the `projects` module; substitute module/entity names. Adapt decorators to what the code actually does (see SKILL.md Step 3) — these show the shape, not a fixed list.

## Contents
1. docs/create-dto.docs.ts — body endpoint
2. docs/get-by-id-dto.docs.ts — param endpoint + shared response example
3. docs/get-all-dto.docs.ts — paginated list
4. docs/update-dto.docs.ts — param + partial body
5. docs/delete-dto.docs.ts — no DTO
6. docs/index.ts — barrel
7. Array body variant
8. Controller after swaggerize
9. DTO fields with @ApiProperty
10. Shared: api-paginated-response.decorator.ts + MetaDto
11. Shared: DefaultQueryParamsDto
12. Shared: main.ts bootstrap

---

## 1. docs/create-dto.docs.ts

```ts
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
```

## 2. docs/get-by-id-dto.docs.ts

Owns the shared response example; other docs files import it.

```ts
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
    ApiParam({ name: 'id', type: Number, description: 'Project id', example: 1 }),
    ApiOkResponse({ type: ProjectDto, example: PROJECT_RESPONSE_EXAMPLE }),
    ApiBadRequestResponse({ description: 'id is not an integer' }),
    ApiNotFoundResponse({ description: 'Project not found' }),
    ApiUnauthorizedResponse({ description: 'Missing or invalid access token' }),
  );
}
```

## 3. docs/get-all-dto.docs.ts

No `ApiQuery` — query params come from `ProjectQueryDto`'s `@ApiPropertyOptional`.

```ts
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
        'Paginated list. Supports search by searchField, sorting, and filtering by id, name, description and date ranges.',
    }),
    ApiPaginatedResponse(ProjectDto),
    ApiBadRequestResponse({ description: 'Invalid query parameters' }),
    ApiUnauthorizedResponse({ description: 'Missing or invalid access token' }),
  );
}
```

## 4. docs/update-dto.docs.ts

```ts
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
    ApiOperation({ summary: 'Update project', description: 'Partial update — send only changed fields.' }),
    ApiParam({ name: 'id', type: Number, description: 'Project id', example: 1 }),
    ApiBody({
      type: UpdateProjectDto,
      examples: { default: { value: UPDATE_PROJECT_EXAMPLE } },
    }),
    ApiOkResponse({
      type: ProjectDto,
      example: { ...PROJECT_RESPONSE_EXAMPLE, ...UPDATE_PROJECT_EXAMPLE },
    }),
    ApiBadRequestResponse({ description: 'Validation failed or id is not an integer' }),
    ApiNotFoundResponse({ description: 'Project not found' }),
    ApiUnauthorizedResponse({ description: 'Missing or invalid access token' }),
  );
}
```

## 5. docs/delete-dto.docs.ts

Check the service: if it returns the deleted record use `ApiOkResponse({ type })`; if it returns nothing or the handler has `@HttpCode(204)` use `ApiNoContentResponse`; if it returns a TypeORM `DeleteResult`, describe `{ raw, affected }`.

```ts
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

export function DeleteProjectsApiDocs() {
  return applyDecorators(
    ApiOperation({ summary: 'Delete project' }),
    ApiParam({ name: 'id', type: Number, description: 'Project id', example: 1 }),
    ApiOkResponse({ description: 'Deleted project', type: ProjectDto, example: PROJECT_RESPONSE_EXAMPLE }),
    ApiBadRequestResponse({ description: 'id is not an integer' }),
    ApiNotFoundResponse({ description: 'Project not found' }),
    ApiUnauthorizedResponse({ description: 'Missing or invalid access token' }),
  );
}
```

## 6. docs/index.ts

```ts
export * from './create-dto.docs.js';
export * from './delete-dto.docs.js';
export * from './get-all-dto.docs.js';
export * from './get-by-id-dto.docs.js';
export * from './update-dto.docs.js';
```

## 7. Array body variant (e.g. layers create with ParseArrayPipe)

```ts
export const CREATE_LAYER_EXAMPLE = [
  { name: 'Ground floor', description: 'Entrance and registration', position: 0, icon: 'layers' },
  { name: 'Basement', description: 'Storage and generators', position: 1, icon: 'archive' },
];

export function CreateLayersApiDocs() {
  return applyDecorators(
    ApiOperation({ summary: 'Create layers in project', description: 'Creates several layers at once for the given project.' }),
    ApiParam({ name: 'projectId', type: Number, description: 'Parent project id', example: 1 }),
    ApiBody({
      type: CreateLayerDto,
      isArray: true,
      examples: { default: { value: CREATE_LAYER_EXAMPLE } },
    }),
    ApiCreatedResponse({ type: LayerDto, isArray: true }),
    ApiBadRequestResponse({ description: 'Validation failed or projectId is not an integer' }),
    ApiNotFoundResponse({ description: 'Project not found' }),
    ApiUnauthorizedResponse({ description: 'Missing or invalid access token' }),
  );
}
```

## 8. Controller after swaggerize

```ts
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import {
  CreateProjectsApiDocs,
  DeleteProjectsApiDocs,
  GetAllProjectsApiDocs,
  GetByIdProjectsApiDocs,
  UpdateProjectsApiDocs,
} from './docs/index.js';

@ApiTags('Projects')
@ApiBearerAuth('Access-token')
@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @GetAllProjectsApiDocs()
  @Get('list')
  getAll(@Query() query: ProjectQueryDto) { ... }

  @GetByIdProjectsApiDocs()
  @Get(':id')
  getById(@Param('id', ParseIntPipe) id: number) { ... }
  // ...
}
```

## 9. DTO fields with @ApiProperty

Only the classes that declare fields. Mapped types (`OmitType`/`PartialType` from `@nestjs/swagger`) inherit.

```ts
import { ApiProperty, ApiPropertyOptional, OmitType, PartialType } from '@nestjs/swagger';

export class ProjectDto {
  @ApiProperty({ type: Number, example: 1 })
  @IsInt()
  public id: number;

  @ApiProperty({ type: String, example: 'Shelter North' })
  @IsString()
  public name: string;

  @ApiPropertyOptional({ type: String, example: 'Main evacuation shelter for the northern district' })
  @IsOptional()
  @IsString()
  public description?: string;

  @ApiProperty({ type: String, format: 'date-time', example: '2026-09-28T10:15:00.000Z' })
  @IsDateString()
  public updatedAt: Date;
}

export class ProjectQueryDto extends DefaultQueryParamsDto({ ... }) {
  @ApiPropertyOptional({
    type: [Number],
    description: 'Filter by ids (comma-separated or repeated param)',
    example: [1, 2],
  })
  @IsOptional()
  @IsInt({ each: true })
  @TransformToNumberArray()
  public id?: number[];

  @ApiPropertyOptional({ type: String, format: 'date-time', description: 'Created at or after', example: '2026-09-01T00:00:00.000Z' })
  @IsOptional()
  @IsDateString()
  public createdAtFrom?: Date;
}
```

## 10. Shared: src/common/docs/api-paginated-response.decorator.ts

```ts
import { applyDecorators, Type } from '@nestjs/common';
import { ApiExtraModels, ApiOkResponse, getSchemaPath } from '@nestjs/swagger';
import { MetaDto } from '@/common/meta/meta.js';

export function ApiPaginatedResponse<TModel extends Type<unknown>>(model: TModel) {
  return applyDecorators(
    ApiExtraModels(MetaDto, model),
    ApiOkResponse({
      schema: {
        type: 'object',
        required: ['items', 'meta'],
        properties: {
          items: { type: 'array', items: { $ref: getSchemaPath(model) } },
          meta: { $ref: getSchemaPath(MetaDto) },
        },
      },
    }),
  );
}
```

`MetaDto` in `src/common/meta/meta.ts` gets documented too:

```ts
export class MetaDto {
  @ApiProperty({ example: 10 })
  pageSize: number;

  @ApiProperty({ example: 1 })
  currentPage: number;

  @ApiProperty({ example: 5 })
  totalPages: number;

  @ApiProperty({ example: true })
  hasNextPage: boolean;

  @ApiProperty({ example: false })
  hasPrevPage: boolean;
}
```

## 11. Shared: DefaultQueryParamsDto

Inside the factory, so `enum` uses the per-module lists:

```ts
class QueryParamsDto {
  @ApiPropertyOptional({ enum: opts.searchFields, description: 'Field to run `search` against' })
  @IsOptional()
  @IsIn(opts.searchFields)
  searchField?: keyof searchFields;

  @ApiPropertyOptional({ type: String, minLength: 3, maxLength: 100, example: 'shelter' })
  // ...validators
  search?: string;

  @ApiPropertyOptional({ enum: opts.sortFields, default: opts.defaultSortBy })
  // ...
  sortBy: sortFields = opts.defaultSortBy;

  @ApiPropertyOptional({ enum: SortOrder, default: SortOrder.DESC })
  // ...
  sortOrder: SortOrder = SortOrder.DESC;

  @ApiPropertyOptional({ type: Number, minimum: 1, default: PAGE_NUMBER_DEFAULT })
  page: number = PAGE_NUMBER_DEFAULT;

  @ApiPropertyOptional({ type: Number, minimum: 1, maximum: 100, default: PAGE_SIZE_DEFAULT })
  pageSize: number = PAGE_SIZE_DEFAULT;
}
```

## 12. Shared: main.ts bootstrap

After `setGlobalPrefix` / `useGlobalPipes`, before `listen`:

```ts
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

const swaggerConfig = new DocumentBuilder()
  .setTitle('Shelter API')
  .setVersion('1.0')
  .addBearerAuth(
    { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
    'Access-token',
  )
  .build();
const document = SwaggerModule.createDocument(app, swaggerConfig);
SwaggerModule.setup('api/docs', app, document, {
  swaggerOptions: { persistAuthorization: true },
});
```
