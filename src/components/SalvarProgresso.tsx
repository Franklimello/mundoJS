'use client';

import Link from 'next/link';
import { contaCliente } from '@/conta/cliente';

export function SalvarProgresso() {
  const { data, isPending } = contaCliente.useSession();
  if (data || isPending) return null;
  return (
    <aside className="salvar-progresso" aria-label="Salve sua conquista">
      <p>
        <strong>Essa conquista vai com você.</strong> Crie uma conta para guardar seu progresso e continuar em outro
        dispositivo.
      </p>
      <Link className="botao botao-principal" href="/conta/criar">
        Salvar meu progresso
      </Link>
      <p className="conta-discreto">Você também pode seguir estudando sem cadastro.</p>
    </aside>
  );
}
