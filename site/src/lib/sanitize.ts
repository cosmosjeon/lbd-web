import sanitizeHtml from "sanitize-html";

export function sanitize(html: string): string {
  return sanitizeHtml(html, {
    allowedTags: [
      "h1",
      "h2",
      "h3",
      "h4",
      "h5",
      "h6",
      "p",
      "blockquote",
      "ul",
      "ol",
      "li",
      "b",
      "i",
      "strong",
      "em",
      "a",
      "img",
      "code",
      "pre",
      "br",
      "hr",
      "span",
      "div",
    ],
    allowedAttributes: {
      a: ["href", "name", "target", "rel"],
      img: ["src", "alt", "title", "width", "height"],
      span: ["style"],
      div: ["style"],
      p: ["style"],
    },
    allowedSchemes: ["http", "https", "mailto"],
    transformTags: {
      a: (tagName, attribs) => {
        const href = attribs.href || "#";
        const isHttp = href.startsWith("http://") || href.startsWith("https://");
        const nextAttribs: Record<string, string> = { ...attribs, href };
        if (isHttp) {
          nextAttribs.target = "_blank";
          nextAttribs.rel = "noopener noreferrer";
        }
        return { tagName, attribs: nextAttribs };
      },
      img: (tagName, attribs) => {
        const src = attribs.src || "";
        const safe = src.startsWith("http://") || src.startsWith("https://") ? src : "";
        const nextAttribs: Record<string, string> = { ...attribs, src: safe };
        return { tagName, attribs: nextAttribs };
      },
    },
  });
}


