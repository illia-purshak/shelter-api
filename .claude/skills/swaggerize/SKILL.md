---
name: swaggerize
description: Generate Swagger/OpenAPI docs for NestJS modules in this repo - creates a per-endpoint `docs/` folder with composite `applyDecorators` doc decorators and example payloads, adds `@ApiProperty` to DTO fields, and wires `@ApiTags`, `@ApiBearerAuth('Access-token')` and the doc decorators into the controller. Use whenever the user types /swaggerize, or asks to "add swagger", "document the API", "add api docs", "swagger for projects/layers module", "document this controller/DTO", or mentions a module folder or file together with Swagger/OpenAPI - even if they don't say "swaggerize".
---

# Swaggerize

Turn a NestJS module (`src/module/<name>/`) into a fully documented Swagger module:

1. `docs/` folder with one doc file per endpoint (composite decorator + example payloads).
2. `@ApiProperty` / `@ApiPropertyOptional` on DTO fields so schemas are not empty.
3. Controller decorated with `@ApiTags`, `@ApiBearerAuth('Access-token')` and the per-endpoint doc decorators.
4. One-time shared setup (Swagger bootstrap in `main.ts`, paginated-response helper, shared query DTO docs) if missing.

Code templates for every generated file live in `references/templates.md`. Read it before writing any file — it holds the exact shapes, and staying consistent with them is what makes the modules look like one codebase.

## Step 0 — Decide which modules (always, before touching anything)

The user must pick the modules before any edit happens, because this skill rewrites controllers and DTOs and they may be mid-work on some of them.

Modules count as **already specified** if the invocation contains any of:
- a path mention: `@src/module/projects`, `@/projects`, `@projects`
- a file inside a module: `@src/module/layers/layers.service.ts` → module `layers`
- plain text naming a module: "swaggerize projects and layers"
- "all modules" / "every module" → every folder under `src/module/`

If nothing is specified, list folders under `src/module/` and ask with `AskUserQuestion` (multiSelect), marking which ones already have a `docs/` folder. Do not guess and do not default to "all".

When a mention is ambiguous (e.g. a file outside `src/module/`), ask rather than assume.

## Step 1 — Read the module

For each chosen module read: `*.controller.ts`, `*.service.ts`, DTO source(s), and the entity in `src/entities/` it maps to. You need all four:
- **controller** — routes, HTTP verbs, params, pipes, body/query types, `@HttpCode`, guards
- **service** — what each method actually returns (entity, list with meta, void, deleted record) and which exceptions it throws (`NotFoundException` → 404, `ConflictException` → 409, etc.)
- **DTOs** — fields and validators, which drive `@ApiProperty` options
- **entity** — realistic example values and column constraints (length, nullable)

DTO layouts you'll meet:
- **Single file** `<module>.dto.ts` with many classes (current repo style).
- **Folder** `dto/` with one class per file, e.g. `dto/create-project.dto.ts`.

## Step 2 — Plan the docs files

One docs file per controller endpoint, in `src/module/<module>/docs/`. Create the folder even if the module has a single DTO file.

**File naming**
- `dto/` folder, endpoint uses a DTO file 1:1 → mirror its name: `create-project.dto.ts` → `docs/create-project-dto.docs.ts`.
- Otherwise name by handler action in kebab-case + `-dto.docs.ts`: `create` → `create-dto.docs.ts`, `update` → `update-dto.docs.ts`, `getById` → `get-by-id-dto.docs.ts`, `getAll` → `get-all-dto.docs.ts`, `delete` → `delete-dto.docs.ts`.
- Endpoints with no DTO (e.g. `delete`) still get their own file — every endpoint documented in one place.
- Add `docs/index.ts` barrel re-exporting every docs file, so the controller has one import.

**Decorator naming**: `<Action><ModulePascal>ApiDocs` using the module folder name — `CreateProjectsApiDocs`, `GetAllProjectsApiDocs`, `GetByIdLayersApiDocs`, `DeleteLayersApiDocs`.

**Example constants**: `<ACTION>_<ENTITY_SINGULAR>_EXAMPLE` in UPPER_SNAKE — `CREATE_PROJECT_EXAMPLE`, `PROJECT_RESPONSE_EXAMPLE`. Response example used by several endpoints goes in the `get-by-id` docs file and is imported by the others, not copy-pasted.

**Stray files**: if the module has old docs files outside `docs/` (e.g. an empty `projects-dto.docs.ts` in the module root), list them and ask before deleting. If a `docs/` file already exists with content, update it in place instead of overwriting — keep hand-written summaries/descriptions the user added.

## Step 3 — Build each doc decorator

Each file exports its example constant(s) and one function returning `applyDecorators(...)`. Pick decorators from what the code actually does, not from a fixed checklist:

| Code signal | Decorator |
|---|---|
| every endpoint | `ApiOperation({ summary, description? })` — summary short imperative ("Create project"), description only if behavior isn't obvious (filters, side effects) |
| `@Body() dto: X` | `ApiBody({ type: X, examples: { default: { value: EXAMPLE } } })` |
| body is array (`X[]`, `ParseArrayPipe`) | `ApiBody({ type: X, isArray: true, examples: ... })` with array example |
| `@Param('id', ParseIntPipe)` | `ApiParam({ name: 'id', type: Number, description, example: 1 })` + `ApiBadRequestResponse` |
| `@Query() q: XQueryDto` | no `ApiQuery` — Swagger reads query DTO props from their `@ApiPropertyOptional` |
| returns single record | `ApiOkResponse` / `ApiCreatedResponse` (for `@Post`) with `type` = base DTO (e.g. `ProjectDto`) and `example` |
| returns `ResponseListDto<T>` / paginated | `ApiPaginatedResponse(BaseDto)` helper (see templates) |
| `@HttpCode(204)` / returns void | `ApiNoContentResponse` |
| service throws `NotFoundException` or looks up by id | `ApiNotFoundResponse` |
| body/query validated (global `ValidationPipe`) | `ApiBadRequestResponse({ description: 'Validation failed' })` |
| service throws `ConflictException` | `ApiConflictResponse` |
| controller has bearer auth (always, see Step 5) | `ApiUnauthorizedResponse` |

Only add an error response when there's a real path to it — a 404 on `getAll` would be noise.

Example values must be realistic for this domain (shelters, projects, layers): `'Shelter North'`, not `'string'` or `'test'`. Match validator constraints (min/max length, int vs string, ISO date strings for `Date`).

## Step 4 — Document DTO fields

Add `@ApiProperty` (required) / `@ApiPropertyOptional` (has `@IsOptional` or `?`) above the validators, importing from `@nestjs/swagger`. Derive options from validators and entity:
- `@IsInt` → `type: Number`, `@IsString` → `type: String`, `@IsDateString` → `type: String, format: 'date-time'`
- `@IsInt({ each: true })` / array props → `type: [Number]` / `type: [String]`, and for query arrays add `description` noting comma-separated or repeated params (check the `Transform*Array` util to see which)
- `@IsIn(list)` / `@IsEnum(E)` → `enum`
- `@Min/@Max/@MinLength/@MaxLength` → `minimum/maximum/minLength/maxLength`
- default values → `default`
- always `example`, plus `description` when the name isn't self-explanatory

Decorate only classes that declare fields. `OmitType`, `PartialType`, `PickType`, `IntersectionType` from `@nestjs/swagger` inherit metadata, so `CreateXDto extends OmitType(XDto, ...)` needs nothing. If a mapped type is imported from `@nestjs/mapped-types` instead, switch the import to `@nestjs/swagger`, otherwise the schema loses its props.

Don't change validators, field order, or types — docs only.

## Step 5 — Update the controller

- Class level, above `@Controller`: `@ApiTags('<ModulePascal>')` (e.g. `'Projects'`) and `@ApiBearerAuth('Access-token')`. The `'Access-token'` name must match `addBearerAuth(..., 'Access-token')` in `main.ts` — keep the exact casing.
- Each handler: add its `@<Action><Module>ApiDocs()` directly above the HTTP method decorator.
- Import from `./docs/index.js`.
- Re-running on an already swaggerized controller must not duplicate decorators — check first.
- Don't change routes, handler logic, or pipes.

## Step 6 — One-time shared setup (check, create only if missing)

- **`main.ts`**: `DocumentBuilder` + `addBearerAuth({ type: 'http', scheme: 'bearer', bearerFormat: 'JWT' }, 'Access-token')` + `SwaggerModule.setup('api/docs', app, document)`, placed after `setGlobalPrefix` and before `listen`. Skip if `SwaggerModule` is already there.
- **`src/common/docs/api-paginated-response.decorator.ts`**: the `ApiPaginatedResponse` helper for `ResponseListDto<T>`. Also add `@ApiProperty` to `MetaDto` fields in `src/common/meta/meta.ts`.
- **`DefaultQueryParamsDto`** in `src/common/meta/meta.ts`: add `@ApiPropertyOptional` to its fields using `opts.sortFields` / `opts.searchFields` for `enum`, so every module's query DTO shows sort/search/pagination params.

Mention in the summary when you touched these, since they're shared across modules.

## Repo conventions (follow exactly)

- ESM: relative imports end in `.js` (`'./docs/index.js'`, `'../projects.dto.js'`).
- Path alias `@/` → `src/` (`'@/common/docs/api-paginated-response.decorator.js'`).
- Single quotes, trailing commas, 2-space indent — match existing files; run Prettier if configured.

## Step 7 — Verify and report

1. Run `npx tsc --noEmit -p tsconfig.json` (or `npm run build`). Fix any errors you introduced. If `node_modules` is missing, don't install silently — tell the user type-check was skipped and suggest `npm install`.
2. Run `npx eslint <changed files>` if ESLint is configured.
3. Report per module: files created, files modified, shared files touched, and anything skipped or needing a human decision. Tell the user Swagger UI is at `/api/docs` once the app runs.
