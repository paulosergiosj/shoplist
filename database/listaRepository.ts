import { useSQLiteContext } from "expo-sqlite"
import { ListaEntity } from "../entities/listaEntity";

export function ListaRepository() {
    const dadosNaoRemovidos = 'removed = 0';
    const db = useSQLiteContext();

    async function insertLista(data: Omit<ListaEntity, "id">) {
        const sql = await db.prepareAsync("INSERT INTO lista (titulo, total,criadoEm,alteradoEm) VALUES ($titulo, $total,$criadoEm,$alteradoEm);");

        try {
            const result = await sql.executeAsync({
                $titulo: data.titulo,
                $total: data.total,
                $criadoEm: new Date().toISOString(),
                $alteradoEm: new Date().toISOString()
            })

            const rowId = result.lastInsertRowId;

            return rowId;

        } catch (error) {
            throw error;
        } finally {
            await sql.finalizeAsync();
        }
    }

    async function getAll() {
        try {
            const response = await db.getAllAsync<ListaEntity>("SELECT * FROM lista WHERE " + dadosNaoRemovidos + " ORDER BY alteradoEm desc");

            return response;
        } catch (error) {
            throw error;
        }
    }

    async function getById(id: number) {
        try {
            const response = await db.getFirstAsync<ListaEntity>("SELECT * FROM lista where id =" + id + " AND " + dadosNaoRemovidos);

            return response;
        } catch (error) {
            throw error;
        }
    }

    async function update(data: ListaEntity) {
        const sql = await db.prepareAsync(`
        UPDATE lista 
        SET titulo = $titulo,
        alteradoEm = $alteradoEm,
        total = $total
        WHERE id = $id AND `+ dadosNaoRemovidos);

        try {
            await sql.executeAsync({
                $titulo: data.titulo,
                $alteradoEm: new Date().toISOString(),
                $total: data.total,
                $id: data.id
            });

        } catch (error) {
            throw error;
        } finally {
            await sql.finalizeAsync();
        }
    }

    async function remove(id: number) {
        try {
            await db.execAsync("UPDATE lista SET removed = 1 WHERE id = " + id)
        } catch (error) {
            throw error
        }
    }

    async function getListaComItens(listaId: number) {
        try {
            const lista = getById(listaId);
            //obter itens
            return {
                ...lista,
                itens: null
            }
        } catch (error) {
            throw error;
        }
    }

    return { insertLista, getAll, getById, update, remove, getListaComItens }
}