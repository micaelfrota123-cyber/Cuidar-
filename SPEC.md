# ESPECIFICAÇÃO FINAL DO SISTEMA (SPEC FINAL)

**Projeto:** Cuidar+ — Assistente Inteligente para Acompanhamento de Tratamentos  
**Estudante:** Micael Lima Araujo Frota  
**Turma / Curso:** 3º B T.I. — Técnico em Informática Integrado ao Ensino Médio  
**Instituição:** Instituto Federal de Rondônia (IFRO) — Campus Porto Velho Calama  
**Componente Curricular:** Desenvolvimento de Sistemas  
**Professor Orientador:** Prof. Rafael Pitwak (`rafaelpitwak`)  
**Metodologia:** Spec-Driven Development (SDD) — "Programar com IA de forma responsável"  
**Repositório Oficial no GitHub:** [https://github.com/micaelfrota123-cyber/Cuidar-](https://github.com/micaelfrota123-cyber/Cuidar-)  
**Link do Sistema Publicado na Nuvem:** [https://cuidar-cyan.vercel.app/#dashboard-paciente](https://cuidar-cyan.vercel.app/#dashboard-paciente)  
**Vídeo Pitch Oficial (YouTube):** [https://youtu.be/3XMOlI1-3XU](https://youtu.be/3XMOlI1-3XU)  

---

## 1. Objetivo do Sistema

Desenvolver uma plataforma inteligente e acessível voltada para a organização e o acompanhamento de rotinas de tratamentos de saúde contínuos. A solução visa reduzir drasticamente a não adesão medicamentosa causada pelo esquecimento de dosagens, atrasos em aferições e perda de consultas em pacientes crônicos e idosos.

O **Cuidar+** integra três atores fundamentais do cuidado em um ecossistema sincronizado em tempo real:
1. **Pacientes Crônicos e Idosos:** Acompanham suas rotinas por meio de uma interface adaptada (Modo Sênior), com botões táteis ampliados, leitor por voz sintetizada e confirmação de dose com apenas 1 toque (< 100ms).
2. **Familiares e Cuidadores Autorizados:** Monitoram remotamente e em tempo real a adesão do paciente via *Server-Sent Events (SSE)*, recebendo alertas se doses críticas atrasarem e podendo disparar lembretes sonoros remotos (*Nudge*).
3. **Profissionais de Saúde da Atenção Primária (APS):** Acessam o resumo consolidado de 30 dias de acompanhamento, com curvas clínicas de Pressão Arterial e Glicemia, e exportam o relatório médico em PDF com 1 clique para as consultas na UBS.

---

## 2. Usuários e Perfis de Acesso

* **Perfil Paciente (Seu Antenor Silveira - 72 anos):** Diagnosticado com Hipertensão Arterial Sistêmica e Diabetes Tipo 2. Necessita de comandos de extrema simplicidade (máximo 2 toques), fontes ampliadas (até 22px), modo alto contraste e feedback auditivo.
* **Perfil Cuidador / Familiar (Micael Lima Araujo Frota - Filho):** Responsável pelo acompanhamento diário. Acessa indicadores de adesão, linha do tempo ao vivo das tarefas tomadas ou omitidas e dispara alarmes sonoros remotos.
* **Perfil Profissional de Saúde (Dra. Camila Vasconcelos - CRM-RO 4521):** Médica de Família da Atenção Primária (UBS Nova Floresta). Analisa a taxa de adesão global dos últimos 30 dias, verifica justificativas de omissão e visualiza gráficos evolutivos de pressão e glicemia.

---

## 3. Casos de Uso Principais (UC)

* **UC01 - Cadastrar e Organizar Tratamento:** O paciente ou cuidador registra medicações, dosagens, frequências diárias, horários, consultas médicas, exames laboratoriais e medições de rotina.
* **UC02 - Receber Lembrete e Registrar Conclusão:** O sistema emite alarmes inteligentes visuais e sonoros no horário previsto. O paciente confirma a dose com 1 toque ou justifica o motivo do não cumprimento (ex.: falta de remédio no posto, enjoo ou esquecimento momentâneo).
* **UC03 - Acompanhamento por Cuidador em Tempo Real:** O cuidador visualiza o status das atividades diárias atualizado instantaneamente via SSE e recebe alertas caso uma dose crítica atrase mais de 30 minutos.
* **UC04 - Gerar Resumo de Acompanhamento Clínico (30 Dias):** O sistema compila os registros de adesão, gráficos e justificativas em tela e permite baixar o relatório médico oficial em PDF estruturado com 1 clique (CA03).

---

## 4. Requisitos Funcionais (RF)

* **RF01 - Autenticação e Perfis:** Permitir cadastro e autenticação segura de usuários com suporte a perfis distintos (Paciente, Cuidador Familiar e Médico APS), incluindo recuperação de senha e atalho demo em 1 clique.
* **RF02 - Gestão do Plano de Cuidado:** Cadastrar, editar, visualizar e desativar planos terapêuticos com dosagens, horários, frequências, instruções clínicas e nível de criticidade.
* **RF03 - Notificações Inteligentes:** Disparar alarmes sonoros (Web Audio API), leitor de texto por voz sintetizada (Web Speech API) e notificações visuais automáticas.
* **RF04 - Registro de Execução e Omissão:** Registrar a confirmação imediata da tarefa ou armazenar a justificativa do descumprimento no prontuário histórico do paciente.
* **RF05 - Compartilhamento e Permissões:** Gerenciar vínculos formais entre cuidadores e pacientes, definindo permissões de Edição Total ou Visualização Apenas.
* **RF06 - Relatórios de Adesão e Gráficos:** Gerar relatórios consolidados de 30 dias com gráficos de pressão arterial (sistólica/diastólica) e glicemia em jejum, exportáveis em PDF timbrado com 1 clique.

---

## 5. Requisitos Não Funcionais (RNF)

* **RNF01 - Usabilidade e Acessibilidade:** Interface adaptada para idosos em conformidade com as diretrizes WCAG 2.1 AAA: botões ampliados, modo alto contraste, seletor de 3 tamanhos de fontes (16px, 19px e 22px), leitor auditivo e comandos executáveis em no máximo 2 toques.
* **RNF02 - Segurança e Privacidade (LGPD):** Criptografia de dados pessoais e de saúde de acordo com a Lei 13.709/2018 (LGPD) e boas práticas da RNDS/SUS, com auditoria de logs de consentimento e compartilhamento.
* **RNF03 - Desempenho e Operação Confiável:** Resposta das operações de confirmação em menos de 100ms e persistência estruturada com integridade referencial.
* **RNF04 - Monitoramento e Pontualidade:** Rotina periódica automática que detecta atrasos superiores a 30 minutos em medicamentos críticos e dispara alertas sonoros ao cuidador.

---

## 6. Critérios de Aceite (CA)

* **CA01 (Disparo e Confirmação):** O sistema deve registrar a confirmação e alterar o status da atividade para "Concluído" em menos de 2 segundos (resultado obtido: < 100ms).
* **CA02 (Acompanhamento em Tempo Real):** O familiar/cuidador visualiza as atualizações do plano de cuidados em tempo real sem precisar recarregar a página (obtido via Server-Sent Events).
* **CA03 (Geração de Relatórios em 1 Clique):** Compilar os dados de adesão dos últimos 30 dias em arquivo PDF legível e timbrado com apenas 1 clique no botão dedicado.
* **CA04 (Facilidade de Uso / Máx 2 Toques):** O paciente idoso confirma a tomada do remédio com no máximo 2 toques na tela principal (obtido: 1 toque direto no botão de destaque).

---

## 7. Decisão de Stack e Arquitetura

```
+--------------------------------------------------------------------------+
|                        CAMADA CLIENTE (SPA)                              |
|  Tailwind CSS · Font Awesome · Chart.js · Web Audio API · Web Speech API |
+--------------------------------------------------------------------------+
                                    │
                         HTTP REST  │  Server-Sent Events (SSE)
                                    ▼
+--------------------------------------------------------------------------+
|                       BACKEND (NODE.JS / EXPRESS 5)                      |
|      Rotas RESTful · Engine de Regras Clínicas · Broadcaster de Eventos  |
+--------------------------------------------------------------------------+
                                    │
                                    ▼
+--------------------------------------------------------------------------+
|                        PERSISTÊNCIA DE DADOS                             |
|  Local: database.js + db.json (Atômico)  |  SQL: database/schema.sql     |
+--------------------------------------------------------------------------+
```

* **Frontend:** Single-Page Application (SPA) construída com HTML5 Semântico, Tailwind CSS, Font Awesome 6, Chart.js, Web Audio API e Web Speech API.
* **Backend:** Node.js (v20+ / v22+) com Express 5, CORS e Server-Sent Events (SSE).
* **Banco de Dados:** Engine relacional com script canônico `database/schema.sql` (PostgreSQL / MySQL) e persistência atômica autônoma em `db.json` para execução instantânea sem travas de infraestrutura.
* **Deploy na Nuvem:** Vercel (`https://cuidar-cyan.vercel.app`).

---

## 8. INSTALAÇÃO E EXECUÇÃO (GUIA PASSO A PASSO PARA O PROFESSOR)

> **Nota para o Professor Rafael Pitwak:** O projeto foi configurado para que você possa clonar o repositório em um computador que nunca viu o projeto e colocá-lo para rodar em menos de 2 minutos, sem travar em nenhum ponto.

### 8.1 Ambiente
* **Linguagem:** JavaScript / Node.js (Versão 18, 20 LTS ou 22 recomendada — testado com sucesso no Node v22.22.0).
* **Gerenciador de Pacotes:** npm (v10+).
* **Servidor Local:** Servidor Express embutido rodando na porta `3011`.
* **Comando de Instalação de Dependências:** `npm install`
* **Sistema Operacional Testado:** Windows 11 Pro 64-bit e Linux Ubuntu 22.04 LTS.

---

### 8.2 Banco de Dados
* **SGBD Compatível:** PostgreSQL (v14+), MySQL (v8.0+) ou MariaDB.
* **Nome do Banco de Dados Sugerido:** `cuidar_mais`
* **Caminho do Script SQL:** [`database/schema.sql`](database/schema.sql)
* **Como Executar o Script SQL:**
  * **No PostgreSQL (psql / pgAdmin):**
    ```bash
    psql -U postgres -d cuidar_mais -f database/schema.sql
    ```
  * **No MySQL (Terminal / phpMyAdmin):**
    ```bash
    mysql -u root -p cuidar_mais < database/schema.sql
    ```
  * *Observação de Portabilidade:* O projeto inclui um mecanismo de persistência autônomo baseado em `database.js` e `db.json`. Isso significa que, se você rodar `npm start`, o sistema já inicia com 100% das tabelas criadas e 30 dias de dados de teste realísticos pré-carregados na memória/JSON, dispensando a obrigatoriedade de instalar um SGBD pesado no seu computador de correção!

#### Modelo Completo de Tabelas do Banco de Dados:

| Tabela | Campos Principais | Chave Primária | Relacionamentos |
|---|---|---|---|
| **usuarios** | id_usuario, nome, email, senha_hash, tipo_usuario, data_nascimento, telefone, cidade, condicoes, preferencias_json | `id_usuario` | — |
| **itens_cuidado** | id_item, id_usuario, tipo_item, descricao, dosagem, frequencia, horarios_json, instrucoes, critico, ativo | `id_item` | `id_usuario → usuarios.id_usuario` |
| **agendamentos** | id_agendamento, id_item, id_usuario, descricao_item, dosagem, tipo_item, horario_previsto, data_prevista, hora_prevista, status | `id_agendamento` | `id_item → itens_cuidado.id_item`<br>`id_usuario → usuarios.id_usuario` |
| **registros_execucao** | id_registro, id_agendamento, id_usuario, horario_realizado, status_final, observacao, confirmado_por | `id_registro` | `id_agendamento → agendamentos.id_agendamento`<br>`id_usuario → usuarios.id_usuario` |
| **vinculos_cuidador** | id_vinculo, id_paciente, id_cuidador, parentesco, permissao_nivel, ativo | `id_vinculo` | `id_paciente → usuarios.id_usuario`<br>`id_cuidador → usuarios.id_usuario` |
| **medicoes_saude** | id_medicao, id_usuario, tipo, valor_json, observacao, data_hora | `id_medicao` | `id_usuario → usuarios.id_usuario` |
| **notificacoes** | id_notificacao, id_destinatario, tipo, titulo, mensagem, horario, lida | `id_notificacao` | `id_destinatario → usuarios.id_usuario` |
| **lgpd_logs** | id_log, data_hora, acao, id_usuario, detalhes | `id_log` | `id_usuario → usuarios.id_usuario` |

#### Dados Iniciais (Seed Data):
O script `database/schema.sql` (e a engine `database.js`) já inserem automaticamente:
* 3 Usuários com perfis completos (Paciente idoso, Cuidador familiar e Médica APS).
* 1 Vínculo formal de cuidador autorizado.
* 5 Itens de cuidado contínuo (Losartana 50mg, Metformina 850mg, Anlodipino 5mg, Pressão Arterial e Glicemia).
* 30 dias de agendamentos e registros de execução para gerar os gráficos clínicos.

---

### 8.3 Variáveis de Ambiente
O repositório possui o arquivo de modelo [`.env.example`](.env.example). Para rodar localmente, crie o arquivo `.env` na raiz do projeto:

```bash
# .env.example
PORT=3011
NODE_ENV=development
DB_HOST=localhost
DB_PORT=5432
DB_NAME=cuidar_mais
DB_USER=postgres
DB_PASS=sua_senha_aqui
JWT_SECRET=cuidarmais_secret_token_exemplo_2026
DEMO_SEED_AUTO_LOAD=true
```

| Variável | Para que serve | Como preencher localmente |
|---|---|---|
| `PORT` | Porta HTTP em que o servidor Express escuta conexões | `3011` (padrão) |
| `NODE_ENV` | Define o modo de execução (development/production) | `development` |
| `DB_HOST` | Endereço do host do banco de dados relacional | `localhost` |
| `DB_NAME` | Nome do schema do banco de dados | `cuidar_mais` |
| `DB_USER` | Usuário do banco de dados | `postgres` ou `root` |
| `DB_PASS` | Senha de acesso do banco de dados | Deixar em branco ou digitar a senha local |
| `JWT_SECRET` | Chave de assinatura de tokens de autenticação | Qualquer string de segurança |
| `DEMO_SEED_AUTO_LOAD` | Habilita carga automática dos dados de teste | `true` |

---

### 8.4 Passo a Passo de Instalação (Do Git Clone ao Navegador)

1. **Clonar o Repositório do GitHub:**
   ```bash
   git clone https://github.com/micaelfrota123-cyber/Cuidar-.git
   cd Cuidar-
   ```

2. **Instalar as Dependências:**
   ```bash
   npm install
   ```

3. **Configurar as Variáveis de Ambiente:**
   * No Windows (PowerShell):
     ```powershell
     Copy-Item .env.example .env
     ```
   * No Linux / macOS:
     ```bash
     cp .env.example .env
     ```

4. *(Opcional)* **Criar o Banco de Dados SQL:**
   Se desejar usar PostgreSQL/MySQL em vez da engine embutida, execute:
   ```bash
   psql -U postgres -d cuidar_mais -f database/schema.sql
   ```

5. **Iniciar o Servidor:**
   ```bash
   npm start
   ```
   *O terminal exibirá a mensagem:*  
   `Servidor rodando com sucesso em: http://localhost:3011`

6. **Abrir no Navegador:**
   Acesse a URL exata:  
   👉 **`http://localhost:3011`**  
   *(Ou acesse a versão no ar na Vercel: `https://cuidar-cyan.vercel.app/#dashboard-paciente`)*

---

### 8.5 Como Testar o Sistema

#### Contas de Teste Pré-Configuradas:

| Perfil | Nome | E-mail | Senha |
|---|---|---|---|
| **Paciente (Modo Sênior)** | Seu Antenor Silveira | `antenor@cuidarmais.com.br` | `demo123` |
| **Cuidador Autorizado** | Micael Lima Araujo Frota | `micael@cuidarmais.com.br` | `demo123` |
| **Médica da Família (APS)** | Dra. Camila Vasconcelos | `dra.camila@saude.ro.gov.br` | `demo123` |

*(Você pode alternar entre qualquer um desses perfis instantaneamente com 1 clique no menu superior direito do sistema).*

#### Roteiro do Fluxo Principal de Teste:
1. **Teste do Modo Sênior (CA01 & CA04):**
   * Ao abrir a página inicial, clique no perfil **Seu Antenor**.
   * Veja o card de destaque com o botão verde gigante: **[TOMAR AGORA (1 TOQUE)]**.
   * Clique no botão. Em menos de 100ms o sistema emite um sino suave, o status muda para "Concluído" e a voz do sistema fala: *"Medicação registrada com sucesso!"*.
2. **Teste de Acompanhamento do Cuidador em Tempo Real (CA02):**
   * Abra a aba **"Painel do Cuidador"** (ou abra em uma segunda janela).
   * Observe que as confirmações feitas pelo paciente já refletem na timeline em tempo real.
   * Clique em **"Disparar Lembrete Remoto"** e envie uma mensagem. O sistema apitará e notificará o paciente.
3. **Teste do Relatório Médico de 30 Dias em PDF (CA03):**
   * Clique na aba **"Painel Clínico APS & PDF"**.
   * Visualize os gráficos de Pressão Arterial e Glicemia em Jejum com as médias dos últimos 30 dias.
   * Clique no botão verde: **"Baixar Relatório Médico em PDF (1 Clique)"**. O arquivo PDF timbrado será gerado e baixado no seu computador instantaneamente.
4. **Teste de Acessibilidade (RNF01):**
   * No menu do topo, teste os botões de fonte **[A]**, **[A+]** e **[A++]** (aumenta o texto para 22px).
   * Clique no ícone de meio-círculo (🌓) para ativar o **Modo Alto Contraste** (WCAG AAA).
   * Clique no ícone de alto-falante (🔊) para ouvir o leitor de voz assistivo.

#### Problemas Conhecidos e Limitações Atuais:
* A síntese de voz depende do suporte à Web Speech API nativa do navegador (funciona nativamente no Google Chrome, Microsoft Edge, Safari e Firefox).
* No ambiente Vercel (serveless), os dados em tempo real persistem em memória e via client-side cache; para persistência permanente em nuvem em escala corporativa, recomenda-se plugar um banco gerenciado Neon PostgreSQL via `.env`.

---

## 9. Catálogo Visual das 15 Telas Desenvolvidas

| Nº | Tela | Rota Hash | O que faz |
|---|---|---|---|
| **01** | Landing Page Institucional | `#landing` | Portal de entrada com proposta de valor, estética moderna e selos de conformidade. |
| **02** | Tela de Login | `#login` | Autenticação por e-mail/senha com atalho demo de 1 clique. |
| **03** | Tela de Cadastro | `#cadastro` | Registro de novos usuários com seleção de perfil e termo formal de consentimento LGPD. |
| **04** | Recuperação de Senha | `#recuperar-senha` | Autoatendimento para envio de link e token de redefinição para o e-mail. |
| **05** | Dashboard do Paciente | `#dashboard-paciente` | Card hero com botão **"TOMAR AGORA (1 TOQUE)"**, leitor auditivo e botão de emergência. |
| **06** | Painel do Cuidador | `#painel-cuidador` | Feed ao vivo via SSE, status de PA/glicemia e disparo de alarme sonoro remoto (*Nudge*). |
| **07** | Gestão do Plano de Cuidado | `#plano-cuidado` | Cadastro, edição e desativação de remédios, dosagens, frequências e consultas. |
| **08** | Central de Notificações | `#notificacoes` | Histórico de alarmes sonoros disparados e justificativas documentadas pelo paciente. |
| **09** | Medições de Saúde | `#medicoes` | Registro de aferições de Pressão Arterial (mmHg) e Glicemia Capilar (mg/dL). |
| **10** | Painel Clínico APS & PDF | `#painel-medico` | Gráficos clínicos de 30 dias e **download do Relatório Médico em PDF com 1 clique**. |
| **11** | Assistente IA Cuidar+ | `#ia-assistente` | Algoritmo preditivo que cruza omissões de doses com picos de hipertensão arterial. |
| **12** | Admin: Gestão de Usuários | `#admin-usuarios` | Tabela administrativa de usuários cadastrados, comorbidades e controle de acessos. |
| **13** | Admin: Gestão de Vínculos | `#admin-vinculos` | Mapeamento e autorização formal entre cuidadores e prontuários de pacientes (RF05). |
| **14** | Admin: Auditoria & LGPD | `#admin-lgpd` | Logs de rastreabilidade de acessos, consentimentos e exportações de dados sensíveis. |
| **15** | Configurações do Sistema | `#configuracoes` | Modo Alto Contraste, ajuste de fonte, leitor de voz e botão de restauração dos dados demo. |

---

## 10. Matriz de Avaliação Centelha 3 Rondônia

$$\text{Nota Final} = \frac{2 \times S + M + E + I}{5}$$

* **Solução Inovadora ($S = 5$):** Integração inédita dos três atores da saúde, confirmação em 1 toque (< 100ms), Server-Sent Events e Inteligência Artificial preditiva.
* **Oportunidade de Mercado ($M = 5$):** Envelhecimento populacional acelerado (Censo 2022) e alta demanda por soluções digitais que reduzam internações no SUS.
* **Capacidade de Execução ($E = 5$):** Sistema 100% desenvolvido, publicado na Vercel, testado localmente e versionado no GitHub com catálogo visual de 15 telas.
* **Impacto Socioambiental ($I = 5$):** Promoção da saúde preventiva, mitigação de descompensações clínicas e apoio emocional a famílias cuidadoras.
