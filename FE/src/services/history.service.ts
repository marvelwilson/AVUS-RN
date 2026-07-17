import transactionApi from "@/src/api/transaction.api";
import { useHistoryStore } from "@/src/store/history";

class HistoryService {

    async refresh() {
        const store = useHistoryStore.getState();
        store.setLoading?.(true);

        try {
            const result = await this.history();
            store.setHistory(result.items ?? [], result.nextCursor ?? undefined, result.hasMore);
            return result;
        } finally {
            store.setLoading?.(false);
        }
    }

    async history(
        cursor?: string,
    ) {

        const {

            data,

        } =
            await transactionApi.list(
                cursor,
            );

        return data.data;

    }

    async transaction(
        id: string,
    ) {

        const {

            data,

        } =
            await transactionApi.get(
                id,
            );

        return data.data;

    }

}

export default new HistoryService();
