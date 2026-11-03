/**
 * Marcas de caneta, desenhadas em SVG.
 *
 * Os traços usam `pathLength="1"` para a animação de "riscar" (ver `.traco` em
 * `globals.css`) valer para qualquer tamanho. Sem animação para quem pediu
 * menos movimento: o CSS respeita `prefers-reduced-motion`.
 */

interface MarcaProps {
  tamanho?: number;
  className?: string;
}

/** O visto verde do professor. */
export function Tique({ tamanho = 22, className }: MarcaProps) {
  return (
    <svg width={tamanho} height={tamanho} viewBox="0 0 24 24" fill="none" aria-hidden="true" className={className}>
      <path
        className="traco"
        pathLength={1}
        d="M3.8 12.6 9.4 18.4 20.4 5.2"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** O xis vermelho: "ainda não". */
export function Xis({ tamanho = 22, className }: MarcaProps) {
  return (
    <svg width={tamanho} height={tamanho} viewBox="0 0 24 24" fill="none" aria-hidden="true" className={className}>
      <path
        className="traco"
        pathLength={1}
        d="M5.6 5.4 18.2 18.6M18.4 5.6 5.8 18.4"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  );
}

/** O sublinhado ondulado, como um rabisco de caneta. */
export function Ondulado({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 120 12"
      preserveAspectRatio="none"
      fill="none"
      aria-hidden="true"
      className={className}
      focusable="false"
    >
      <path
        d="M2 7c8-8 14 6 22-1s14-6 22 1 14 6 22-1 14-6 22 1 14 6 22-1"
        stroke="currentColor"
        strokeWidth="2.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}

/** Triângulo de "rodar". */
export function Rodar({ tamanho = 16 }: { tamanho?: number }) {
  return (
    <svg width={tamanho} height={tamanho} viewBox="0 0 16 16" aria-hidden="true" focusable="false">
      <path d="M4 2.6v10.8a.6.6 0 0 0 .92.5l8.4-5.4a.6.6 0 0 0 0-1L4.92 2.1A.6.6 0 0 0 4 2.6Z" fill="currentColor" />
    </svg>
  );
}
