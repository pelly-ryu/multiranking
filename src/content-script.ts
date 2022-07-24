import { delay } from "./helper";
import { createSearchForm, generateResultRow } from "./components";
import { searchResult } from "./entity";

function generateParams(term: string, page: number) {
  const queryString = location.search;
  const params = new URLSearchParams(queryString);
  params.set("iq", "");
  params.set("eq", "");
  params.set("xq", "");
  params.set("deliveryFee", "");
  params.set("deliveryTypeValue", "");
  params.set("origQuery", term);
  params.set("query", term);
  params.set("pagingIndex", page.toFixed());
  return params;
}

async function searchInPage(
  page: number,
  term: string,
  mallName: string
): Promise<number | undefined> {
  const url = "https://search.shopping.naver.com/api/search/all?";
  const resp = await fetch(`${url}${generateParams(term, page).toString()}`);
  if (!resp.ok) {
    console.error(resp);
  }
  const result = await resp.json();
  const index = result.shoppingResult.products.findIndex(
    (x: any) => x.mallName === mallName
  );
  if (index > 0) {
    return index;
  }
  return undefined;
}

async function search(
  term: string,
  mallName: string
): Promise<searchResult | undefined> {
  for (let i = 1; i <= 10; i++) {
    const index = await searchInPage(i, term, mallName);
    if (index) {
      return {
        term: term,
        page: i,
        index: index + 1,
      } as searchResult;
    }
    await delay(10);
  }
  return undefined;
}

function searchTerms(rawTerms: string, mallName: string) {
  const terms = rawTerms.split(",");
  terms.forEach(async (x) => {
    const result = await search(x.trim(), mallName);
    if (result) {
      generateResultRow(result);
      return;
    }
    generateResultRow({
      term: x.trim(),
      index: 0,
      page: 0,
    } as searchResult);
  });
}

createSearchForm(searchTerms);

export {};
