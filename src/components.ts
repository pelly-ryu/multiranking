import { css } from "@emotion/css";
import { searchResult } from "./entity";

let anchor: Element | undefined;
let wrapper: Element | undefined;

function init() {
  const h2s = document.querySelectorAll("h2.blind");

  if (!h2s) {
    return;
  }

  anchor = Array.from(h2s).find(
    (x) => (x as HTMLElement).innerText === "검색결과"
  );

  wrapper = document.createElement("div");
  wrapper.classList.add(css`
    margin: 5px 0;
  `);
}

export function generateResultRow(result: searchResult) {
  if (!anchor) {
    init();
  }

  const id = "multiRankingResultTable";
  let existing = document.querySelector(`#${id}`);
  if (!existing) {
    existing = document.createElement("table");
    existing.setAttribute("id", id);
    existing.classList.add(css`
      margin-top: 5px;
      margin-left: 5px;
      border-collapse: collapse;
      width: 400px;

      & tr:nth-child(even) {
        background-color: #f2f2f2;
      }
      & tr:hover {
        background-color: #ddd;
      }
    `);
    wrapper?.append(existing);
  }

  const el = existing as HTMLElement;

  const cellStyle = css`
    border: 1px solid #ddd;
    font-size: 110%;
    padding: 4px;
  `;

  const tr = document.createElement("tr");
  const termEl = document.createElement("td");
  termEl.innerText = result.term;
  termEl.classList.add(cellStyle);
  const resultEl = document.createElement("td");
  resultEl.classList.add(cellStyle);
  if (result.page && result.index) {
    resultEl.innerText = `${40 * result.page + result.index} (${
      result.index
    } in page ${result.page})`;
  } else {
    resultEl.innerText = `Not Found (in 10 pages)`;
  }
  tr.append(termEl, resultEl);
  el.append(tr);
}

export function createSearchForm(
  search: (terms: string, mall: string) => void
) {
  if (!wrapper) {
    init();
  }

  const label = document.createElement("label");
  label.innerText = "MultiRanking";
  label.classList.add(css`
    margin-top: -3px;
    font-size: 120%;
    font-weight: 600;
    vertical-align: sub;
    background: -webkit-linear-gradient(45deg, #09009f, #00ee88 80%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  `);

  const inputTerms = document.createElement("input");
  inputTerms.setAttribute("type", "text");
  inputTerms.setAttribute("placeholder", "Search Terms (TermA, TermB, ... )");
  inputTerms.classList.add(css`
    margin: -3px 0 0 10px;
    padding: 5px;
    border: 2px solid rgb(0, 182, 55);
    width: 400px;
    font-size: 120%;
    outline-width: 0;
  `);

  const inputMall = document.createElement("input");
  inputMall.setAttribute("type", "text");
  inputMall.setAttribute("placeholder", "Shop Name");
  inputMall.classList.add(css`
    margin: -3px 5px 0 -2px;
    padding: 5px;
    border: 2px solid rgb(0, 182, 55);
    width: 100px;
    font-size: 120%;
    outline-width: 0;
  `);

  const button = document.createElement("button");
  button.innerText = "Search";
  button.classList.add(css`
    padding: 5px;
    border: 2px solid rgb(0, 182, 55);
    width: 80px;
    font-size: 120%;
    font-weight: 600;
    color: white;
    background-color: rgb(98, 213, 88);
  `);
  button.addEventListener("click", () => {
    if (!inputTerms.value || !inputMall.value) {
      alert("ERROR: check your input");
      return;
    }

    search(inputTerms.value, inputMall.value);
  });

  wrapper?.append(label, inputTerms, inputMall, button);

  if (wrapper) {
    anchor?.after(wrapper);
  }
}
