import { FiCheck, FiPlay, FiX } from 'react-icons/fi';

/** Ícones funcionais do React Icons e o sublinhado decorativo da marca. */

interface MarcaProps {
  tamanho?: number;
  className?: string;
}

/** O visto verde do professor. */
export function Tique({ tamanho = 22, className }: MarcaProps) {
  return <FiCheck size={tamanho} strokeWidth={3} aria-hidden="true" focusable="false" className={className} />;
}

/** O xis vermelho: "ainda não". */
export function Xis({ tamanho = 22, className }: MarcaProps) {
  return <FiX size={tamanho} strokeWidth={3} aria-hidden="true" focusable="false" className={className} />;
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
  return <FiPlay size={tamanho} fill="currentColor" aria-hidden="true" focusable="false" />;
}
