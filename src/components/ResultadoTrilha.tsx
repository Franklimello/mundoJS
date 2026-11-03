import Link from 'next/link';
import { catalogoProjetos } from '@/projetos/catalogo';

export function ResultadoTrilha({ trilha }: { trilha: string }) {
  const projeto = catalogoProjetos.find((item) => item.trilha === trilha);
  if (!projeto) return null;
  return (
    <section className="resultado-trilha" aria-label="O que você vai construir">
      <p className="projeto-selo">Ao terminar, você consegue…</p>
      <ul>
        {projeto.resultados.map((resultado) => (
          <li key={resultado}>{resultado}</li>
        ))}
      </ul>
      <h3>{projeto.titulo}</h3>
      <p>{projeto.resumo}</p>
      <Link href={`/projetos/${trilha}`} className="botao botao-leve">
        Conhecer o projeto prático · Pro
      </Link>
    </section>
  );
}
