# crud-entity

## Active
- [ ] Після create: запис справді потрапив у БД, чи я лише створив інстанс? — missed ×1 · last: 2026-09-27
- [ ] Що має статися при видаленні батьківського запису, на який посилаються дочірні (FK)? І що тоді отримає клієнт? — missed ×1 · last: 2026-09-27
- [ ] Текстовий пошук (`ILIKE`) по полю: яка в нього колонка в БД? Чи всі поля з whitelist для search справді текстові? — missed ×1 · last: 2026-09-27
- [ ] Transform перетворює значення на масив: валідатор перевіряє кожен елемент чи весь масив як одне значення? — missed ×1 · last: 2026-09-27
- [ ] Коли читаю зв'язані дані з entity (`project.layers`), чи вони справді завантажені запитом? — missed ×1 · last: 2026-09-28
- [ ] Pipe з власною валідацією: чи діють на нього глобальні `whitelist`/`forbidNonWhitelisted`? — missed ×1 · last: 2026-09-28
- [ ] Отримую масив з фронта: як провалідувати кожен елемент? (`ParseArrayPipe`) — feature · added: 2026-09-28
- [ ] (minor) Перед комітом: чи всі зміни entity покриті міграцією? — missed ×1 · last: 2026-09-27

## Remembered

## Log
- 2026-09-27 · shelter-api projects CRUD · без hint, review 2 раунди · missed: create без save, FK on delete, (minor) міграція після зміни entity, ILIKE по integer, валідація елементів масиву
- 2026-09-28 · shelter-api layers CRUD · без hint, review 2 раунди + перевірка · missed: relations не завантажені, whitelist у ParseArrayPipe · feature: ParseArrayPipe для масивів
