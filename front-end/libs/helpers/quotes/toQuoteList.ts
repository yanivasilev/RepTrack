import { QuoteType } from "../../types/QuoteType";

export function toQuoteList(source: QuoteType[] | { quotes: QuoteType[] }): QuoteType[] {
    if (Array.isArray(source)) return source;
    if (source && Array.isArray(source.quotes)) return source.quotes;
    return [];
}