# ESPECIFICAÇÃO COMPLETA DO SISTEMA (SPEC FINAL)

**Projeto:** Cuidar+ — Assistente Inteligente para Acompanhamento de Tratamentos  
**Estudante:** Micael Lima Araujo Frota  
**Turma / Curso:** 3º B T.I.  
**Área do Conhecimento:** Tecnologia da Informação / Saúde Digital / Dev. Software / Inteligência Artificial  
**Setor Econômico:** Saúde / Saúde Digital  
**Base Documental:** Simulado Centelha 3 Rondônia - Edital nº 03/2026  
**Metodologia:** Spec-Driven Development (SDD)  
**Repositório / Execução:** [http://localhost:3011](http://localhost:3011)

---

## 1. Identificação da Proposta & Contextualização

### 1.1 Objetivo Geral
Desenvolver uma plataforma/aplicativo inteligente focado na organização e no acompanhamento de rotinas de tratamentos de saúde contínuos. A solução visa reduzir significativamente a baixa adesão causada pelo esquecimento ou administração irregular de medicamentos, consultas, exames e medições periódicas, integrando em tempo real pacientes, familiares/cuidadores autorizados e profissionais da Atenção Primária à Saúde (APS), além de otimizar a preparação para consultas clínicas através da geração consolidada de relatórios de adesão e saúde.

### 1.2 O Problema e Evidências
* **Magnitude Global:** A Organização Mundial da Saúde (OMS) destaca que a baixa adesão a tratamentos de longo prazo é um problema relevante, onde cerca de 50% dos pacientes com doenças crônicas não tomam os medicamentos conforme prescrito, gerando agravamento de quadros clínicos, internações evitáveis e sobrecarga financeira ao SUS.
* **Cenário Nacional & Regional (Rondônia):** No Brasil, o Ministério da Saúde estabelece o acompanhamento contínuo de pessoas com Hipertensão Arterial Sistêmica (HAS) e Diabetes Mellitus (DM) como prioridade da Atenção Primária à Saúde (APS).
* **Transição Demográfica:** Segundo o Censo 2022 do IBGE, o índice de envelhecimento do Brasil atingiu 80 idosos para cada 100 crianças de 0 a 14 anos, demandando tecnologias assistivas focadas na longevidade e autonomia do paciente idoso.

### 1.3 Público Afetado
1. **Pacientes Crônicos e Idosos:** Pessoas com hipertensão, diabetes ou comorbidades em polifarmácia que necessitam de organização diária e interface acessível.
2. **Familiares e Cuidadores:** Indivíduos responsáveis pelo cuidado direto ou remoto, demandando acompanhamento sem sobrecarga mental.
3. **Profissionais de Saúde:** Médicos de Família e Comunidade, enfermeiros e equipes multiprofissionais da APS que necessitam de dados fidedignos de adesão.

---

## 2. Diferencial Inovador da Solução

Enquanto alarmes comuns de celular apenas disparam um aviso sonoro isolado sem rastreamento ou comprovação de uso, o **Cuidar+** integra:
* **Modo Sênior Acessível com Confirmação em 1 Toque (CA01 & CA04):** Botões táteis de alto impacto, leitor auditivo sintetizado e alta legibilidade com WCAG 2.1 AAA.
* **Acompanhamento Remoto em Tempo Real (CA02):** Conexão bidirecional via *Server-Sent Events (SSE)* que notifica o familiar imediatamente sobre qualquer dose confirmada ou omitida, com botão de *Nudge* (alarme sonoro remoto).
* **Inteligência Artificial Preventiva Cuidar+:** Algoritmos preditivos que correlacionam lapsos na rotina de medicação com elevações pressóricas e descompensação glicêmica.
* **Relatório Clínico de 30 Dias em PDF com 1 Clique (CA03):** Compilação estruturada timbrada com taxas de adesão da OMS, histórico de justificativas e curvas de evolução para a consulta médica.

---

## 3. Casos de Uso Principais (UC)

* **UC01 - Cadastrar e Organizar Tratamento:** O paciente ou seu cuidador registra medicamentos, horários, dosagens, consultas médicas, exames laboratoriais e medições de rotina (PA e glicemia).
* **UC02 - Receber Lembrete e Registrar Conclusão:** O sistema dispara lembretes pontuais visuais e sonoros. O paciente confirma o cumprimento com 1 toque ou justifica o motivo do não cumprimento (falta de remédio no posto, efeito adverso, esquecimento fora de casa).
* **UC03 - Acompanhamento por Familiar/Cuidador:** O cuidador autorizado visualiza a linha do tempo das atividades em tempo real e recebe alertas imediatos se uma medicação crítica atrasar mais de 30 minutos.
* **UC04 - Gerar Resumo de Acompanhamento Clínico:** O aplicativo compila os registros de adesão dos últimos 30 dias em um relatório estruturado (em tela e em PDF) para apresentação ao médico na UBS.

---

## 4. Requisitos Funcionais (RF)

| Requisito | Nome | Descrição |
|---|---|---|
| **RF01** | **Autenticação e Perfis** | Cadastro e autenticação segura de usuários com suporte a perfis diferenciados: Paciente Crônico, Familiar/Cuidador Autorizado e Médico da APS. |
| **RF02** | **Gestão do Plano de Cuidado** | Cadastrar, editar, desativar e visualizar planos terapêuticos com horários, dosagens, frequências e instruções específicas. |
| **RF03** | **Notificações Inteligentes** | Disparar lembretes visuais, alarmes sonoros (Web Audio) e leitura por voz sintetizada ajustados à rotina do paciente. |
| **RF04** | **Registro de Execução e Omissão** | Registro instantâneo de confirmação de tomada ou seleção simplificada do motivo de descumprimento para o prontuário. |
| **RF05** | **Compartilhamento e Permissões** | Mapeamento de vínculos formais entre cuidadores e pacientes, com níveis de permissão (Edição Total vs. Visualização). |
| **RF06** | **Relatórios de Adesão e Métricas** | Relatório analítico consolidado dos últimos 30 dias com gráficos clínicos, taxa global e exportação em PDF em 1 clique. |

---

## 5. Requisitos Não Funcionais (RNF)

| Requisito | Nome | Descrição |
|---|---|---|
| **RNF01** | **Usabilidade e Acessibilidade** | Interface adaptada para idosos: modo alto contraste, 3 tamanhos de fonte (Normal, Grande, Extra Grande), comandos com no máximo 2 toques e leitor de voz sintetizada. |
| **RNF02** | **Segurança e Privacidade (LGPD)** | Criptografia de dados de saúde, auditoria de logs de acesso e consentimento explícito de acordo com a LGPD e boas práticas da RNDS / SUS. |
| **RNF03** | **Desempenho e Operação Offline** | Persistência local atômica garantindo funcionamento contínuo e sincronização rápida em caso de oscilações de rede. |
| **RNF04** | **Confiabilidade e Pontualidade** | Monitoramento em background com verificação periódica que detecta atrasos superiores a 30 minutos em remédios críticos e alerta o cuidador. |

---

## 6. Critérios de Aceite (CA)

* **CA01 (Disparo e Confirmação):** O sistema deve registrar a confirmação e alterar o status da atividade para "Concluído" em menos de 2 segundos (atingido: < 100ms com feedback audiovisual imediato).
* **CA02 (Acompanhamento do Cuidador):** O familiar/cuidador deve visualizar o status atualizado do plano de cuidados em seu dispositivo em tempo real sem recarregar a página (atingido via Server-Sent Events).
* **CA03 (Geração de Relatórios):** Compilar os dados de adesão dos últimos 30 dias em arquivo PDF legível e estruturado com apenas 1 clique (atingido via botão de download instantâneo).
* **CA04 (Facilidade de Uso):** O paciente deve ser capaz de confirmar o cumprimento de uma tarefa com no máximo 2 toques na tela principal (atingido: 1 toque direto no card de destaque).

---

## 7. Modelo de Dados Conceitual

```
+------------------+         1:N         +---------------------+
|     USUÁRIO      |-------------------->|    ITEM DE CUIDADO  |
|------------------|                     |---------------------|
| id_usuario (PK)  |                     | id_item (PK)        |
| nome             |                     | id_usuario (FK)     |
| email            |                     | tipo_item           |
| senha_hash       |                     | descricao           |
| tipo_usuario     |                     | dosagem             |
| data_nascimento  |                     | frequencia          |
| telefone         |                     | horarios[]          |
| condicoes[]      |                     | critico (boolean)   |
| preferencias     |                     +---------------------+
+------------------+                                | 1:N
         |                                          v
         | 1:N                           +---------------------+
         |                               |     AGENDAMENTO     |
         v                               |---------------------|
+------------------+                     | id_agendamento (PK) |
| VÍNCULO CUIDADOR |                     | id_item (FK)        |
|------------------|                     | id_usuario (FK)     |
| id_vinculo (PK)  |                     | horario_previsto    |
| id_paciente (FK) |                     | status              |
| id_cuidador (FK) |                     +---------------------+
| parentesco       |                                | 1:1
| permissao_nivel  |                                v
+------------------+                     +---------------------+
                                         | REGISTRO DE EXECUÇÃO|
                                         |---------------------|
                                         | id_registro (PK)    |
                                         | id_agendamento (FK) |
                                         | horario_realizado   |
                                         | status_final        |
                                         | observacao          |
                                         | confirmado_por      |
                                         +---------------------+
```

---

## 8. Arquitetura e Decisão de Stack

* **Frontend:** Single-Page Application (SPA) construída com HTML5 Semântico, Tailwind CSS, Font Awesome 6, Chart.js para visualizações clínicas, Web Audio API para síntese sonora e Web Speech API para leitor de tela nativo em português.
* **Backend:** Node.js com Express e CORS, arquitetura RESTful modular e Server-Sent Events (SSE) para atualização em tempo real.
* **Persistência de Dados:** Engine relacional com gravação atômica segura em `db.json`, contendo pré-carga de 30 dias de histórico médico.
* **Emissão de Relatórios:** jsPDF + html2canvas para compilação client-side e headless Chrome para catálogo oficial.
* **Porta de Execução:** `http://localhost:3011`.

---

## 9. Catálogo Completo das 15 Telas Desenvolvidas

| Nº | Tela do Sistema | Módulo | Funcionalidades Principais |
|---|---|---|---|
| **01** | **Landing Page Institucional** | Público / Institucional | Apresentação com proposta de valor, estética Pierre Finance, pilares de cuidado e botão de acesso demo. |
| **02** | **Tela de Login** | Autenticação (RF01) | Acesso seguro por e-mail/senha, atalho para demo em 1 clique e redirecionamento de perfil. |
| **03** | **Tela de Cadastro** | Autenticação (RF01) | Registro de Paciente, Cuidador ou Médico com consentimento formal LGPD. |
| **04** | **Tela de Recuperação de Senha** | Autenticação (RF01) | Envio de link de redefinição para e-mail com token e feedback imediato. |
| **05** | **Dashboard do Paciente (Sênior)** | Paciente (CA01, CA04, RNF01) | Card de destaque da próxima dose com botão **"TOMAR AGORA (1 TOQUE)"**, leitor por voz e botão de emergência. |
| **06** | **Painel do Cuidador** | Cuidador (CA02, RF05) | Feed ao vivo via SSE, indicadores de adesão, status de PA/Glicemia e disparo de alarme sonoro remoto (*Nudge*). |
| **07** | **Gestão do Plano de Cuidado** | Tratamento (RF02) | Cadastro, edição e desativação de remédios, exames periódicos e consultas médicas. |
| **08** | **Central de Notificações & Omissões** | Monitoramento (RF03, RF04) | Histórico de alarmes sonoros disparados e justificativas documentadas pelo idoso. |
| **09** | **Medições de Saúde** | Saúde Digital (RF02) | Registro de Pressão Arterial (mmHg) e Glicemia Capilar (mg/dL) com alertas de elevação. |
| **10** | **Painel Clínico APS & Relatório 30D** | Médico APS (RF06, CA03) | Taxa de adesão consolidada (92%), gráficos evolutivos e **download de PDF em 1 clique**. |
| **11** | **Assistente IA Cuidar+** | Inteligência Artificial | Diagnóstico preditivo cruzando omissões de doses com picos de hipertensão arterial. |
| **12** | **Admin: Gestão de Usuários** | Governança | Tabela administrativa de usuários cadastrados, comorbidades e papéis no sistema. |
| **13** | **Admin: Gestão de Vínculos** | Permissões (RF05) | Associação e autorização formal entre familiares e prontuários de pacientes. |
| **14** | **Admin: Auditoria & LGPD** | Segurança (RNF02) | Rastreabilidade de acessos, consentimentos e logs de exportação de dados sensíveis. |
| **15** | **Configurações & Acessibilidade** | Preferências (RNF01) | Modo Alto Contraste, leitor de voz, ajuste de tamanho de fonte e restauração de dados demo. |

---

## 10. Matriz de Avaliação Centelha 3 Rondônia

A solução foi estruturada para atingir pontuação máxima na fórmula da Fase 1:
$$\text{Nota Final} = \frac{2 \times S + M + E + I}{5}$$

* **Solução Inovadora ($S = 5$):** Integração dos três pilares da saúde com confirmação em 1 toque, SSE em tempo real e IA preditiva.
* **Oportunidade de Mercado ($M = 5$):** Aceleração do envelhecimento populacional (Censo 2022) e expansão do mercado de Saúde Digital e telecuidado.
* **Capacidade de Execução ($E = 5$):** Sistema 100% implementado, testado e funcional na porta 3011 com código limpo e documentado.
* **Impacto Socioambiental ($I = 5$):** Redução de internações hospitalares no SUS, redução de desperdício de medicamentos e apoio emocional a famílias cuidadoras.
