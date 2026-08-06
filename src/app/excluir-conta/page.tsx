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
  title: 'Excluir conta e dados — Ponto Contagem',
  description:
    'Como pedir a exclusão da sua conta e dos seus dados no Ponto Contagem, o que é apagado e em quanto tempo.',
};

export default function Page() {
  return (
    <LegalPage
      titulo="excluir conta e dados"
      resumo="esta página explica como apagar sua conta do Ponto Contagem, o que exatamente é apagado, o que a lei obriga a manter e em quanto tempo tudo acontece."
    >
      <Destaque>
        caminho mais rápido: mande um e-mail para <Mail /> com o assunto{' '}
        <strong>excluir conta</strong>, informando seu nome, o e-mail ou
        documento cadastrado e o nome do estabelecimento. confirmamos a
        identidade e concluímos em até {LEGAL.prazoResposta}.
      </Destaque>

      <Secao titulo="colaborador: peça ao seu estabelecimento">
        <P>
          as contas de colaborador são criadas e administradas pelo
          estabelecimento onde você trabalha — ele é o controlador desses
          dados. o caminho direto é pedir ao gerente que desative e exclua seu
          membro pelo painel, na tela de membros.
        </P>
        <P>
          se o estabelecimento não existe mais, não responde, ou você prefere
          tratar direto conosco, escreva para <Mail />. nós encaminhamos ou
          executamos a exclusão conforme o caso, e avisamos você do desfecho.
        </P>
      </Secao>

      <Secao titulo="administrador: excluir o estabelecimento inteiro">
        <P>
          quem administra o estabelecimento pode pedir a exclusão da conta
          inteira — cadastro, membros, registros de ponto, contagens e
          relatórios. o pedido é feito por <Mail />, a partir do e-mail do
          administrador cadastrado. essa ação é definitiva e atinge todos os
          membros.
        </P>
      </Secao>

      <Secao titulo="o que é apagado">
        <Lista
          itens={[
            'cadastro: nome, e-mail, documento, cargo e credenciais de acesso;',
            'registros de ponto: entradas, saídas, pausas e correções;',
            'registros de contagem: quantidades lançadas e a autoria delas;',
            'a sessão no aparelho, que também some ao desinstalar o app.',
          ]}
        />
      </Secao>

      <Secao titulo="o que pode ser mantido, e por quê">
        <P>
          o controle de jornada é documento trabalhista. o estabelecimento pode
          ter obrigação legal de guardar registros de ponto por prazo definido
          em lei, mesmo após o desligamento do colaborador. nesses casos os
          dados ficam retidos apenas para esse fim, sem uso para nenhuma outra
          finalidade, e são eliminados quando o prazo termina. definir esse
          prazo é responsabilidade do estabelecimento, como controlador.
        </P>
        <P>
          registros já consolidados em relatórios de estoque podem ser mantidos
          de forma anonimizada, sem vincular a pessoa que fez a contagem.
        </P>
      </Secao>

      <Secao titulo="prazos">
        <Lista
          itens={[
            <>
              <strong>confirmação do pedido:</strong> até {LEGAL.prazoResposta}{' '}
              a partir do e-mail.
            </>,
            <>
              <strong>exclusão dos dados ativos:</strong> junto com a
              confirmação.
            </>,
            <>
              <strong>backups:</strong> as cópias de segurança são
              sobrescritas no ciclo normal, em até {LEGAL.prazoExclusao}.
            </>,
          ]}
        />
      </Secao>

      <Secao titulo="dúvidas">
        <P>
          qualquer coisa sobre exclusão ou sobre seus direitos na LGPD:{' '}
          <Mail />. veja também a{' '}
          <a
            href="/privacidade/"
            style={{ fontWeight: 600, color: '#1a1a1a' }}
          >
            política de privacidade
          </a>
          .
        </P>
      </Secao>
    </LegalPage>
  );
}
