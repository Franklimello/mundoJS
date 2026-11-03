import type { Metadata } from 'next';
import { Conta } from '@/components/Conta';
import { AvisoEmailLocal } from '@/components/AvisoEmailLocal';
import { emailSenhaHabilitados } from '@/servidor/configuracao-conta';

export const metadata: Metadata = { title: 'Salvar meu progresso' };
export default function CriarConta() {
  return (
    <div className="pagina secao conta-pagina">
      <h1 className="titulo-de-pagina">Guarde suas conquistas.</h1>
      <p className="secao-apoio">Crie uma conta para continuar de onde parou, mesmo em outro dispositivo.</p>
      <AvisoEmailLocal />
      <Conta key="criar" criar emailHabilitado={emailSenhaHabilitados()} />
    </div>
  );
}
