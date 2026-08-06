import type { Metadata } from 'next';
import { LEGAL } from '@/lib/legal';
import {
  Destaque,
  LegalPage,
  Lista,
  Mail,
  P,
  Secao,
} from '@/components/LegalPage';

export const metadata: Metadata = {
  title: 'Suporte — Ponto Contagem',
  description:
    'Canal de suporte do Ponto Contagem: como pedir ajuda, resolver problemas de acesso e falar com a gente.',
};

export default function Page() {
  return (
    <LegalPage
      titulo="suporte"
      resumo="precisa de ajuda com o app ou com o painel? esta página resolve as dúvidas mais comuns e mostra como falar com a gente."
    >
      <Destaque>
        fale com a gente por e-mail: <Mail />. respondemos em até{' '}
        {LEGAL.prazoResposta}. para agilizar, conte o nome do seu
        estabelecimento, o que você tentou fazer e o que apareceu na tela.
      </Destaque>

      <Secao titulo="não consigo entrar no app">
        <P>
          o acesso do colaborador é criado pelo gerente do estabelecimento, no
          painel web. se suas credenciais não funcionam:
        </P>
        <Lista
          itens={[
            'confirme com o gerente se o seu acesso está ativo e qual credencial usar (senha, PIN ou código);',
            'peça ao gerente para gerar uma credencial nova — isso é feito na tela de membros do painel;',
            'se o gerente também não conseguir entrar, escreva para o nosso e-mail que a gente destrava.',
          ]}
        />
      </Secao>

      <Secao titulo="bati o ponto na hora errada">
        <P>
          registros de ponto não são apagados pelo colaborador, de propósito: o
          histórico precisa ser auditável. o gerente corrige o horário pelo
          painel, na tela de pontos, e a correção fica registrada com
          justificativa.
        </P>
      </Secao>

      <Secao titulo="o app não mostra o ponto">
        <P>
          o registro de ponto pode estar desligado para o seu estabelecimento.
          nesse caso o app mostra só as contagens de estoque. quem liga e
          desliga isso é o administrador do estabelecimento — fale com ele.
        </P>
      </Secao>

      <Secao titulo="contagem de estoque">
        <P>
          as contagens vêm de listas montadas no painel pelo gerente. se um
          item não aparece na sua contagem, é porque ele não está na lista
          usada — o gerente adiciona pelo painel, em listas de contagem.
        </P>
      </Secao>

      <Secao titulo="apagar minha conta e meus dados">
        <P>
          o caminho está descrito na página{' '}
          <a
            href="/excluir-conta/"
            style={{ fontWeight: 600, color: '#1a1a1a' }}
          >
            excluir conta
          </a>
          .
        </P>
      </Secao>

      <Secao titulo="requisitos">
        <P>
          o app roda em iPhone com iOS 13 ou superior e em Android 8 ou
          superior, e precisa de conexão com a internet para sincronizar. o
          painel funciona em qualquer navegador atual, no computador ou no
          celular.
        </P>
      </Secao>

      <Secao titulo="ainda com problema?">
        <P>
          escreva para <Mail /> com o print da tela e o horário aproximado do
          erro. isso normalmente é o suficiente para a gente achar o que
          aconteceu.
        </P>
      </Secao>
    </LegalPage>
  );
}
