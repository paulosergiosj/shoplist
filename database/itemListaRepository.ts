import { useSQLiteContext } from "expo-sqlite";
import { ItemListaEntity } from "../entities/itemListaEntity";

export function ItemListaRepository() {
    const dadosNaoRemovidos = 'removed = 0';
    const db = useSQLiteContext();

    async function insertItensLista(data: ItemListaEntity[], listaId: number) {
        var itensParaRemover: number[];
        try {
            itensParaRemover = await removeAllFromLista(listaId);
        } catch (error) {
            throw error;
        }

        var sqlText = `INSERT INTO itemLista (descricao,informarPeso,valor,valorTotal,quantidade,valorKg,peso,listaId)
            VALUES ($descricao,$informarPeso,$valor,$valorTotal,$quantidade,$valorKg,$peso,$listaId)`;

        const sql = await db.prepareAsync(sqlText);

        try {
            data.forEach(async item => {
                await sql.executeAsync({
                    $descricao: item.descricao,
                    $informarPeso: item.informarPeso,
                    $valor: item.informarPeso ? null : item.valor,
                    $valorTotal: item.valorTotal,
                    $quantidade: item.informarPeso ? null : item.quantidade,
                    $valorKg: item.informarPeso ? item.valorKg : null,
                    $peso: item.informarPeso ? item.peso : null,
                    $listaId: listaId
                });
            });
        } catch (error) {
            //revert delete
            await revertExclusion(itensParaRemover);
            throw error;
        }

    }

    async function getAllByListaId(listaId: number) {
        try {
            return await db.getAllAsync<ItemListaEntity>(`SELECT * from itemlista where listaId=${listaId} AND ${dadosNaoRemovidos}`);
        }
        catch (error) {
            throw error;
        }
    }

    async function revertExclusion(ids: number[]) {
        try {
            const placeholders = ids.map(() => '?').join(', ');
            await db.execAsync(`UPDATE itemLista SET removed = 0 WHERE listaId IN (${placeholders})`);
        } catch (error) {
            throw error;
        }
    }

    async function removeAllFromLista(listaId: number) {
        var sql = "SELECT id FROM itemLista WHERE listaId = " + listaId + " AND " + dadosNaoRemovidos;
        const idItensParaRemover = await db.getAllAsync<number>(sql);

        try {
            sql = "UPDATE itemLista SET removed = 1 WHERE listaId = " + listaId;
            await db.execAsync(sql);

            return idItensParaRemover;
        } catch (error) {
            throw error;
        }
    }

    return { insertItensLista, removeAllFromLista, getAllByListaId }
}