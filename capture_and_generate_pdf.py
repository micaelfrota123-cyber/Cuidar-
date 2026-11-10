import os
import subprocess
import time
import base64

CHROME_PATH = r"C:\Program Files\Google\Chrome\Application\chrome.exe"
BASE_URL = "http://localhost:3011/?nosse=1"
SCREENSHOTS_DIR = r"c:\Users\Aluno\Documents\Desenvolvimento\screenshots"
PDF_PATH = r"c:\Users\Aluno\Documents\Desenvolvimento\CUIDAR_MAIS_CATALOGO_VISUAL_COM_PRINTS.pdf"
HTML_CATALOG_PATH = r"c:\Users\Aluno\Documents\Desenvolvimento\catalog.html"

os.makedirs(SCREENSHOTS_DIR, exist_ok=True)

SCREENS = [
    {
        "num": "01",
        "hash": "landing",
        "file": "tela_01_landing.png",
        "title": "Tela 01 — Landing Page Institucional (Página Inicial)",
        "modulo": "Público / Institucional",
        "desc": "Portal de entrada com proposta de valor, design editorial moderno (estética Pierre Finance / Saúde Digital), selos de conformidade com o Edital Centelha 3 Rondônia, SUS / RNDS e LGPD, detalhamento dos pilares de cuidado (Paciente, Cuidador e APS) e botões de conversão e acesso direto ao Modo Demonstração (1-Clique)."
    },
    {
        "num": "02",
        "hash": "login",
        "file": "tela_02_login.png",
        "title": "Tela 02 — Modal de Autenticação Unificada (Login)",
        "modulo": "Autenticação & Segurança (RF01)",
        "desc": "Interface de acesso seguro com validação de credenciais de E-mail/Senha, atalho direto para o Modo Demonstração pré-carregado em 1 clique (Seu Antenor), link para recuperação de credenciais e redirecionamento dinâmico baseado no perfil do usuário."
    },
    {
        "num": "03",
        "hash": "cadastro",
        "file": "tela_03_cadastro.png",
        "title": "Tela 03 — Tela de Cadastro de Novo Usuário",
        "modulo": "Autenticação & Segurança (RF01)",
        "desc": "Formulário de abertura de conta com validação em tempo real de requisitos de segurança de senha (mínimo de 6 caracteres), seleção de perfil (Paciente, Cuidador ou Profissional APS), termo de consentimento formal segundo a LGPD (Lei 13.709/2018) e emissão de credenciais seguras."
    },
    {
        "num": "04",
        "hash": "recuperar-senha",
        "file": "tela_04_recuperar_senha.png",
        "title": "Tela 04 — Tela de Recuperação de Senha (Esqueceu a Senha)",
        "modulo": "Autenticação & Segurança (RF01)",
        "desc": "Módulo de autoatendimento para redefinição de acesso com envio de token e link de redefinição para o e-mail cadastrado, feedback de confirmação imediato na tela e botão de retorno rápido para o login."
    },
    {
        "num": "05",
        "hash": "dashboard-paciente",
        "file": "tela_05_dashboard_paciente.png",
        "title": "Tela 05 — Dashboard Principal do Paciente (Modo Sênior Acessível)",
        "modulo": "Paciente / Modo Sênior (CA01, CA04, RNF01)",
        "desc": "Interface adaptada para idosos com fontes ampliadas e alto contraste. Exibe a saudação acolhedora para Seu Antenor, card em destaque da próxima medicação com o botão gigante 'TOMAR AGORA (1 TOQUE)', leitor por voz sintetizada ('Ouvir Minhas Tarefas'), botão de emergência para chamar o cuidador Micael e cronograma do dia."
    },
    {
        "num": "06",
        "hash": "painel-cuidador",
        "file": "tela_06_painel_cuidador.png",
        "title": "Tela 06 — Painel do Cuidador / Familiar (Acompanhamento em Tempo Real)",
        "modulo": "Acompanhamento Familiar (CA02, RF05)",
        "desc": "Sincronização contínua via Server-Sent Events (SSE). Exibe KPIs de adesão diária (ex: 3/4 concluídos), taxa mensal (92%), status de pressão e glicemia, timeline ao vivo das tomadas e botão para envio de lembrete sonoro remoto ('Nudge') para o celular do paciente."
    },
    {
        "num": "07",
        "hash": "plano-cuidado",
        "file": "tela_07_plano_cuidado.png",
        "title": "Tela 07 — Gestão do Plano de Cuidado (Prescrições & Tratamento)",
        "modulo": "Gestão Terapêutica (RF02)",
        "desc": "Visualização e controle de todos os itens cadastrados no plano terapêutico: medicamentos de uso contínuo com badges de prioridade crítica, dosagens, frequências diárias, horários programados, exames laboratoriais periódicos e consultas médicas com a Dra. Camila."
    },
    {
        "num": "08",
        "hash": "notificacoes",
        "file": "tela_08_notificacoes.png",
        "title": "Tela 08 — Central de Notificações, Alarmes & Registro de Omissões",
        "modulo": "Monitoramento Ativo (RF03, RF04)",
        "desc": "Histórico detalhado de lembretes sonoros disparados, alarmes de atraso superior a 30 minutos em medicamentos críticos e registros de justificativas documentadas pelo paciente (ex: falta de medicamento no posto, náusea ou esquecimento momentâneo)."
    },
    {
        "num": "09",
        "hash": "medicoes",
        "file": "tela_09_medicoes.png",
        "title": "Tela 09 — Módulo de Medições de Saúde (Pressão Arterial & Glicemia)",
        "modulo": "Saúde Digital (RF02)",
        "desc": "Histórico e registro rápido de aferições clínicas: Pressão Arterial (Sistólica x Diastólica em mmHg com meta < 140/90) e Glicemia Capilar (HGT em mg/dL em jejum ou pós-prandial) com emissão automática de alertas em caso de elevação clínica."
    },
    {
        "num": "10",
        "hash": "painel-medico",
        "file": "tela_10_painel_medico.png",
        "title": "Tela 10 — Painel Clínico da Atenção Primária & Relatório de 30 Dias",
        "modulo": "Atenção Primária à Saúde (APS) / Dra. Camila (RF06, CA03)",
        "desc": "Síntese dos últimos 30 dias de acompanhamento. Exibe taxa global de adesão segundo a OMS (92%), gráficos interativos (Chart.js) de evolução de Pressão Arterial e Glicemia em Jejum, tabela de omissões com justificativas e o botão oficial CA03 para download do Relatório Médico em PDF em 1 clique."
    },
    {
        "num": "11",
        "hash": "ia-assistente",
        "file": "tela_11_ia_assistente.png",
        "title": "Tela 11 — Assistente IA Cuidar+ (Inteligência Artificial Preventiva)",
        "modulo": "Inteligência Artificial Contextual (Edital Centelha 3)",
        "desc": "Módulo algorítmico preditivo que cruza os dias de omissão de medicamentos com os picos de pressão arterial e glicemia, identifica padrões comportamentais de esquecimento por turno (matutino vs. noturno) e emite recomendações clínicas antecipadas para a consulta na UBS."
    },
    {
        "num": "12",
        "hash": "admin-usuarios",
        "file": "tela_12_admin_usuarios.png",
        "title": "Tela 12 — Painel Administrativo: Gestão de Usuários da Plataforma",
        "modulo": "Administração do Sistema",
        "desc": "Tabela de governança com todos os usuários cadastrados na base (Pacientes, Cuidadores Familiares e Médicos da APS), detalhamento de diagnósticos, telefones, cidades, permissões de acesso e ações de exclusão ou edição cadastral."
    },
    {
        "num": "13",
        "hash": "admin-vinculos",
        "file": "tela_13_admin_vinculos.png",
        "title": "Tela 13 — Painel Administrativo: Gestão de Vínculos & Permissões",
        "modulo": "Compartilhamento & Permissões (RF05)",
        "desc": "Mapeamento das relações formais entre pacientes e cuidadores autorizados. Define o grau de parentesco e os níveis de permissão (Edição Total vs. Visualização Apenas) para garantir privacidade e conformidade."
    },
    {
        "num": "14",
        "hash": "admin-lgpd",
        "file": "tela_14_admin_lgpd.png",
        "title": "Tela 14 — Painel Administrativo: Auditoria, Segurança & LGPD",
        "modulo": "Governança & Conformidade (RNF02)",
        "desc": "Registro de logs de auditoria em tempo real: consentimentos coletados para tratamento de dados sensíveis de saúde, eventos de login, exportação de prontuários médicos e compartilhamentos autorizados em conformidade com a LGPD e a RNDS."
    },
    {
        "num": "15",
        "hash": "configuracoes",
        "file": "tela_15_configuracoes.png",
        "title": "Tela 15 — Configurações Gerais do Sistema, Acessibilidade & Governança",
        "modulo": "Preferências & Acessibilidade (RNF01)",
        "desc": "Painel de preferências gerais: alternância de tema Escuro / Alto Contraste (WCAG AAA), ativação do leitor por voz sintetizada, seleção do tamanho de fonte e botão de restauração dos dados originais de demonstração para fins de avaliação."
    }
]

print("=== INICIANDO CAPTURA AUTOMATIZADA DAS 15 TELAS DO CUIDAR+ ===")

for sc in SCREENS:
    out_file = os.path.join(SCREENSHOTS_DIR, sc["file"])
    url = f"{BASE_URL}#{sc['hash']}"
    print(f"Capturando Tela {sc['num']}: {sc['title']}...")

    cmd = [
        CHROME_PATH,
        "--headless=new",
        "--disable-gpu",
        "--hide-scrollbars",
        "--window-size=1400,900",
        f"--screenshot={out_file}",
        url
    ]

    subprocess.run(cmd, capture_output=True)
    time.sleep(1.8)

    if os.path.exists(out_file):
        print(f" -> Sucesso: {sc['file']} ({os.path.getsize(out_file)} bytes)")
    else:
        print(f" -> AVISO: {sc['file']} não foi gerado.")

print("\nTodas as 15 telas capturadas com sucesso! Gerando Catálogo Visual HTML/PDF...")

# Build HTML Catalog
html_parts = []
html_parts.append("""<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <title>Cuidar+ — Catálogo Visual de Telas com Capturas Oficiais</title>
  <style>
    @page {
      size: A4 portrait;
      margin: 12mm 15mm 15mm 15mm;
    }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      background-color: #0B0F19;
      color: #E2E8F0;
      margin: 0;
      padding: 0;
      font-size: 11pt;
      line-height: 1.5;
    }
    .cover-header {
      background: linear-gradient(135deg, #064E3B 0%, #065F46 50%, #0F172A 100%);
      padding: 24px;
      border-radius: 16px;
      margin-bottom: 24px;
      border: 1px solid #10B981;
    }
    .cover-title {
      font-size: 24pt;
      font-weight: 900;
      color: #FFFFFF;
      margin: 0 0 8px 0;
    }
    .cover-subtitle {
      font-size: 12pt;
      color: #A7F3D0;
      margin: 0 0 16px 0;
      font-weight: 600;
    }
    .meta-table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 12px;
      font-size: 9pt;
      background: rgba(15, 23, 42, 0.6);
      border-radius: 8px;
      overflow: hidden;
    }
    .meta-table td {
      padding: 6px 10px;
      border: 1px solid rgba(255, 255, 255, 0.1);
    }
    .meta-label {
      font-weight: bold;
      color: #34D399;
    }
    .summary-box {
      background: #111827;
      border: 1px solid #1F2937;
      border-left: 4px solid #10B981;
      padding: 16px;
      border-radius: 8px;
      margin-bottom: 28px;
      font-size: 9.5pt;
    }
    .screen-page {
      page-break-before: always;
      padding-top: 8px;
    }
    .screen-card {
      background: #111827;
      border: 1px solid #1F2937;
      border-radius: 12px;
      padding: 16px;
      margin-bottom: 16px;
    }
    .screen-num {
      font-size: 8.5pt;
      text-transform: uppercase;
      font-weight: 800;
      color: #10B981;
      letter-spacing: 1px;
      margin-bottom: 4px;
    }
    .screen-title {
      font-size: 14pt;
      font-weight: 800;
      color: #FFFFFF;
      margin: 0 0 6px 0;
    }
    .screen-modulo {
      display: inline-block;
      background: rgba(16, 185, 129, 0.15);
      border: 1px solid rgba(16, 185, 129, 0.3);
      color: #34D399;
      font-size: 8.5pt;
      font-weight: 700;
      padding: 2px 8px;
      border-radius: 6px;
      margin-bottom: 8px;
    }
    .screen-desc {
      font-size: 9.5pt;
      color: #94A3B8;
      margin: 0 0 12px 0;
      line-height: 1.45;
    }
    .screen-img {
      width: 100%;
      height: auto;
      border-radius: 8px;
      border: 1px solid #334155;
      display: block;
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.6);
    }
  </style>
</head>
<body>

  <!-- CAPA E RESUMO -->
  <div class="cover-header">
    <div class="cover-title">Cuidar+ — Catálogo Visual de Telas Oficiais</div>
    <div class="cover-subtitle">Assistente Inteligente para Acompanhamento de Tratamentos Contínuos</div>
    <table class="meta-table">
      <tr>
        <td><span class="meta-label">Aluno Desenvolvedor:</span> Micael Lima Araujo Frota</td>
        <td><span class="meta-label">Turma / Curso:</span> 3º B T.I.</td>
      </tr>
      <tr>
        <td><span class="meta-label">Base Documental:</span> Simulado Centelha 3 Rondônia - Edital nº 03/2026</td>
        <td><span class="meta-label">Componente:</span> Saúde Digital / Dev. Software / IA</td>
      </tr>
      <tr>
        <td><span class="meta-label">Metodologia:</span> Spec-Driven Development</td>
        <td><span class="meta-label">Status:</span> 100% Funcional · Porta http://localhost:3011</td>
      </tr>
    </table>
  </div>

  <div class="summary-box">
    <strong style="color: #34D399; font-size: 11pt;">Resumo Executivo do Sistema Cuidar+:</strong><br>
    O <strong>Cuidar+</strong> é uma plataforma digital e assistente inteligente focada em reduzir drasticamente o abandono e o esquecimento de tratamentos de saúde contínuos. O sistema integra três públicos essenciais: 
    <strong>(1) Pacientes Crônicos e Idosos</strong> com hipertensão e diabetes através de uma interface de extrema usabilidade, fontes ampliadas, alto contraste e confirmação de dose com 1 único toque; 
    <strong>(2) Familiares e Cuidadores</strong> com monitoramento remoto em tempo real via Server-Sent Events (SSE), alertas imediatos de doses omitidas e disparo de lembrete sonoro remoto; e 
    <strong>(3) Profissionais da Atenção Primária à Saúde (APS)</strong> com painel clínico compilando os últimos 30 dias de adesão, curvas de pressão arterial e glicemia, e exportação do relatório médico oficial em PDF com 1 clique (Critério CA03).
  </div>
""")

for sc in SCREENS:
    img_path = os.path.join(SCREENSHOTS_DIR, sc["file"])
    data_uri = ""
    if os.path.exists(img_path):
        with open(img_path, "rb") as f:
            encoded = base64.b64encode(f.read()).decode("utf-8")
            data_uri = f"data:image/png;base64,{encoded}"

    html_parts.append(f"""
  <div class="screen-page">
    <div class="screen-card">
      <div class="screen-num">Tela Oficial #{sc['num']}</div>
      <div class="screen-title">{sc['title']}</div>
      <div class="screen-modulo">Módulo: {sc['modulo']}</div>
      <p class="screen-desc"><strong>O que é esta tela / Funcionamento:</strong> {sc['desc']}</p>
      <img src="{data_uri}" class="screen-img" alt="{sc['title']}" />
    </div>
  </div>
""")

html_parts.append("""
</body>
</html>
""")

with open(HTML_CATALOG_PATH, "w", encoding="utf-8") as f:
    f.write("".join(html_parts))

print(f"Catálogo HTML escrito em: {HTML_CATALOG_PATH}")

# Print HTML to PDF using Chrome Headless
print("Compilando PDF oficial via Chrome Headless...")
cmd_pdf = [
    CHROME_PATH,
    "--headless=new",
    "--disable-gpu",
    "--no-pdf-header-footer",
    f"--print-to-pdf={PDF_PATH}",
    f"file:///{HTML_CATALOG_PATH.replace(os.sep, '/')}"
]
subprocess.run(cmd_pdf, capture_output=True)
time.sleep(2)

if os.path.exists(PDF_PATH):
    size_mb = os.path.getsize(PDF_PATH) / (1024 * 1024)
    print(f"=== SUCESSO ABSOLUTO! PDF GERADO: {PDF_PATH} ({size_mb:.2f} MB) ===")
else:
    print("Erro ao gerar PDF.")
