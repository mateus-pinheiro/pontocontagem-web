# vamosponto — Painel Web (gerente)

Painel web do gerente do **Vamos Ponto** (ponto + estoque para
restaurantes pequenos). Recriação fiel do handoff de design do Claude
Design (`Vamos Ponto - Painel Web.html`), **integrado de verdade com a
API NestJS** do repositório (`../api`).

- **Stack:** Next.js 14 (App Router) + React 18 + TypeScript
- **Visual:** porte fiel dos tokens/primitivas do design (cream `#f4f1ea`,
  tinta `#1a1a1a`, verde `#2d7a4f`, terracota `#d97757`, DM Sans). Sem o
  andaime de apresentação do protótipo (janela de browser falsa) — o
  painel ocupa a tela inteira.
- **Auth:** login do gerente via `POST /api/auth/gerente/login` (JWT no
  `localStorage`, enviado como `Authorization: Bearer`). Rotas do painel
  redirecionam pro login sem token.

## Telas (todas lendo/escrevendo na API)

| Rota | Tela | API |
|---|---|---|
| `/login` | login do gerente | `auth/gerente/login` |
| `/` | painel (resumo ao vivo) | `dashboard` |
| `/pontos` | registros + correção inline | `pontos` (listar / corrigir) |
| `/contagens` | abertas + histórico, criar/reabrir/cancelar | `contagens` |
| `/funcionarios` | CRUD + status ao vivo + reset de PIN | `funcionarios` |
| `/itens` | catálogo CRUD + último estoque | `itens` |
| `/listas` | templates: itens (reordenar/+/–) e quem conta | `listas-contagem` |
| `/relatorios` | horas por funcionário + estoque atual | `relatorios` |
| `/gerentes` | CRUD + reset de senha + desativar | `gerentes` |

Os drawers de criar/editar/desativar chamam os endpoints reais.

## Subir

```bash
# 1. A API precisa estar no ar (ver ../api/README.md):
#    docker compose up -d && npm install && npm run prisma:migrate
#    && npm run db:seed && npm run start:dev   (porta 3000)

# 2. Dependências do painel
npm install

# 3. (opcional) apontar pra outra API
cp .env.local.example .env.local   # NEXT_PUBLIC_API_URL

# 4. Rodar o painel (porta 3001, pra não colidir com a API)
npm run dev
```

Abra `http://localhost:3001`. Login do seed:
`gerente@restaurante.com` / `mudar123` (Roberto Silveira).

## Notas

- A API roda em `:3000` e o painel em `:3001`; CORS já está liberado na
  API (`app.enableCors()`).
- `NEXT_PUBLIC_API_URL` tem fallback embutido
  (`http://localhost:3000/api`), então o `.env.local` é opcional em dev.
- Campos que o design mostra e que **não existiam** na API foram
  adicionados ao backend (não inventados no front): `cargo` do
  funcionário, status ao vivo (derivado dos pontos), último estoque por
  item, e os endpoints `GET /api/dashboard` e `GET /api/relatorios`.
  Veja `../api/README.md`.
- `npm run typecheck` e `npm run build` passam limpos.
