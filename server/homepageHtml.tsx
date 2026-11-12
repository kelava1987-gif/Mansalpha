import React from "react";
import { renderToString } from "react-dom/server";
import PremiumHomepage from "../client/src/components/homepage/PremiumHomepage";
import { getEditorialRecords } from "./editorial";
import { HOMEPAGE_TITLE, HOMEPAGE_DESCRIPTION } from "../shared/homepage";

function escapeAttribute(value: string) {
  return value.replace(
    /[&<>"']/g,
    character =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        character
      ]!
  );
}
let rendered: string | undefined;
/** Cached visitor-independent HTML. Never accept auth/workspace/user data here. */
export function withHomepageHtml(template: string, pathname: string) {
  if (pathname !== "/") return template;
  rendered ??= renderToString(
    React.createElement(PremiumHomepage, {
      records: getEditorialRecords(),
      onNavigate: () => {},
      onSearch: () => {},
      onOpen: () => {},
    })
  );
  let result = template.replace(
    '<div id="root"></div>',
    `<div id="root">${rendered}</div>`
  );
  result = result.replace(
    /<title>[^<]*<\/title>/,
    `<title>${escapeAttribute(HOMEPAGE_TITLE)}</title>`
  );
  result = result.replace(
    /<meta\s+name="description"\s+content="[^"]*"\s*\/?\s*>/,
    `<meta name="description" content="${escapeAttribute(HOMEPAGE_DESCRIPTION)}" />`
  );
  return result;
}
