require("dotenv").config({
  path: require("path").resolve(__dirname, "../../.env"),
});

const fs = require("fs");
const path = require("path");

const pool = require("../config/db");

async function migrationJaExecutada(nomeArquivo) {
  const query = `
    SELECT 1
    FROM MIGRATION_HISTORY
    WHERE NOME = $1
  `;

  const result = await pool.query(query, [nomeArquivo]);

  return result.rowCount > 0;
}

async function registrarMigration(nomeArquivo) {
  const query = `
    INSERT INTO MIGRATION_HISTORY (NOME)
    VALUES ($1)
  `;

  await pool.query(query, [nomeArquivo]);
}

async function runMigrations() {
  try {
    const migrationsPath = path.join(__dirname, "migrations");

    const migrationFiles = fs.readdirSync(migrationsPath).sort();

    for (const file of migrationFiles) {
      const executada = await migrationJaExecutada(file);

      if (executada) {
        console.log(`Já executada: ${file}`);

        continue;
      }

      const filePath = path.join(migrationsPath, file);

      const sql = fs.readFileSync(filePath, "utf-8");

      console.log(`Executando: ${file}`);

      await pool.query(sql);

      await registrarMigration(file);

      console.log(`Finalizada: ${file}`);
    }

    console.log("Migrations concluídas.");

    process.exit(0);
  } catch (error) {
    console.error(error);

    process.exit(1);
  }
}

runMigrations();