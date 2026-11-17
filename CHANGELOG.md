# 📋 CHANGELOG — Registro de Decisões, Correções e Revisão Humana

**Projeto:** Cuidar+ — Assistente Inteligente para Acompanhamento de Tratamentos  
**Estudante:** Micael Lima Araujo Frota (3º B T.I. — IFRO Calama)  
**Professor Orientador:** Prof. Rafael Pitwak  
**Componente Curricular:** Desenvolvimento de Sistemas  

Este documento registra cronologicamente as principais decisões de arquitetura, correções técnicas de código e intervenções humanas realizadas sobre o código gerado pelo agente de Inteligência Artificial (Google Antigravity), demonstrando a aplicação prática da metodologia *Spec-Driven Development* (SDD).

---

## [v2.4.0] — 2026-11-17 (Fase Atual: Publicação na Nuvem, Vercel & Spec Final)
### Adicionado
- **Deploy na Nuvem (Vercel):** Aplicação publicada e acessível em `https://cuidar-cyan.vercel.app/#dashboard-paciente`.
- **Script SQL do Banco de Dados (`database/schema.sql`):** Criação de tabelas completas com chaves primárias, estrangeiras e carga inicial de dados (seed data).
- **Variáveis de Ambiente (`.env.example`):** Modelo de configuração segura sem credenciais expostas no código.
- **Spec Final Completa (`spec.md`):** Atualização com o guia passo a passo de instalação e execução para o professor (`git clone` até `http://localhost:3011`).

### Decisão de Revisão Humana
- **Decisão:** Manter a persistência local em `db.json` com fallback e fornecer o script `database/schema.sql` para garantir que o professor consiga rodar localmente sem travar caso não tenha o PostgreSQL ou MySQL configurado no computador da correção.

---

## [v2.0.0] — 2026-10-20 (Expansão para 15 Telas, Catálogo em PDF & Gestão Administrativa)
### Adicionado
- **Módulos Administrativos:** Telas de gestão de usuários (`#admin-usuarios`), controle formal de vínculos de cuidadores (`#admin-vinculos`) e auditoria de consentimento da LGPD (`#admin-lgpd`).
- **Autenticação Completa:** Telas de login com atalho demo de 1 clique, cadastro de novos usuários com perfis e recuperação de senha.
- **Catálogo Visual Oficial:** Script em Python (`capture_and_generate_pdf.py`) para capturar as 15 telas via Google Chrome Headless e compilar o PDF oficial `CUIDAR_MAIS_CATALOGO_VISUAL_COM_PRINTS.pdf` (2,02 MB).

### Correção Técnica / Intervenção Humana
- **Problema Detectado:** O Chrome Headless travava na primeira captura porque a conexão de *Server-Sent Events* (SSE) mantinha a rede aberta indefinidamente.
- **Revisão Humana:** Identifiquei o travamento e ordenei a criação da flag `?nosse=1` no frontend, desativando o SSE durante a execução do script de captura. As 15 telas foram capturadas em menos de 30 segundos.
- **Bloqueio de Arquivo no Windows:** Corrigi o travamento de descritor aberto de arquivo ao compactar o ZIP matando processos órfãos do Chrome e usando cópia atômica.

---

## [v1.0.0] — 2026-10-13 (Núcleo Operacional do Cuidar+ na Porta 3011)
### Adicionado
- **Servidor Express (Porta 3011):** APIs RESTful para usuários, itens de cuidado, agendamentos, medições clínicas e relatórios.
- **Acessibilidade Sênior (RNF01):** Modo Alto Contraste (WCAG 2.1 AAA), 3 tamanhos de fonte (Normal, Grande, Extra Grande) e sintetizador de voz (Web Speech API).
- **Tempo Real (CA02):** Conexão bidirecional via Server-Sent Events (SSE) notificando o cuidador instantaneamente sobre confirmações ou alertas.
- **Critério CA01 e CA04:** Card de destaque no painel do paciente com confirmação de dose em 1 toque (< 100ms).
- **Critério CA03:** Geração e download do Relatório Médico de Adesão dos últimos 30 dias em PDF com 1 clique.

### Correção Técnica / Intervenção Humana
- **Problema Detectado:** O Express 5 rejeitou a rota `app.get('*', ...)` com o erro `PathError: Missing parameter name at index 1: *`.
- **Revisão Humana:** O agente havia proposto a sintaxe legada do Express 4. Analisei o log do Node.js v22 e determinei a substituição pelo middleware canônico `app.use((req, res) => res.sendFile(...))`, restabelecendo o SPA imediatamente.
- **Auditoria Clínica:** Revisei os parâmetros de pressão arterial para garantir conformidade com as Diretrizes Brasileiras de Hipertensão (alerta automático para valores $\ge 140/90$ mmHg).

---

## [v0.1.0] — 2026-06-17 (Ideação, Edital Centelha 3 Rondônia & Vídeo Pitch)
### Adicionado
- **Formulário Centelha 3 RO (Fase 1):** Preenchimento das 17 questões sobre problema, mercado, impacto e execução.
- **Vídeo Pitch (3 minutos):** Roteiro e gravação publicados no YouTube (`https://youtu.be/3XMOlI1-3XU`).
- **Especificação Inicial:** Mapeamento conceitual de entidades, casos de uso UC01 a UC04 e definição da stack tecnológica.
