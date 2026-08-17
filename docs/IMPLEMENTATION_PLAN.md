# JonJobs – Search & Application

## 1. Objetivo do projeto

**JonJobs – Search & Application** é uma aplicação privada de busca, organização e acompanhamento de vagas de emprego.

O sistema deve funcionar como um **Personal Job Search CRM**, e não apenas como um agregador de links.

Fluxo conceitual principal:

```text
Encontrar
→ Avaliar
→ Salvar
→ Candidatar
→ Acompanhar
→ Analisar resultado
```

O sistema será utilizado por apenas um usuário.

Não há necessidade de:

- cadastro público;
- criação de contas;
- sistema multiusuário;
- planos;
- pagamentos;
- recuperação de senha pública;
- perfis públicos;
- permissões complexas.

A aplicação deve priorizar:

- simplicidade;
- velocidade;
- organização;
- responsividade;
- facilidade de manutenção;
- baixo custo operacional;
- baixo acoplamento entre frontend, banco e mecanismo de descoberta de vagas.

---

# 2. Stack definida

Usar a stack já existente no projeto.

## Frontend

- Next.js
- App Router
- React
- JavaScript
- Tailwind CSS
- React Icons

## Backend

Usar os recursos server-side do próprio Next.js.

Principalmente:

```text
src/app/api/
```

com Route Handlers.

Não criar servidor Express separado.

---

## Banco

Supabase.

Usar PostgreSQL do Supabase como camada persistente.

---

## Hosting e automação

Vercel.

A automação periódica será executada por:

```text
Vercel Cron
→ Next.js Route Handler
→ Supabase
```

---

# 3. Referências fornecidas

Existem dois projetos de referência.

## JonJobs H2

Usar como referência para:

- linguagem visual;
- cards de vagas;
- modal de detalhes;
- hierarquia de informações;
- badges;
- interação com vagas.

Não copiar mecanicamente.

O novo projeto deve ser visualmente relacionado ao JonJobs H2, porém com caráter mais:

- profissional;
- dashboard;
- ferramenta pessoal;
- CRM;
- sistema de produtividade.

---

## VagaFora Free Extension

Usar como referência funcional para:

- Boolean Search Builder;
- cargo principal;
- variantes de cargo;
- palavras-chave;
- chips;
- AND;
- OR;
- geração de consulta;
- localização;
- preview da consulta.

A versão do JonJobs deve evoluir essa ideia, não apenas reproduzi-la.

---

# 4. Arquitetura geral

A aplicação deve manter clara separação entre:

1. interface;
2. dados persistidos;
3. descoberta externa de vagas;
4. automação;
5. acompanhamento de candidaturas.

Arquitetura:

```text
                    ┌─────────────────────┐
                    │     Next.js UI      │
                    │                     │
                    │ Jobs                │
                    │ Search              │
                    │ Applications        │
                    │ Settings            │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │      Supabase       │
                    │                     │
                    │ jobs                │
                    │ applications        │
                    │ search_profiles     │
                    │ job_sources         │
                    │ search_runs         │
                    │ automation_settings │
                    └──────────▲──────────┘
                               │
                               │
                    ┌──────────┴──────────┐
                    │ Vercel Functions /  │
                    │ Next Route Handlers │
                    └──────────▲──────────┘
                               │
                         Vercel Cron
                               │
                               ▼
                    External Job Discovery
```

---

# 5. Princípio arquitetural importante

## O frontend NÃO faz descoberta externa diretamente

O frontend pode:

- consultar vagas existentes no Supabase;
- filtrar;
- ordenar;
- alterar status;
- abrir modal;
- criar perfis de busca;
- disparar uma busca manual via endpoint;
- editar automação.

Mas o browser não deve diretamente:

- pesquisar Google;
- pesquisar LinkedIn;
- pesquisar Indeed;
- acessar career pages;
- fazer scraping;
- armazenar secrets;
- executar lógica privilegiada.

A descoberta deve ocorrer server-side.

---

# 6. Duas buscas diferentes

Existem duas funcionalidades conceitualmente diferentes.

Elas NÃO devem ser misturadas.

---

## 6.1 Internal Job Search

Pesquisa nas vagas que já estão armazenadas no Supabase.

Exemplo:

```text
instructional storyline remote
```

Pode filtrar por:

- cargo;
- empresa;
- localização;
- país;
- cidade;
- modalidade;
- senioridade;
- salário;
- fonte;
- score;
- status;
- favoritas;
- aplicadas;
- não aplicadas;
- descartadas;
- data de publicação;
- data de descoberta.

Essa busca deve ser rápida e local ao sistema.

---

## 6.2 External Job Discovery

Busca novas vagas fora do JonJobs.

Essa operação pode procurar em diferentes frentes.

Exemplos:

- resultados públicos indexados de LinkedIn Jobs;
- resultados públicos indexados de Indeed;
- sites de empresas;
- career pages;
- job boards;
- outras fontes adicionadas no futuro.

Preferência arquitetural:

```text
Search Engine / Public Index
→ LinkedIn indexed result

Search Engine / Public Index
→ Indeed indexed result

Search Engine / Public Index
→ Employer Career Page
```

Evitar construir scraper dependente diretamente da interface HTML do LinkedIn ou Indeed.

---

# 7. Rotas principais

A aplicação deve possuir:

```text
/login
/jobs
/search
/applications
/settings
```

Os route groups podem continuar organizados como:

```text
src/app/(auth)/
src/app/(dashboard)/
```

mas NÃO aparecem na URL.

---

# 8. Página `/login`

Tela simples.

O produto é privado e de usuário único.

## Layout

Centralizar um pequeno painel.

Conteúdo:

```text
JonJobs

Search & Application

Usuário
[________________]

Senha
[________________]

[ Entrar ]
```

Pode conter pequeno texto:

```text
Personal Job Search CRM
```

Não incluir:

- "Criar conta";
- OAuth;
- Google Login;
- Forgot password;
- marketing;
- hero gigante.

---

## Autenticação

A autenticação deve permanecer server-side.

Variáveis previstas:

```text
APP_USERNAME
APP_PASSWORD_HASH
SESSION_SECRET
```

O login chama:

```text
POST /api/auth/login
```

Após validação:

- criar sessão segura;
- usar cookie HTTP-only;
- usar Secure em produção;
- SameSite apropriado.

Logout:

```text
POST /api/auth/logout
```

Não armazenar senha em texto puro.

Não colocar credenciais em código.

---

# 9. Layout global autenticado

As páginas internas devem compartilhar:

```text
AppShell
├── Header
├── Main
└── Footer
```

---

# 10. Header desktop

O Header deve conter:

## Esquerda

Marca:

```text
JonJobs
Search & Application
```

"JonJobs" deve ter maior peso visual.

O subtítulo pode ser discreto.

---

## Navegação

Links:

```text
Jobs
Search
Applications
Settings
```

Destacar rota ativa.

---

## Área direita

Pode conter:

- botão/ícone para logout;
- status discreto da automação;
- futuramente outras ações.

Exemplo:

```text
● Automation ON
```

Não precisa ocupar muito espaço.

---

# 11. Header mobile

Em telas pequenas:

- logo permanece;
- links desaparecem;
- aparece botão hamburger;
- usar React Icons;
- menu abre em drawer/dropdown organizado.

Itens:

```text
Jobs
Search
Applications
Settings
Logout
```

Ao navegar, fechar menu.

---

# 12. Footer

Footer simples.

Exemplo:

```text
JonJobs – Search & Application
Personal Job Search CRM
```

Pode incluir versão ou ano futuramente.

Não deve competir visualmente com o conteúdo.

---

# 13. Identidade visual

Usar o DNA visual do JonJobs H2.

O projeto de referência utiliza esta família cromática.

## Brand

```text
Brand 950: #122033
Brand 900: #182A40
Brand 800: #1D3A4A
Brand 700: #235B68
Brand 600: #2B7480
Brand 500: #3E8D98
Brand 100: #DCEBED
Brand 050: #EFF7F7
```

---

## Accent

```text
Accent 700: #B84D31
Accent 600: #D45F3B
Accent 500: #E87850
Accent 100: #FBE2D7
Accent 050: #FFF4EF
```

---

## Success

```text
Success 700: #1D6B4F
Success 600: #26815F
Success 100: #DDF1E7
```

---

## Warning

```text
Warning 700: #8A5A14
Warning 100: #F8E9C8
```

---

## Danger

```text
Danger 700: #A63D3D
Danger 100: #F9DEDE
```

---

## Text / Ink

```text
Ink 950: #14202B
Ink 900: #1B2935
Ink 800: #2B3A46
Ink 700: #40515E
Ink 600: #60707D
Ink 500: #7C8A95
Ink 400: #99A5AE
Ink 300: #B9C2C8
Ink 200: #D5DCE0
Ink 100: #E9EDEF
Ink 050: #F5F7F8
```

---

## Surfaces

```text
White:         #FFFFFF
Canvas:        #EDF2F1
Canvas Soft:   #F5F7F6
Surface:       #FFFFFF
Surface Muted: #F7F9F8
Sand:          #F7F2E9
Line:          #D8E0E1
Line Strong:   #C5D0D2
```

---

# 14. Aplicação visual da paleta

## Background principal

Preferência:

```text
#EDF2F1
```

ou áreas:

```text
#F5F7F6
```

---

## Cards

```text
background: #FFFFFF
border: #D8E0E1
```

Hover pode usar:

```text
border: #C5D0D2
```

e sombra muito sutil.

---

## Primary action

Usar principalmente:

```text
#235B68
```

ou:

```text
#1D3A4A
```

Hover:

```text
#182A40
```

---

## Accent

Accent coral/terracota:

```text
#D45F3B
```

Usar com parcimônia.

Não transformar toda a interface em coral.

Pode aparecer em:

- detalhes;
- destaques;
- elementos selecionados;
- pequenas ações.

---

# 15. Tipografia

Usar tipografia limpa e moderna compatível com Next.

Manter boa legibilidade.

Hierarquia recomendada:

```text
Page title
24–30px

Section title
18–22px

Card job title
16–19px

Body
14–16px

Metadata
12–14px
```

Evitar:

- textos minúsculos;
- excesso de uppercase;
- font weights exagerados;
- dezenas de tamanhos diferentes.

---

# 16. Página `/jobs`

Esta é a tela principal de trabalho.

Objetivo:

> Mostrar as vagas descobertas e permitir triagem rápida.

Estrutura aproximada:

```text
Header

Jobs
Manage discovered opportunities.

[Search stored jobs________________]

[Filters]

[All] [New] [Viewed] [Favorite] [Applied] [Discarded]

Sort: [Newest discovered ▼]

------------------------------------------------

Job cards grid

------------------------------------------------

Pagination / Load more

Footer
```

---

# 17. Toolbar da página Jobs

Deve possuir:

## Search

Busca textual nas vagas salvas.

Pesquisar principalmente:

- title;
- company;
- location;
- keywords;
- description;
- skills.

---

## Filtros rápidos

Exemplo:

```text
All
New
Viewed
Favorite
Applied
Discarded
```

---

## Filtros avançados

Abrir FilterPanel.

Filtros previstos:

### Country

```text
Ireland
Canada
United Kingdom
Brazil
etc.
```

### Workplace type

```text
Remote
Hybrid
On-site
Unknown
```

### Employment type

```text
Full-time
Part-time
Contract
Temporary
Internship
Unknown
```

### Seniority

```text
Entry
Junior
Mid
Senior
Lead
Manager
Unknown
```

### Source

```text
LinkedIn
Indeed
Company
Other
```

### Published date

```text
Last 24 hours
Last 3 days
Last 7 days
Last 14 days
Last 30 days
Any
```

### Match

```text
80–100
60–79
40–59
Any
```

### Application state

```text
Not applied
Applied
In process
Rejected
etc.
```

---

# 18. Ordenação de Jobs

Opções:

```text
Newest discovered
Oldest discovered
Newest published
Highest match
Lowest match
Company A–Z
Title A–Z
```

Default:

```text
Newest discovered
```

---

# 19. Grid de Job Cards

Desktop:

- grid responsivo;
- aproximadamente 2–3 cards por linha dependendo da largura.

Tablet:

- 2 colunas quando houver espaço.

Mobile:

- 1 coluna.

---

# 20. Conteúdo obrigatório do Job Card

O card deve permitir entender rapidamente se vale abrir a vaga.

Hierarquia recomendada:

```text
[Source badge]                     [Favorite]

JOB TITLE

Company

Location
Workplace type

[Seniority] [Employment Type]

Published X days ago
Found today

Match 85%

[Storyline] [LMS] [SCORM]

[View details]
```

---

# 21. Card — título

Exemplo:

```text
Instructional Designer
```

Máximo aproximado:

- 2 linhas.

Se passar:

- truncar visualmente;
- nome completo continua disponível no modal.

Título deve ser a informação de maior destaque do card.

---

# 22. Card — empresa

Exemplo:

```text
Accenture
```

Logo abaixo do título.

Peso visual inferior ao título.

---

# 23. Card — localização

Mostrar de maneira compacta:

```text
Dublin, Ireland
```

ou:

```text
Ireland
```

Se houver modalidade:

```text
Dublin, Ireland · Hybrid
```

Usar ícones quando ajudarem, sem poluir.

---

# 24. Card — Source Badge

Exemplos:

```text
LinkedIn
Indeed
Company
```

Badge pequeno no topo.

O source refere-se a onde a vaga foi descoberta.

Isso NÃO precisa ser necessariamente o mesmo site do link final de candidatura.

---

# 25. Card — badges

Badges úteis:

```text
Remote
Hybrid
On-site

Entry
Junior
Mid
Senior

Full-time
Contract
```

Evitar mostrar badges demais.

O card deve ter no máximo as informações realmente necessárias para triagem.

---

# 26. Card — Skills

Mostrar poucas skills relevantes.

Exemplo:

```text
Storyline
Rise
LMS
SCORM
```

Máximo visual recomendado:

```text
3 ou 4
```

Se houver mais:

```text
+4
```

---

# 27. Card — Match Score

Quando houver score calculado:

```text
85% match
```

Pode usar badge ou pequeno indicador.

Faixas:

```text
80–100 = forte
60–79  = moderado
40–59  = baixo
0–39   = fraco
```

Não usar score como verdade absoluta.

Tratar como apoio à triagem.

---

# 28. Card — estado

Uma vaga possui estado interno.

Estados iniciais:

```text
new
viewed
favorite
discarded
```

"favorite" idealmente pode coexistir com outro estado.

Aplicação não deve ser representada apenas pelo campo `applied`.

---

# 29. Card — ações

A ação principal deve ser:

```text
View details
```

O próprio card pode também ser clicável.

Ações secundárias rápidas:

- favorite;
- discard.

Evitar colocar muitos botões.

---

# 30. Modal de Job Details

Ao clicar no card:

abrir modal.

O modal deve ser responsivo e ocupar espaço suficiente para leitura.

Desktop:

- largura grande;
- limite de viewport;
- scroll interno.

Mobile:

- quase fullscreen;
- bom espaçamento;
- ações acessíveis.

---

# 31. Comportamento do modal

Obrigatório:

- fechar pelo X;
- fechar com Escape;
- impedir scroll do body;
- foco acessível;
- backdrop;
- aria-modal;
- manter navegação por teclado adequada.

Não fechar acidentalmente durante ações importantes.

---

# 32. Header do modal

Mostrar:

```text
Instructional Designer
Company Name

Dublin, Ireland · Hybrid

[LinkedIn]
[Full-time]
[Mid]
```

A direita:

```text
[X]
```

---

# 33. Modal — Summary

Criar uma área resumida no topo.

Exemplo:

```text
Published
2 days ago

Found
Today

Match
87%

Salary
€45k–€55k
```

Campos ausentes devem mostrar:

```text
Not informed
```

ou simplesmente serem omitidos quando a omissão gerar interface melhor.

---

# 34. Modal — Informações da vaga

Exibir quando disponíveis:

```text
Title
Company
Location
City
Country
Workplace type
Employment type
Seniority
Salary
Currency
Salary period
Published date
Found date
Source
```

---

# 35. Modal — Description

Seção:

```text
Job description
```

Mostrar descrição completa ou conteúdo normalizado disponível.

Preservar parágrafos.

Não renderizar HTML externo sem sanitização.

---

# 36. Modal — Requirements

Quando possível separar:

```text
Requirements
```

Pode conter lista.

---

# 37. Modal — Skills

Exibir:

```text
Required / detected skills
```

Badges.

Exemplo:

```text
Storyline
Rise
SCORM
LMS
Instructional Design
ADDIE
Figma
```

---

# 38. Modal — Match Analysis

Criar seção:

```text
Match analysis
```

Exemplo:

```text
Overall match
87%

Matched
✓ Storyline
✓ Rise
✓ LMS
✓ SCORM

Missing / unclear
• Workday
• German language
```

No MVP, o score pode ser determinístico e baseado em termos.

Não exigir integração com IA no primeiro momento.

A arquitetura deve permitir alterar o mecanismo futuramente.

---

# 39. Modal — Application actions

Footer fixo ou claramente visível.

Ações:

```text
[Discard]
[Mark as applied]
[Apply ↗]
```

---

## Apply

Abre:

```text
application_url
```

em nova aba.

Se houver URL direta do empregador, preferir essa URL.

Caso contrário usar URL da fonte.

---

## Mark as applied

NÃO alterar apenas:

```text
jobs.applied = true
```

Criar registro em:

```text
applications
```

Depois o estado visual da vaga pode ser derivado desse relacionamento.

---

# 40. Página `/applications`

Objetivo:

acompanhar candidaturas realizadas.

Isso deve funcionar como um pequeno ATS pessoal.

---

# 41. Status de Applications

Status iniciais:

```text
applied
screening
interview
case
offer
rejected
withdrawn
```

Arquitetura não deve impedir adicionar estados futuramente.

---

# 42. Layout da página Applications

MVP:

não precisa começar como Kanban.

Usar cards/listagem com filtros.

Exemplo:

```text
Applications

[All]
[Applied]
[Screening]
[Interview]
[Case]
[Offer]
[Rejected]

------------------------------------

Instructional Designer
Company X

Applied: Aug 17, 2026
Status: Interview

Next action:
Prepare interview

Next date:
Aug 21, 2026

[Details]
```

---

# 43. Conteúdo de Application

Uma application pode possuir:

```text
job_id
applied_at
status
notes
recruiter
recruiter_email
resume_version
cover_letter_version
next_action
next_action_date
created_at
updated_at
```

---

# 44. Modal/details de Application

Permitir editar:

```text
Status
Applied date
Notes
Recruiter
Recruiter email
Resume version
Cover letter version
Next action
Next action date
```

Também mostrar detalhes da vaga relacionada.

---

# 45. Filtros de Applications

Filtros:

```text
status
company
job title
application date
next action date
```

Ordenação:

```text
Newest applied
Oldest applied
Next action first
Company A–Z
```

---

# 46. Página `/search`

Essa página terá dois conceitos claramente separados.

---

## Área A — Search stored jobs

Busca dentro do banco.

Essa busca deve consultar:

```text
jobs
```

já existentes.

Pode possuir:

```text
Search stored jobs
[________________________________]
```

e filtros similares aos da tela Jobs.

---

## Área B — Boolean Search Builder / Search Profiles

Esta é a área para construir buscas externas.

---

# 47. Boolean Search Builder

Inspirar-se no projeto VagaFora Free.

Campos:

## Search profile name

Exemplo:

```text
Ireland – Instructional Design
```

---

## Main title

Exemplo:

```text
Instructional Designer
```

Obrigatório.

---

## Title variants

Input + botão adicionar.

Exemplo:

```text
Learning Experience Designer
Learning Designer
eLearning Developer
Learning Content Developer
```

Renderizar como chips removíveis.

Não permitir duplicatas case-insensitive.

---

## Include keywords

Exemplo:

```text
Storyline
Rise
LMS
SCORM
```

Adicionar por chips.

Não permitir duplicatas.

---

## Keyword behavior

Opções:

```text
Match ANY
Match ALL
```

ANY gera:

```text
Storyline OR Rise OR LMS OR SCORM
```

ALL gera:

```text
Storyline AND Rise AND LMS AND SCORM
```

---

# 48. Exclude terms

Adicionar campo não existente originalmente na extensão.

Exemplo:

```text
Teacher
Professor
Director
```

Geração:

```text
NOT Teacher
NOT Professor
NOT Director
```

A implementação da sintaxe final pode variar conforme o provider de busca.

O modelo interno deve preservar exclusões independentemente do provider.

---

# 49. Location

Campo:

```text
Ireland
```

ou:

```text
Dublin
```

---

# 50. Workplace preferences

Selecionáveis:

```text
Remote
Hybrid
On-site
```

Podem ser múltiplos.

---

# 51. Sources

Permitir selecionar quais sources usar.

Exemplo:

```text
[x] LinkedIn
[x] Indeed
[x] Company career pages
[ ] Other
```

A seleção representa estratégia de descoberta, não scraping obrigatório.

---

# 52. Boolean preview

Mostrar claramente o resultado.

Exemplo:

```text
(
  "Instructional Designer"
  OR "Learning Experience Designer"
  OR "Learning Designer"
  OR "eLearning Developer"
)
AND
(
  Storyline
  OR Rise
  OR LMS
  OR SCORM
)
NOT Teacher
NOT Professor
NOT Director
```

Preview deve atualizar conforme edição.

---

# 53. Saved Search Profiles

Perfis devem ser persistidos no Supabase.

Exemplos:

```text
Ireland – Instructional Design

Europe – Remote LXD

Canada – Learning Experience

Brazil – Instructional Design
```

Cada perfil pode ser editado, duplicado ou excluído.

---

# 54. Search profile automation

Cada perfil deve possuir:

```text
automation_enabled
```

Exemplo:

```text
Ireland – ID        [ON]
Europe Remote       [ON]
Canada              [OFF]
Brazil              [OFF]
```

Somente profiles ativos participam do Cron.

---

# 55. Run search manually

Cada profile deve oferecer:

```text
Run now
```

Isso chama endpoint server-side.

O botão não executa busca diretamente no browser.

Fluxo:

```text
UI
→ POST API
→ server-side discovery
→ normalization
→ deduplication
→ Supabase
→ return summary
```

---

# 56. Resultado de execução manual

Mostrar resumo.

Exemplo:

```text
Search completed.

27 results found
18 new jobs
7 duplicates
2 ignored
```

Não precisa mostrar logs técnicos completos para usuário.

---

# 57. Página `/settings`

Áreas principais:

```text
Automation
Job Sources
System
```

---

# 58. Automation Settings

Exemplo visual:

```text
Automation

Automatic job discovery

[ ON ]

Last run
Aug 17, 2026 – 08:00

Next scheduled run
Aug 18, 2026 – 08:00

[ Run now ]
```

---

# 59. Global automation switch

Deve existir uma configuração global.

```text
enabled = true | false
```

Fluxo do Cron:

```text
Cron calls endpoint
↓
Read automation_settings
↓
enabled?
↓
NO → return immediately
YES → continue
```

Quando global:

```text
OFF
```

nenhum profile automático roda.

Mesmo que profile individual esteja ON.

---

# 60. Individual automation switches

Além do global:

cada `search_profile` possui:

```text
automation_enabled
```

Condição final:

```text
global enabled
AND
profile automation_enabled
```

---

# 61. Run Now global

Na tela Settings:

```text
Run now
```

deve executar todos os perfis que estejam individualmente habilitados.

A execução manual global pode funcionar mesmo que o Cron automático esteja desativado.

Esse comportamento deve ser claro na implementação.

Preferência:

- Global Automation OFF desativa somente execução agendada.
- "Run now" continua disponível como ação explícita do usuário.

---

# 62. Search runs

Toda execução relevante deve ser registrada em:

```text
search_runs
```

Registrar:

```text
id
trigger
started_at
finished_at
status
profiles_processed
results_found
jobs_created
duplicates_found
errors_count
error_summary
```

Trigger:

```text
cron
manual_global
manual_profile
```

---

# 63. Search history

Settings pode mostrar últimas execuções.

Exemplo:

```text
Aug 17 · 08:00
Completed
18 new jobs

Aug 16 · 08:00
Completed
11 new jobs

Aug 15 · 08:00
Partial
4 new jobs · 1 source failed
```

---

# 64. Vercel Cron

Endpoint:

```text
/api/cron/search-jobs
```

Deve validar:

```text
CRON_SECRET
```

Não permitir execução privilegiada anônima.

Fluxo:

```text
Vercel Cron
↓
validate CRON_SECRET
↓
automation_settings.enabled
↓
load active search_profiles
↓
execute discovery
↓
normalize
↓
deduplicate
↓
store jobs
↓
store search_run
↓
return summary
```

---

# 65. Job discovery architecture

Não acoplar todo o sistema a uma única fonte.

Criar abstração por providers.

Conceitualmente:

```text
discoverJobs(profile)
```

pode executar:

```text
LinkedIn indexed search provider
Indeed indexed search provider
Career page provider
```

Todos retornam um formato intermediário.

Depois:

```text
normalizeJob()
```

transforma tudo no modelo interno.

---

# 66. Não fazer scraping direto como primeira estratégia

Para LinkedIn e Indeed:

preferir descoberta por busca pública/indexação.

Exemplos conceituais:

```text
site:linkedin.com/jobs "Instructional Designer" Ireland
```

```text
site:indeed.com "Instructional Designer" Ireland
```

Pode usar múltiplas queries construídas a partir dos search profiles.

O código deve permitir trocar mecanismo de descoberta futuramente.

---

# 67. Career pages

Quando uma vaga encontrada apontar para uma empresa e existir link direto de candidatura:

preferir:

```text
employer application URL
```

em vez de link intermediário.

---

# 68. Normalização

Fontes externas terão dados inconsistentes.

Criar modelo interno consistente.

Exemplo:

```text
title
company
location
city
country
workplace_type
employment_type
seniority
salary_min
salary_max
salary_currency
salary_period
description
requirements
skills
source
source_url
application_url
published_at
found_at
expires_at
raw_data
```

---

# 69. Jobs table

Estrutura conceitual:

```text
jobs

id
external_id

title
company

location
city
country

workplace_type
employment_type
seniority

salary_min
salary_max
salary_currency
salary_period

description
requirements

skills
matched_skills
missing_skills

source
source_url
application_url

published_at
found_at
expires_at

match_score

status
is_favorite

raw_data

created_at
updated_at
```

---

# 70. Campos JSONB

Campos apropriados para JSONB:

```text
skills
matched_skills
missing_skills
raw_data
```

Podem ser arrays/json quando adequado.

---

# 71. Status de job

Valor inicial:

```text
new
```

Ao abrir modal:

pode passar para:

```text
viewed
```

Estados:

```text
new
viewed
discarded
```

Favorite deve permanecer:

```text
is_favorite
```

porque pode coexistir com:

```text
new
viewed
```

---

# 72. Applications table

Criar entidade separada.

Estrutura:

```text
applications

id
job_id

applied_at
status

notes

recruiter
recruiter_email

resume_version
cover_letter_version

next_action
next_action_date

created_at
updated_at
```

Relacionamento:

```text
applications.job_id
→ jobs.id
```

---

# 73. Search Profiles table

Estrutura conceitual:

```text
search_profiles

id
name

main_title
title_variants

include_keywords
exclude_keywords
keywords_match_mode

location
country

workplace_types

sources

automation_enabled

created_at
updated_at
```

Tipos como arrays/JSONB podem ser usados quando apropriado.

---

# 74. Job Sources table

Tabela para representar fontes.

Exemplo:

```text
job_sources

id
key
name
enabled
priority
config
created_at
updated_at
```

Exemplos:

```text
linkedin
indeed
career_page
```

---

# 75. Search Runs table

Conforme especificado anteriormente.

Serve para:

- auditoria;
- debugging;
- status no dashboard;
- histórico;
- detectar falhas.

---

# 76. Automation Settings table

Como projeto é single-user, pode existir apenas um registro.

Exemplo:

```text
automation_settings

id
enabled
last_run_at
last_run_status
created_at
updated_at
```

Não criar complexidade desnecessária.

---

# 77. Deduplicação

É possível encontrar a mesma vaga através de:

```text
LinkedIn
Indeed
Company website
```

Não criar três vagas distintas desnecessariamente.

Estratégia deve ser tolerante.

Pode utilizar combinação normalizada de:

```text
company
title
location
application URL
external ID
```

Preferir identificador forte quando disponível.

---

# 78. Normalização para deduplicação

Antes da comparação:

```text
trim
lowercase quando necessário
normalizar espaços
normalizar URLs
remover tracking params quando seguro
```

Não usar apenas título como chave.

---

# 79. Mesmo job, múltiplas fontes

Quando possível, preservar informação de que o mesmo job apareceu em diferentes fontes.

Não é necessário resolver essa funcionalidade de forma complexa no primeiro MVP.

Mas evitar arquitetura que torne isso impossível.

---

# 80. Match score

Implementar de maneira modular.

Primeira versão pode usar:

- titles;
- include keywords;
- skills detectadas;
- localização;
- workplace preference;
- seniority.

Exemplo conceitual:

```text
Title relevance      35%
Keywords / skills    35%
Location             15%
Workplace            10%
Other                 5%
```

Os pesos não precisam ser esses exatamente.

O importante é:

```text
calculateMatch(job, searchProfile)
```

ser isolado.

---

# 81. Score não deve bloquear vagas

Nunca descartar automaticamente uma vaga apenas por baixo match.

Score serve para:

- ordenar;
- priorizar;
- triagem.

---

# 82. Componentes existentes previstos

Manter a estrutura já preparada.

```text
src/components/layout/
  Header.js
  MobileMenu.js
  Footer.js
  AppShell.js
```

---

## Jobs

```text
src/components/jobs/
  JobCard.js
  JobGrid.js
  JobModal.js
  JobBadges.js
  JobStatus.js
```

---

## Search

```text
src/components/search/
  SearchBar.js
  BooleanBuilder.js
  KeywordChips.js
  FilterPanel.js
  SavedSearches.js
```

---

## Applications

```text
src/components/applications/
  ApplicationCard.js
  ApplicationFilters.js
  ApplicationStatus.js
```

---

## Settings

```text
src/components/settings/
  AutomationSettings.js
```

Adicionar componentes complementares somente conforme necessidade real.

---

## UI

```text
src/components/ui/
  Button.js
  Badge.js
  Modal.js
  Input.js
  Select.js
  Toggle.js
```

Esses devem ser componentes genéricos reutilizáveis.

---

# 83. Services

```text
src/services/supabase/
src/services/jobs/
src/services/search/
src/services/applications/
```

Evitar queries espalhadas por componentes.

Exemplo:

```text
getJobs()
getJobById()
updateJobStatus()
toggleFavorite()
```

em service apropriado.

---

# 84. Supabase client/server

Separar:

```text
src/services/supabase/client.js
src/services/supabase/server.js
```

Browser nunca pode receber:

```text
SUPABASE_SERVICE_ROLE_KEY
```

---

# 85. Environment variables

Previstas:

```text
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY

SUPABASE_SERVICE_ROLE_KEY

APP_USERNAME
APP_PASSWORD_HASH
SESSION_SECRET

CRON_SECRET
```

Nunca versionar valores.

`.env.example` contém apenas nomes.

---

# 86. Loading states

Todas as áreas assíncronas devem ter loading states adequados.

Exemplo Job Grid:

```text
Loading jobs...
```

Preferir skeleton ou loader discreto.

Evitar layout shift excessivo.

---

# 87. Empty states

Exemplos.

Jobs:

```text
No jobs found.
Try adjusting the filters or running a new search.
```

Applications:

```text
No applications yet.
When you apply for a job, it will appear here.
```

Saved Searches:

```text
No saved search profiles yet.
Create your first search profile.
```

---

# 88. Error states

Mostrar erros de forma legível.

Não mostrar stack traces.

Exemplo:

```text
We couldn't load the jobs.
Try again.
```

Pode existir botão:

```text
Retry
```

---

# 89. Responsividade

O projeto deve ser pensado desde o início para:

- desktop;
- notebook;
- tablet;
- mobile.

Não implementar desktop primeiro e depois "consertar" mobile.

---

# 90. Mobile Jobs

No mobile:

- grid vira coluna;
- filtros podem abrir drawer;
- cards ocupam largura;
- modal aproxima-se de fullscreen;
- CTAs não devem ficar pequenos;
- tags devem quebrar adequadamente.

---

# 91. Desktop Jobs

Aproveitar largura sem esticar excessivamente linhas de texto.

Usar container central.

Exemplo:

```text
max-width aproximadamente 1400px
```

Não precisa ser valor literal se outro funcionar melhor.

---

# 92. Acessibilidade

Implementar:

- labels;
- aria quando necessário;
- foco visível;
- navegação por teclado;
- Escape em modal;
- botões reais para ações;
- contraste adequado;
- icons com aria-hidden quando decorativos;
- aria-label para ícones sem texto.

---

# 93. React Icons

Usar React Icons.

Exemplos possíveis:

```text
FiSearch
FiMapPin
FiBriefcase
FiClock
FiExternalLink
FiStar
FiX
FiMenu
FiFilter
FiSettings
FiPlay
FiPause
FiCheck
```

Não instalar outra biblioteca de ícones.

---

# 94. UX de Favorite

Estrela:

```text
☆ → not favorite
★ → favorite
```

A ação deve funcionar sem abrir modal.

Dar feedback visual imediato.

---

# 95. UX de Discard

Discard não deve deletar o job.

Apenas:

```text
status = discarded
```

Assim pode ser recuperado posteriormente.

---

# 96. Deletar job

Não colocar delete permanente como ação comum.

Se futuramente existir:

- usar confirmação;
- deixar em área secundária.

---

# 97. Applications e Job Card

Quando uma vaga já possuir application relacionada:

mostrar badge:

```text
Applied
```

ou status mais avançado:

```text
Interview
```

Card pode usar esse dado para sinalizar claramente que já houve candidatura.

---

# 98. Preferência de Apply URL

Ordem:

```text
1. direct employer application URL
2. original application URL
3. source URL
```

Não deixar botão Apply ativo se não houver URL válida.

---

# 99. Data e tempo

Guardar timestamps em formato consistente.

Display amigável:

```text
2 days ago
Today
Aug 17, 2026
```

Pode mostrar relativo no card e absoluto no modal.

---

# 100. Salário

Campos:

```text
salary_min
salary_max
salary_currency
salary_period
```

Display:

```text
€45k–€55k / year
```

ou:

```text
€55k+
```

ou:

```text
Not informed
```

Nunca inventar salário.

---

# 101. Skills

Skills detectadas devem ser normalizadas.

Exemplo:

```text
Articulate Storyline
Storyline 360
storyline
```

podem futuramente convergir para representação consistente.

Não precisa implementar sistema complexo de taxonomia imediatamente.

---

# 102. Segurança

Nunca executar conteúdo externo arbitrariamente.

Descrição de vaga pode conter HTML externo.

Sanitizar ou converter para texto seguro.

Nunca usar:

```text
dangerouslySetInnerHTML
```

com conteúdo externo não sanitizado.

---

# 103. API endpoints iniciais previstos

Autenticação:

```text
POST /api/auth/login
POST /api/auth/logout
```

Automação:

```text
GET/POST /api/cron/search-jobs
```

Busca manual pode usar algo como:

```text
POST /api/search/run
```

ou:

```text
POST /api/search/run/[profileId]
```

Escolher estrutura simples e coerente.

---

# 104. API responses

Padronizar respostas.

Sucesso:

```json
{
  "success": true,
  "data": {}
}
```

Erro:

```json
{
  "success": false,
  "error": "Human readable message"
}
```

Não expor informações sensíveis.

---

# 105. Página inicial `/`

Após autenticação:

preferência:

```text
/
→ redirect /jobs
```

Sem autenticação:

```text
/
→ redirect /login
```

---

# 106. Primeira experiência

Ao entrar no sistema sem jobs:

mostrar:

```text
No jobs found yet.

Create a search profile or run a search to start discovering opportunities.

[Create search profile]
```

---

# 107. Dashboard não é necessário inicialmente

Não criar `/dashboard` apenas para ter gráficos sem utilidade.

A página principal será:

```text
/jobs
```

Se futuramente houver dados suficientes, dashboard pode ser criado.

---

# 108. Não implementar features especulativas

Não criar agora:

- analytics avançado;
- charts;
- AI chatbot;
- cover-letter generator;
- resume builder;
- calendar integration;
- Gmail integration;
- notification center;
- multiuser;
- billing;
- teams;
- browser extension.

A arquitetura pode permitir evolução, mas não implementar sem pedido.

---

# 109. Fases recomendadas de implementação

## Phase 1 — Foundation

Implementar:

- theme;
- layout;
- login UI;
- AppShell;
- Header;
- MobileMenu;
- Footer;
- common UI components;
- Supabase clients;
- route protection.

Resultado:

estrutura visual e navegação funcionando.

---

## Phase 2 — Database

Criar migrations:

```text
jobs
applications
search_profiles
job_sources
search_runs
automation_settings
```

Adicionar constraints e indexes relevantes.

Criar services.

---

## Phase 3 — Jobs UI

Implementar:

- Jobs page;
- JobCard;
- JobGrid;
- JobModal;
- filters;
- search;
- favorite;
- viewed;
- discarded.

Inicialmente pode usar banco ou seed controlado.

---

## Phase 4 — Applications

Implementar:

- mark as applied;
- applications table;
- applications page;
- statuses;
- notes;
- next action.

---

## Phase 5 — Search Profiles

Implementar:

- Boolean Builder;
- chips;
- preview;
- include/exclude;
- saved searches;
- edit;
- delete;
- automation toggle por profile.

---

## Phase 6 — Automation Settings

Implementar:

- global ON/OFF;
- last run;
- run now;
- search run history.

---

## Phase 7 — Job Discovery

Implementar providers progressivamente.

Começar com arquitetura abstraída.

Não tentar construir todas as fontes de uma vez.

---

## Phase 8 — Cron

Adicionar:

```text
vercel.json
```

quando necessário.

Configurar Cron.

Validar:

```text
CRON_SECRET
```

---

## Phase 9 — Match

Implementar match score simples e determinístico.

Depois evoluir se necessário.

---

# 110. Critérios de qualidade

O resultado deve parecer uma aplicação real e consistente.

Não entregar:

- componentes desconectados;
- páginas com estilos diferentes;
- mockups estáticos sem comportamento;
- Tailwind repetitivo sem abstração básica;
- componentes gigantes;
- lógica Supabase espalhada;
- UI genérica sem identidade.

---

# 111. Critério visual para cards

O card deve transmitir em poucos segundos:

1. Qual é a vaga?
2. Qual empresa?
3. Onde?
4. Remoto/híbrido/presencial?
5. Qual senioridade?
6. De onde veio?
7. Quando foi publicada?
8. Quanto combina comigo?
9. Quais skills principais?
10. Já me candidatei?

Qualquer informação que não ajude essa triagem pode ficar no modal.

---

# 112. Critério visual para modal

O modal responde:

1. Vale a pena me candidatar?
2. O que a empresa exige?
3. O que eu já tenho?
4. O que parece faltar?
5. Quanto paga?
6. Onde é?
7. Qual modalidade?
8. Quando foi publicada?
9. Qual é o link correto?
10. Já fiz alguma ação sobre ela?

---

# 113. Critério para Applications

A área Applications responde:

1. Onde eu já me candidatei?
2. Quando?
3. Qual o status?
4. Qual é a próxima ação?
5. Quando preciso fazer essa ação?
6. Quem é o recruiter?
7. Qual currículo utilizei?
8. Qual foi o resultado?

---

# 114. Critério para Search

A área Search responde:

1. O que quero procurar?
2. Quais títulos equivalentes?
3. Quais skills são relevantes?
4. O que quero excluir?
5. Em qual local?
6. Quais fontes?
7. Essa busca deve rodar automaticamente?
8. Qual query será utilizada?
9. Posso executar agora?
10. Posso reutilizar essa busca amanhã?

---

# 115. Critério para Settings

Settings responde:

1. A automação está ligada?
2. Quando rodou?
3. Quando rodará novamente?
4. Quais buscas estão habilitadas?
5. Posso rodar agora?
6. A última execução funcionou?
7. Quantas vagas foram encontradas?

---

# 116. Naming

Nome oficial:

```text
JonJobs
```

Produto:

```text
Search & Application
```

Nome completo:

```text
JonJobs – Search & Application
```

Não renomear sem necessidade.

---

# 117. Idioma da interface

Inicialmente usar interface em inglês.

Exemplos:

```text
Jobs
Search
Applications
Settings

View details
Apply
Mark as applied
Discard
Favorite
Run now
Automation
Search profiles
```

Código, nomes de variáveis, banco e comentários também em inglês.

Não implementar i18n inicialmente.

---

# 118. Organização do código

Seguir o `AGENTS.md` existente.

Especialmente:

- não criar monólitos;
- evitar dependências desnecessárias;
- não fazer refactor fora de escopo;
- usar Server Components por padrão;
- usar `"use client"` apenas quando necessário;
- evitar builds repetidos;
- testar proporcionalmente;
- não fazer push automaticamente.

---

# 119. Antes de implementar

Antes de alterar código:

1. ler `AGENTS.md`;
2. ler este documento;
3. inspecionar a estrutura atual;
4. inspecionar apenas arquivos relevantes;
5. não reestruturar o projeto sem necessidade.

---

# 120. Estratégia de execução para Codex

Não implementar o projeto inteiro em uma mudança gigante.

Trabalhar por fases coesas.

A cada etapa:

```text
Inspect
→ Implement
→ Review diff
→ Targeted validation
→ Report
```

Não executar `npm run build` depois de cada componente.

Usar validação proporcional conforme definido em `AGENTS.md`.

---

# 121. Fonte de verdade

Para decisões arquiteturais deste projeto:

1. `AGENTS.md`
2. este `IMPLEMENTATION_PLAN.md`
3. código existente
4. instrução atual do usuário

Se uma solicitação futura contradizer este documento, a instrução futura do usuário tem prioridade.

---

# 122. Resumo final da arquitetura

```text
                         USER
                          │
                          ▼
                 ┌─────────────────┐
                 │ Next.js App UI  │
                 └────────┬────────┘
                          │
       ┌──────────────────┼───────────────────┐
       │                  │                   │
       ▼                  ▼                   ▼
     Jobs               Search           Applications
       │                  │                   │
       └──────────────────┼───────────────────┘
                          │
                          ▼
                    ┌──────────┐
                    │ Supabase │
                    └────▲─────┘
                         │
                         │
              ┌──────────┴─────────┐
              │ Next Route Handlers│
              └──────────▲─────────┘
                         │
                 ┌───────┴────────┐
                 │                │
              Manual           Vercel Cron
               Run                │
                 │                │
                 └───────┬────────┘
                         ▼
                  Search Profiles
                         │
                         ▼
                  Job Discovery
                         │
             ┌───────────┼────────────┐
             ▼           ▼            ▼
          LinkedIn     Indeed     Career Pages
          indexed      indexed
             │           │            │
             └───────────┼────────────┘
                         ▼
                     Normalize
                         │
                         ▼
                    Deduplicate
                         │
                         ▼
                   Match / Score
                         │
                         ▼
                      Supabase
                         │
                         ▼
                    JonJobs UI
                         │
          ┌──────────────┼──────────────┐
          ▼              ▼              ▼
       Evaluate        Apply         Discard
                          │
                          ▼
                    Applications
                          │
                          ▼
        Applied → Screening → Interview
               → Case → Offer / Rejected
```

---

# 123. Resultado esperado do produto

O JonJobs – Search & Application deve funcionar como uma central pessoal em que o usuário:

- define o que procura;
- salva estratégias de busca;
- escolhe quais buscas serão automatizadas;
- recebe novas vagas no banco;
- visualiza vagas em cards;
- abre detalhes em modal;
- prioriza por relevância;
- descarta oportunidades ruins;
- favorita oportunidades interessantes;
- acessa o link original;
- registra candidatura;
- acompanha progresso;
- registra próximas ações;
- mantém histórico.

A descoberta de vagas é apenas a entrada.

O produto completo é:

```text
Personal Job Search CRM
```
