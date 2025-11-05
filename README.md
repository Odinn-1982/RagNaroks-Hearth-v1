```markdown
# RagNaroks-Hearth-v1

Tabletop RPG + Social Platform — v1 Production System

Overview
- Real-time chat, channels, servers, DMs, notifications.
- GM/Admin dashboard for campaign, quests, scenes, initiative, timers, loot, notes.
- RPG sheets, items, scenes, plugin/bot architecture, script support, webhook integration.
- Cross-platform: Web (React), Mobile (React Native). Backend: Node + Express + Postgres.
- Basic CI workflow included.

Quickstart (local)
1. Create a Postgres DB:
   - createdb ragnaroks
2. Apply SQL schemas (in order) to your DB:
   - psql -d ragnaroks -f database/001_core_schema.sql
   - psql -d ragnaroks -f database/002_foundry_schema.sql
   - psql -d ragnaroks -f database/003_audit_schema.sql
   - psql -d ragnaroks -f database/004_plugin_schema.sql
   - psql -d ragnaroks -f database/005_gm_game_schema.sql
   - psql -d ragnaroks -f database/006_templates_schema.sql
   - psql -d ragnaroks -f database/007_script_schema.sql
3. Backend:
   - cd backend && npm install
   - copy .env.example → backend/.env and set DATABASE_URL & JWT_SECRET
   - npm run dev
4. Web:
   - cd web && npm install && npm start
5. Mobile:
   - cd mobile && npm install && expo start

Project layout
- backend/: Node/Express API and routes
- web/: React SPA
- mobile/: React Native (Expo) app
- database/: SQL schema files
- .github/workflows/: CI test workflow

Contributing
- See CONTRIBUTING.md

License
- MIT (see LICENSE)
```