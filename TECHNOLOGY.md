# TECHNOLOGY SUMMARY

This backend project uses the following technologies:

- Language / Runtime: TypeScript on Node.js
- Web framework: Express
- HTTP server: Node `http` (via `createServer`)
- ORM / Database: Sequelize + `sequelize-typescript` (MySQL/Postgres drivers: `mysql2`, `pg`)
- Auth & Security: JSON Web Tokens (`jsonwebtoken`), `bcrypt` / `bcryptjs`
- Environment config: `dotenv`
- Request parsing & CORS: `body-parser`, `cors`
- File upload / handling: `multer`, `archiver`, `file-saver`
- Email & templating: `nodemailer`, `handlebars`
- Cloud / Storage: AWS SDK (`aws-sdk`) and S3 helpers
- FTP / SFTP: `ftp`, `ssh2-sftp-client`
- Excel / spreadsheet: `exceljs`, `xlsx`
- HTTP client: `axios`
- Dev tooling: `ts-node`, `ts-node-dev`, `typescript`, `tsc`

Where to look in repo:
- `package.json` — dependencies and dev tools
- `tsconfig.json` — compiler options (decorators, metadata)
- `src/server.ts` — Express server setup, `dotenv`, `body-parser`, `cors`
- `database/migrations`, `models` — Sequelize usage
- `helpers/` — JWT, S3, FTP helpers
- `resources/` and `views/` — templates and sample files

Quick run commands (PowerShell):

```powershell
# Install deps
npm install

# Development (auto-restart on change)
npm run dev

# Build TypeScript to JS
npm run build

# Run compiled app (after build)
npm start
```
