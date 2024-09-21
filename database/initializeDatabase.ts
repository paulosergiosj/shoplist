
import { type SQLiteDatabase } from "expo-sqlite"

export async function initializeDatabase(database: SQLiteDatabase) {
    var queries: string[] = [
        // `DROP TABLE IF EXISTS lista`,
        // `DROP TABLE IF EXISTS itemLista`,
        `CREATE TABLE IF NOT EXISTS lista (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            titulo TEXT NOT NULL,
            alteradoEm DATE NOT NULL DEFAULT CURRENT_DATE,
            criadoEm DATE NOT NULL DEFAULT CURRENT_DATE,
            total REAL NOT NULL,
            removed BOOLEAN NOT NULL DEFAULT 0
        );`,
        `CREATE TABLE IF NOT EXISTS itemLista (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            descricao TEXT NOT NULL,
            informarPeso BOOLEAN NOT NULL,
            valor REAL,
            valorTotal REAL NOT NULL,
            quantidade INTEGER,
            valorKg REAL,
            peso REAL,
            criadoEm DATE NOT NULL DEFAULT CURRENT_DATE,
            removed BOOLEAN NOT NULL DEFAULT 0,
            listaId INTEGER NOT NULL,
            FOREIGN KEY (listaId) REFERENCES lista(id) ON DELETE CASCADE
            ) `,
    ];

    queries.forEach(async query => {
        await database.execAsync(query);
    });
}