import { QuoteType } from "../../types/QuoteType";
import { getLocalDayKey } from "./getLocalDayKey";
import { hashString } from "./hashString";
import { toQuoteList } from "./toQuoteList";

const QUOTE_TAG = "motivation";

const quotesData = require("../../data/quotes.json") as QuoteType[] | { quotes: QuoteType[] };

export function getQuote(userId?: number | null) {
    const list = toQuoteList(quotesData);
    const filtered = list.filter((item) => {
        if (!item || !Array.isArray(item.tags)) return false;
        return item.tags.some((tag) => String(tag).toLowerCase() === QUOTE_TAG);
    });

    const pool = filtered.length > 0 ? filtered : list;
    if (pool.length === 0) return null;

    const seed = `${getLocalDayKey()}:${userId ?? "global"}`;
    const index = hashString(seed) % pool.length;
    return pool[index] ?? null;
}
