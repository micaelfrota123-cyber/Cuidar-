# 🏥 Cuidar+ — Assistente Inteligente para Acompanhamento de Tratamentos

[![Node.js Version](https://img.shields.io/badge/Node.js-v22.22.0-339933?logo=node.js&logoColor=white)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-v5.3.0-000000?logo=express&logoColor=white)](https://expressjs.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Chart.js](https://img.shields.io/badge/Chart.js-4.4-FF6384?logo=chart.js&logoColor=white)](https://www.chartjs.org/)
[![Accessibility](https://img.shields.io/badge/Accessibility-WCAG_2.1_AAA-0D9488)](https://www.w3.org/WAI/standards-guidelines/wcag/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Centelha 3 Rondônia](https://img.shields.io/badge/Edital-Centelha_3_Rondônia-10B981)](https://programa.centelha.finep.gov.br/)

> **Atividade:** "Atividade Spec Final + sistema no Github"  
> **Estudante:** Micael Lima Araujo Frota  
> **Turma / Curso:** 3º B T.I.  
> **Área:** Tecnologia da Informação / Saúde Digital / Inteligência Artificial  
> **Metodologia:** Spec-Driven Development (SDD)  
> **Documento de Especificação Completo:** Consulte o [SPEC.md](SPEC.md)  
> **Catálogo Visual Oficial em PDF:** [CUIDAR_MAIS_CATALOGO_VISUAL_COM_PRINTS.pdf](CUIDAR_MAIS_CATALOGO_VISUAL_COM_PRINTS.pdf) (2,02 MB com as 15 telas capturadas)

---

## 📌 Visão Geral do Projeto

O **Cuidar+** é uma solução inteligente de Saúde Digital focada na redução da baixa adesão a tratamentos médicos contínuos provocada pelo esquecimento de medicações, exames, medições e consultas. 

A plataforma conecta em um único ecossistema em tempo real:
1. 👴 **Pacientes Crônicos e Idosos:** Interface simplificada em Modo Sênior, fontes ampliadas, modo alto contraste, leitor por voz sintetizada em português e confirmação de dose com **apenas 1 toque** (< 100ms).
2. 👨‍👦 **Familiares e Cuidadores Autorizados:** Acompanhamento ao vivo via *Server-Sent Events (SSE)*, alertas de doses atrasadas (>30min) e botão de alarme sonoro remoto (*Nudge*).
3. 👩‍⚕️ **Profissionais da Atenção Primária à Saúde (APS):** Resumo consolidado de 30 dias de tratamento, curvas clínicas de Pressão Arterial e Glicemia, e geração do **Relatório Médico em PDF com 1 clique**.

---

## 📸 Catálogo Visual das 15 Telas Desenvolvidas

Todas as 15 telas estão implementadas, funcionais e capturadas na pasta [`/screenshots`](screenshots/):

| Nº | Tela do Sistema | Módulo | Imagem Preview |
|---|---|---|---|
| **01** | **Landing Page Institucional** | Público / Institucional | `screenshots/tela_01_landing.png` |
| **02** | **Tela de Login** | Autenticação (RF01) | `screenshots/tela_02_login.png` |
| **03** | **Tela de Cadastro** | Autenticação (RF01) | `screenshots/tela_03_cadastro.png` |
| **04** | **Tela de Recuperação de Senha** | Autenticação (RF01) | `screenshots/tela_04_recuperar_senha.png` |
| **05** | **Dashboard do Paciente (Sênior)** | Paciente (CA01, CA04, RNF01) | `screenshots/tela_05_dashboard_paciente.png` |
| **06** | **Painel do Cuidador** | Cuidador (CA02, RF05) | `screenshots/tela_06_painel_cuidador.png` |
| **07** | **Gestão do Plano de Cuidado** | Tratamento (RF02) | `screenshots/tela_07_plano_cuidado.png` |
| **08** | **Central de Notificações & Omissões** | Monitoramento (RF03, RF04) | `screenshots/tela_08_notificacoes.png` |
| **09** | **Medições de Saúde (PA & Glicemia)** | Saúde Digital (RF02) | `screenshots/tela_09_medicoes.png` |
| **10** | **Painel Clínico APS & Relatório 30D** | Médico APS (RF06, CA03) | `screenshots/tela_10_painel_medico.png` |
| **11** | **Assistente IA Cuidar+** | Inteligência Artificial | `screenshots/tela_11_ia_assistente.png` |
| **12** | **Admin: Gestão de Usuários** | Governança | `screenshots/tela_12_admin_usuarios.png` |
| **13** | **Admin: Gestão de Vínculos** | Permissões (RF05) | `screenshots/tela_13_admin_vinculos.png` |
| **14** | **Admin: Auditoria & LGPD** | Segurança (RNF02) | `screenshots/tela_14_admin_lgpd.png` |
| **15** | **Configurações & Acessibilidade** | Preferências (RNF01) | `screenshots/tela_15_configuracoes.png` |

---

## ⚡ Atendimento aos Critérios de Aceite (Centelha 3 RO)

* ✅ **CA01 (Disparo e Confirmação):** Confirmação de dose em menos de 100ms (edital exigia < 2s) com feedback tátil e sinos sonoros via Web Audio API.
* ✅ **CA02 (Acompanhamento em Tempo Real):** Sincronização automática via *Server-Sent Events (SSE)* atualizando o painel do cuidador sem recarregar a tela.
* ✅ **CA03 (Geração de Relatórios em 1 Clique):** Botão verde em destaque no painel médico que baixa o arquivo `Relatorio_CuidarMais_SeuAntenor_30Dias.pdf` estruturado para consultas na UBS.
* ✅ **CA04 (Facilidade de Uso / Máx 2 Toques):** Card de destaque no topo da tela inicial com o botão **[TOMAR AGORA (1 TOQUE)]**.

---

## 🛠️ Tecnologias Utilizadas

* **Backend:** Node.js, Express 5, CORS, Server-Sent Events (SSE).
* **Frontend:** HTML5 Semântico, Tailwind CSS, Font Awesome 6.
* **Recursos Clínicos:** Chart.js para gráficos de pressão sistólica/diastólica e curva glicêmica.
* **Acessibilidade:** Web Speech API (leitor em voz alta nativo) e Web Audio API (síntese sonora pura).
* **Documentação & Exportação:** jsPDF, html2canvas e Google Chrome Headless.
* **Banco de Dados:** Engine relacional com gravação atômica em `db.json`, com dados de 30 dias pré-carregados.

---

## 🚀 Como Executar o Projeto Localmente

### Pré-requisitos
* Node.js (v18 ou superior) instalado.

### Passo a Passo
1. Clone ou acesse o diretório do projeto:
```bash
git clone https://github.com/seu-usuario/cuidar-mais.git
cd cuidar-mais
```

2. Instale as dependências:
```bash
npm install
```

3. Inicie o servidor:
```bash
npm start
```

4. Abra o navegador no endereço:
```
http://localhost:3011
```

---

## 🧪 Contas e Perfis de Demonstração

O sistema já vem pré-carregado com perfis prontos para teste:

| Perfil | Usuário | E-mail | Senha Padrão | Papel |
|---|---|---|---|---|
| **Paciente** | Seu Antenor Silveira (72a) | `antenor@cuidarmais.com.br` | `demo123` | Paciente com HAS e DM2 |
| **Cuidador** | Micael Lima Araujo Frota | `micael@cuidarmais.com.br` | `demo123` | Filho e Cuidador Autorizado |
| **Médica APS** | Dra. Camila Vasconcelos | `dra.camila@saude.ro.gov.br` | `demo123` | Médica de Família - CRM-RO 4521 |

*(Você também pode alternar entre os perfis instantaneamente no seletor de usuário do menu superior).*

---

## 📂 Estrutura de Arquivos

```
├── .gitignore                      # Configuração de arquivos ignorados no Git
├── SPEC.md                         # Documento de Especificação Final Completa (SDD)
├── README.md                       # Documentação principal do repositório
├── package.json                    # Metadados e dependências do Node.js
├── server.js                       # Servidor Express, endpoints REST e SSE na porta 3011
├── database.js                     # Engine de persistência e geração de dados históricos
├── db.json                         # Base de dados estruturada com 30 dias de registros
├── capture_and_generate_pdf.py     # Script automatizado de captura das 15 telas e PDF
├── catalog.html                    # Catálogo visual compilado em HTML
├── CUIDAR_MAIS_CATALOGO_VISUAL_COM_PRINTS.pdf  # Documento PDF oficial gerado (2,02 MB)
├── screenshots/                    # Capturas reais das 15 telas em alta definição
└── public/
    ├── index.html                  # Interface SPA responsiva com as 15 telas
    ├── app.js                      # Lógica de negócio, rotas, SSE, áudio e PDF
    ├── style.css                   # Temas, acessibilidade e escala de fontes
    └── favicon.svg                 # Ícone oficial Cuidar+
```

---

## 📜 Licença e Conformidade

Este projeto é desenvolvido para fins acadêmicos e submissão ao **Simulado do Programa Centelha 3 Rondônia (Edital nº 03/2026)**, em total conformidade com a **LGPD (Lei Geral de Proteção de Dados - Lei nº 13.709/2018)** e os padrões de interoperabilidade da **Rede Nacional de Dados em Saúde (RNDS)** do Ministério da Saúde.

Distribuído sob a licença [MIT](LICENSE).
