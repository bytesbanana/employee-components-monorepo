import { Data } from "@lib/data";
import { SearchResultsDetail } from "../employee-search-input";

export function createSearchResultEvent({
  keywords,
  results,
}: {
  keywords: string;
  results: Data[];
}) {
  return new CustomEvent<SearchResultsDetail>("searchResults", {
    detail: { results, keywords },
    bubbles: true,
    composed: true,
  });
}
