import type { Metadata } from 'next';
import { LEGAL, cpfFormatado } from '@/lib/legal';
import {
  Destaque,
  LegalPage,
  Lista,
  Mail,
  P,
  Secao,
} from '@/components/LegalPage';

export const metadata: Metadata = {
  title: 'Política de Privacidade — Ponto Contagem',
  description:
    'Como o Ponto Contagem coleta, usa e protege os dados de quem usa o app e o painel.',
};

export default function Page() {
  return (
    <LegalPage
      titulo="política de privacidade"
      resumo="o Ponto Contagem registra ponto e contagem de estoque de restaurantes. esta página explica, sem juridiquês, quais dados o app e o painel tratam, por quê, e o que você pode pedir a qualquer momento."
    >
      <Destaque>
        resumo rápido: não vendemos dados, não usamos anúncios, não rastreamos
        você entre apps ou sites, e não coletamos localização, câmera,
        microfone, contatos nem agenda. os dados existem para o seu
        estabelecimento controlar jornada e estoque.
      </Destaque>

      <Secao titulo="1. quem é responsável pelos dados">
        <P>
          o Ponto Contagem é um sistema contratado por estabelecimentos
          (restaurantes, bares e afins) para gerir a jornada e o estoque das
          suas equipes.
        </P>
        <Lista
          itens={[
            <>
              <strong>o estabelecimento é o controlador</strong> dos dados dos
              seus colaboradores: é ele quem decide quem cadastrar, quais dados
              informar e por quanto tempo mantê-los.
            </>,
            <>
              <strong>{LEGAL.titular}
              {LEGAL.cpf ? `, CPF ${cpfFormatado()},` : ''} é o operador</strong>:
              fornece o app e o painel e trata os dados seguindo as instruções
              do estabelecimento.
            </>,
          ]}
        />
        <P>
          na prática: se você é colaborador e quer corrigir ou apagar um dado,
          o caminho mais rápido é falar com o gerente do seu estabelecimento.
          se preferir, fale direto conosco em <Mail /> que encaminhamos.
        </P>
      </Secao>

      <Secao titulo="2. quais dados tratamos">
        <P>
          <strong>dados de cadastro</strong> — informados pelo estabelecimento
          ao criar seu acesso: nome, cargo ou função, e-mail (quando houver),
          documento de identificação (quando o estabelecimento optar por
          registrá-lo) e as credenciais de acesso (senha, PIN ou código),
          sempre guardadas de forma cifrada, nunca em texto puro.
        </P>
        <P>
          <strong>registros de ponto</strong> — data e hora de entrada, saída,
          início e fim de pausa, e eventuais correções feitas pelo gerente com
          a respectiva justificativa.
        </P>
        <P>
          <strong>registros de contagem</strong> — itens contados, quantidades,
          quem contou e quando, além das listas e setores configurados pelo
          estabelecimento.
        </P>
        <P>
          <strong>dados técnicos mínimos</strong> — o app usa o Firebase Remote
          Config (Google) para ligar e desligar funcionalidades remotamente.
          esse serviço gera um identificador de instalação do app e coleta
          dados técnicos do dispositivo (modelo, sistema operacional, idioma).
          esse identificador não é usado para publicidade nem para rastrear
          você entre apps.
        </P>
        <P>
          <strong>no seu aparelho</strong> — o app guarda localmente o token da
          sua sessão e o último acesso usado, só para você não precisar
          digitar tudo de novo. isso sai do aparelho quando você desinstala o
          app ou encerra a sessão.
        </P>
        <Destaque>
          o que <strong>não</strong> coletamos: localização/GPS, fotos, câmera,
          microfone, contatos, agenda, saúde, dados bancários ou de cartão, e
          qualquer identificador de publicidade (IDFA).
        </Destaque>
      </Secao>

      <Secao titulo="3. para que usamos">
        <Lista
          itens={[
            'autenticar você e manter sua sessão ativa com segurança;',
            'registrar e exibir a jornada de trabalho (ponto) para você e para o gestor do seu estabelecimento;',
            'registrar e consolidar as contagens de estoque e os relatórios derivados delas;',
            'cumprir obrigações legais do estabelecimento quanto a controle de jornada;',
            'manter o serviço funcionando: corrigir erros, prevenir fraude e abuso, e habilitar ou desabilitar funcionalidades.',
          ]}
        />
        <P>
          bases legais (LGPD, Lei 13.709/2018): execução de contrato com o
          estabelecimento, cumprimento de obrigação legal e regulatória, e
          legítimo interesse na segurança e no funcionamento do serviço.
        </P>
      </Secao>

      <Secao titulo="4. com quem compartilhamos">
        <P>
          não vendemos, alugamos nem cedemos dados pessoais. o compartilhamento
          se limita ao necessário para o serviço existir:
        </P>
        <Lista
          itens={[
            <>
              <strong>seu estabelecimento</strong> — gestores com permissão
              veem os registros de ponto e contagem da própria equipe. os dados
              de um estabelecimento nunca são visíveis para outro.
            </>,
            <>
              <strong>provedores de infraestrutura</strong> — hospedagem da
              aplicação e do banco de dados, e Google Firebase para
              configuração remota. tratam os dados apenas para nos prestar o
              serviço.
            </>,
            <>
              <strong>autoridades</strong> — quando houver ordem judicial ou
              obrigação legal.
            </>,
          ]}
        />
        <P>
          parte da infraestrutura pode estar fora do Brasil. nesses casos a
          transferência segue as salvaguardas previstas na LGPD.
        </P>
      </Secao>

      <Secao titulo="5. segurança">
        <P>
          todo o tráfego entre o app, o painel e nossos servidores é cifrado
          com HTTPS/TLS. senhas e PINs são guardados com hash, não em texto
          puro. o acesso é controlado por permissões: cada pessoa enxerga
          apenas o que a função dela permite dentro do próprio
          estabelecimento.
        </P>
        <P>
          nenhum sistema é infalível. se ocorrer um incidente que possa gerar
          risco relevante, comunicamos os estabelecimentos afetados e a ANPD
          conforme a LGPD.
        </P>
      </Secao>

      <Secao titulo="6. por quanto tempo guardamos">
        <P>
          os dados ficam armazenados enquanto o estabelecimento mantiver o
          serviço ativo. registros de jornada podem precisar de retenção maior
          por exigência da legislação trabalhista, que é responsabilidade do
          estabelecimento definir. encerrado o vínculo, os dados são
          eliminados ou anonimizados, salvo o que a lei obrigue a manter.
          cópias em backup são sobrescritas no ciclo normal, em até{' '}
          {LEGAL.prazoExclusao}.
        </P>
      </Secao>

      <Secao titulo="7. seus direitos">
        <P>
          a LGPD garante a você: confirmação de tratamento, acesso, correção de
          dados incompletos ou desatualizados, anonimização ou eliminação de
          dados desnecessários, portabilidade, informação sobre
          compartilhamento e revogação de consentimento.
        </P>
        <P>
          para exercer qualquer um deles, escreva para <Mail />. respondemos em
          até {LEGAL.prazoResposta}. como somos operador, pedidos que dependam
          de decisão do empregador são encaminhados ao estabelecimento
          responsável, e avisamos você disso.
        </P>
        <P>
          para apagar a conta e os dados, veja a página{' '}
          <a href="/excluir-conta/" style={{ fontWeight: 600, color: '#1a1a1a' }}>
            excluir conta
          </a>
          .
        </P>
      </Secao>

      <Secao titulo="8. crianças e adolescentes">
        <P>
          o Ponto Contagem é uma ferramenta de trabalho e não se destina a
          menores de 16 anos. não coletamos dados de crianças
          intencionalmente.
        </P>
      </Secao>

      <Secao titulo="9. mudanças nesta política">
        <P>
          se esta política mudar de forma relevante, atualizamos a data no topo
          da página e, quando o impacto for significativo, avisamos os
          estabelecimentos pelo painel.
        </P>
      </Secao>

      <Secao titulo="10. contato">
        <P>
          dúvidas sobre privacidade, pedidos de acesso ou de exclusão:{' '}
          <Mail />. o app na App Store é identificado por{' '}
          {LEGAL.bundleId}.
        </P>
      </Secao>
    </LegalPage>
  );
}
