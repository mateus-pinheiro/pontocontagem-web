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
  title: 'Termos de Uso — Ponto Contagem',
  description:
    'Condições de uso do app e do painel Ponto Contagem: quem pode usar, o que é permitido e quais são as responsabilidades de cada lado.',
};

export default function Page() {
  return (
    <LegalPage
      titulo="termos de uso"
      resumo="estas são as condições para usar o app e o painel Ponto Contagem. ao acessar qualquer um dos dois, você concorda com o que está aqui."
    >
      <Secao titulo="1. quem oferece o serviço">
        <P>
          o Ponto Contagem é oferecido por {LEGAL.titular}
          {LEGAL.cpf ? `, CPF ${LEGAL.cpf}` : ''} (&ldquo;nós&rdquo;), e é
          composto por um aplicativo para colaboradores e um painel web para
          gestores. contato: <Mail />.
        </P>
      </Secao>

      <Secao titulo="2. o que o serviço faz">
        <P>
          o Ponto Contagem permite que um estabelecimento registre a jornada de
          trabalho da equipe (entrada, pausa e saída) e realize contagens de
          estoque, com relatórios consolidados no painel.
        </P>
        <Destaque>
          o serviço é uma ferramenta de registro. ele não substitui a
          assessoria jurídica ou contábil do estabelecimento, nem garante por
          si só o cumprimento da legislação trabalhista aplicável, que
          permanece responsabilidade do empregador.
        </Destaque>
      </Secao>

      <Secao titulo="3. contas e acesso">
        <Lista
          itens={[
            'as contas de colaborador são criadas e administradas pelo estabelecimento, no painel. o app não cria contas por conta própria.',
            'quem cria a conta do estabelecimento assume o papel de administrador e responde pelos acessos que conceder.',
            'suas credenciais são pessoais e intransferíveis. bater ponto por outra pessoa é uso indevido e pode levar ao bloqueio do acesso.',
            'você deve avisar o estabelecimento (ou a gente) assim que suspeitar de uso não autorizado da sua conta.',
          ]}
        />
      </Secao>

      <Secao titulo="4. uso aceitável">
        <P>ao usar o serviço, você concorda em não:</P>
        <Lista
          itens={[
            'registrar informação de jornada ou de estoque que saiba ser falsa;',
            'tentar acessar dados de outro estabelecimento ou de outro colaborador;',
            'burlar, testar ou contornar os controles de segurança e de permissão;',
            'fazer engenharia reversa, copiar ou revender o serviço;',
            'automatizar acessos de forma a prejudicar a estabilidade do sistema.',
          ]}
        />
      </Secao>

      <Secao titulo="5. conteúdo e dados do estabelecimento">
        <P>
          os dados inseridos no serviço (cadastros, registros de ponto,
          contagens) pertencem ao estabelecimento. nós os tratamos como
          operador, conforme a{' '}
          <a
            href="/privacidade/"
            style={{ fontWeight: 600, color: '#1a1a1a' }}
          >
            política de privacidade
          </a>
          . o estabelecimento é responsável pela veracidade e pela legalidade
          do que cadastra, inclusive por informar seus colaboradores sobre o
          controle de jornada.
        </P>
      </Secao>

      <Secao titulo="6. disponibilidade e mudanças">
        <P>
          trabalhamos para manter o serviço no ar, mas ele pode ficar
          indisponível por manutenção, falha de terceiros ou caso fortuito.
          podemos alterar, adicionar ou remover funcionalidades — mudanças que
          reduzam de forma relevante o que o serviço faz são comunicadas com
          antecedência razoável no painel.
        </P>
      </Secao>

      <Secao titulo="7. preço">
        <P>
          o app não vende assinatura nem compra dentro do aplicativo. o acesso
          decorre da contratação feita pelo estabelecimento diretamente
          conosco; as condições comerciais, quando houver, são tratadas nesse
          contrato.
        </P>
      </Secao>

      <Secao titulo="8. limitação de responsabilidade">
        <P>
          o serviço é fornecido no estado em que se encontra. na máxima
          extensão permitida pela lei, não respondemos por lucros cessantes,
          perda de dados decorrente de uso indevido, ou por decisões
          trabalhistas, fiscais e de gestão tomadas pelo estabelecimento com
          base nos relatórios. nada aqui afasta direitos que a lei brasileira
          garanta de forma inafastável.
        </P>
      </Secao>

      <Secao titulo="9. encerramento">
        <P>
          o estabelecimento pode encerrar o uso a qualquer momento. podemos
          suspender ou encerrar um acesso que viole estes termos ou que
          represente risco de segurança, com aviso sempre que possível. sobre
          apagar conta e dados, veja{' '}
          <a
            href="/excluir-conta/"
            style={{ fontWeight: 600, color: '#1a1a1a' }}
          >
            excluir conta
          </a>
          .
        </P>
      </Secao>

      <Secao titulo="10. lojas de aplicativos">
        <P>
          a distribuição pela App Store e pelo Google Play está sujeita também
          aos termos dessas plataformas. a Apple e o Google não são partes
          destes termos e não têm qualquer responsabilidade sobre o serviço ou
          sobre o suporte a ele.
        </P>
      </Secao>

      <Secao titulo="11. alterações destes termos">
        <P>
          podemos atualizar estes termos. a data de revisão fica no topo da
          página, e o uso continuado após a mudança significa concordância com
          a versão nova.
        </P>
      </Secao>

      <Secao titulo="12. lei aplicável">
        <P>
          estes termos são regidos pela lei brasileira. fica eleito o foro do
          domicílio do consumidor ou do estabelecimento contratante para
          resolver o que não for resolvido de forma amigável.
        </P>
      </Secao>

      <Secao titulo="13. contato">
        <P>
          dúvidas sobre estes termos: <Mail />.
        </P>
      </Secao>
    </LegalPage>
  );
}
