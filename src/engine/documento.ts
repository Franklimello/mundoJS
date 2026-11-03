export interface DocumentoWeb {
  html: string;
  css: string;
}

/** Autocontida: também é enviada como texto ao iframe de origem opaca. */
export function montarDocumento(documento: Document, web: DocumentoWeb) {
  const tags = new Set(
    'main section article header footer nav div span h1 h2 h3 h4 p strong em b i ul ol li button input label form select option textarea output small br hr table thead tbody tr th td'.split(
      ' ',
    ),
  );
  const atributos = new Set(
    'id class type value name for placeholder title role tabindex disabled checked required min max step maxlength rows cols multiple selected'.split(
      ' ',
    ),
  );
  const molde = documento.createElement('template');
  molde.innerHTML = web.html;
  for (const elemento of molde.content.querySelectorAll('*')) {
    if (!tags.has(elemento.localName)) {
      elemento.remove();
      continue;
    }
    for (const atributo of [...elemento.attributes]) {
      if (!atributos.has(atributo.name) && !/^(aria-|data-)[a-z0-9-]+$/.test(atributo.name))
        elemento.removeAttribute(atributo.name);
    }
  }
  documento.body.replaceChildren(molde.content);
  let estilo = documento.getElementById('mundojs-estilo') as HTMLStyleElement | null;
  if (!estilo) {
    estilo = documento.createElement('style');
    estilo.id = 'mundojs-estilo';
    documento.head.appendChild(estilo);
  }
  estilo.textContent =
    'body { font-family: system-ui, sans-serif; padding: 16px; margin: 0; color: #17243b; } button, input, select, textarea { font: inherit; } button { cursor: pointer; }\n' +
    web.css;
}
