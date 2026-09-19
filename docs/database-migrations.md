# Database migrations

This project uses [TypeORM](https://typeorm.io) migrations to evolve the Postgres schema. `synchronize` is **always off** (`src/database/data-source.ts`) — schema changes only ever happen through committed migration files, so every environment (local, CI, production) ends up with the exact same schema history.

## How it fits together

- `src/database/data-source.ts` — the single `DataSource` definition, shared by both the running Nest app (`AppModule` via `TypeOrmModule.forRoot`) and the TypeORM CLI. It reads DB connection info from environment variables (see `.env.example`).
- `src/entities/*.entities.ts` — TypeORM entities (source of truth for the desired schema).
- `src/database/migrations/*.ts` — one file per schema change, timestamp-ordered, checked into git.
- `migrations` table in Postgres — tracks which migration files have already run against that database.

The CLI needs compiled JS (decorator metadata isn't reliably produced by fast TS transpilers), so every migration script below builds the project first and then points the TypeORM CLI at `dist/database/data-source.js`.

## Scripts (`package.json`)

| Script | What it does |
| --- | --- |
| `pnpm migration:generate <path>` | Builds the project, diffs your entities against the live DB, and writes a new migration file with the SQL needed to close the gap. |
| `pnpm migration:create <path>` | Creates an empty migration file (no DB diff) — use for data migrations or anything TypeORM can't auto-generate. |
| `pnpm migration:run` | Builds the project and applies all pending migrations to the database. |
| `pnpm migration:revert` | Builds the project and rolls back the most recently applied migration. |
| `pnpm migration:show` | Lists all migrations and whether each has been applied (`[X]`) or not (`[ ]`). |

`<path>` is the migration file path **without extension**, rooted wherever you pass it — always use `src/database/migrations/<Name>`, e.g. `src/database/migrations/AddIconToProjects`. Use PascalCase, and name it after what changed, not the table (`AddIconToProjects`, not `UpdateProjects2`).

`migration:generate` and `migration:run` require the Postgres container to be running (`docker compose up -d`) and reachable using the connection details in your `.env`.

## Example process: adding a new entity

Say you add a new `Shelter` entity.

1. **Create the entity** at `src/entities/shelter.entities.ts`:

   ```ts
   import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

   @Entity()
   export class Shelter {
     @PrimaryGeneratedColumn()
     public id: number;

     @Column()
     public name: string;

     @CreateDateColumn({ type: 'timestamptz', name: 'created_at' })
     public createdAt: Date;
   }
   ```

2. **Register it** on its module with `TypeOrmModule.forFeature([Shelter])` (see `src/module/projects/projects.module.ts` for the pattern) so it's injectable via `@InjectRepository(Shelter)`.

3. **Make sure Postgres is up**:

   ```bash
   docker compose up -d
   ```

4. **Generate the migration** — TypeORM introspects the live DB, compares it to your entities, and writes the SQL diff:

   ```bash
   pnpm migration:generate src/database/migrations/CreateSheltersTable
   ```

   This produces `src/database/migrations/<timestamp>-CreateSheltersTable.ts` with `up()`/`down()` methods containing the generated `CREATE TABLE ...` / `DROP TABLE ...` SQL.

5. **Read the generated file before committing it.** Auto-generated SQL is usually right but not always what you want (e.g. it won't infer `NOT NULL` defaults for backfilling existing rows, or preserve data during a column type change) — edit it by hand if needed.

6. **Apply it locally** to verify it actually runs cleanly against the DB:

   ```bash
   pnpm migration:run
   ```

7. **Commit** the entity change, module wiring, and the migration file together in the same PR.

Changing an existing entity (adding/removing/renaming a column, changing a type, adding an index, etc.) follows the exact same flow: edit the entity, then run `pnpm migration:generate src/database/migrations/<DescriptiveName>`.

## Rolling back

If a migration that already ran turns out to be wrong:

```bash
pnpm migration:revert
```

This runs the `down()` method of the most recently applied migration. Only revert migrations that haven't been deployed elsewhere yet — once a migration has shipped to a shared environment, prefer writing a new forward-fixing migration instead of rewriting history.

## Data migrations

For changes that aren't a pure schema diff (backfilling a column, transforming existing rows), use `pnpm migration:create` to scaffold an empty file, then write the `up()`/`down()` SQL (or use `queryRunner.query(...)`) by hand.
