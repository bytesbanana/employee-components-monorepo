import { Data } from "@lib/data";
import { SearchResultsDetail } from "../employee-search-input";

export function createSearchResultEvent({
  query,
  results,
}: {
  query: string;
  results: Data[];
}) {
  return new CustomEvent<SearchResultsDetail>("searchResults", {
    detail: { results, query },
    bubbles: true,
    composed: true,
  });
}
