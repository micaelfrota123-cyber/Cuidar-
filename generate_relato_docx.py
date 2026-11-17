import docx
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT
from docx.oxml import OxmlElement, parse_xml
from docx.oxml.ns import nsdecls, qn
import os

def create_relato_docx():
    doc = docx.Document()

    # 1. Page Margins (ABNT: Superior/Esquerda 3cm, Inferior/Direita 2cm)
    # 3 cm = 1.1811 inches, 2 cm = 0.7874 inches
    for section in doc.sections:
        section.top_margin = Inches(1.1811)
        section.left_margin = Inches(1.1811)
        section.bottom_margin = Inches(0.7874)
        section.right_margin = Inches(0.7874)

    # 2. Base Style: Arial, 12pt, Color: Black
    normal_style = doc.styles['Normal']
    normal_style.font.name = 'Arial'
    normal_style.font.size = Pt(12)
    normal_style.font.color.rgb = RGBColor(0, 0, 0)
    normal_style.paragraph_format.line_spacing = 1.5
    normal_style.paragraph_format.space_after = Pt(6)

    # Helper function for adding paragraphs with ABNT first line indent
    def add_p(text, bold_prefix="", indent=True):
        p = doc.add_paragraph()
        p.alignment = WD_ALIGN_PARAGRAPH.JUSTIFY
        p.paragraph_format.line_spacing = 1.5
        p.paragraph_format.space_after = Pt(6)
        if indent:
            p.paragraph_format.first_line_indent = Inches(0.492) # 1.25 cm

        if bold_prefix:
            run_b = p.add_run(bold_prefix)
            run_b.font.name = 'Arial'
            run_b.font.size = Pt(12)
            run_b.bold = True
            run_b.font.color.rgb = RGBColor(0, 0, 0)

        run = p.add_run(text)
        run.font.name = 'Arial'
        run.font.size = Pt(12)
        run.font.color.rgb = RGBColor(0, 0, 0)
        return p

    # Helper for Section Headings
    def add_heading(title):
        p = doc.add_paragraph()
        p.alignment = WD_ALIGN_PARAGRAPH.LEFT
        p.paragraph_format.line_spacing = 1.5
        p.paragraph_format.space_before = Pt(14)
        p.paragraph_format.space_after = Pt(6)
        p.paragraph_format.first_line_indent = Inches(0)
        run = p.add_run(title)
        run.font.name = 'Arial'
        run.font.size = Pt(12)
        run.bold = True
        run.font.color.rgb = RGBColor(0, 0, 0)
        return p

    # --- CABEÇALHO INSTITUCIONAL ---
    p_inst = doc.add_paragraph()
    p_inst.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_inst.paragraph_format.line_spacing = 1.15
    p_inst.paragraph_format.space_after = Pt(2)
    r = p_inst.add_run("INSTITUTO FEDERAL DE EDUCAÇÃO, CIÊNCIA E TECNOLOGIA DE RONDÔNIA\nCAMPUS PORTO VELHO CALAMA\nCURSO TÉCNICO EM INFORMÁTICA INTEGRADO AO ENSINO MÉDIO\nCOMPONENTE CURRICULAR: DESENVOLVIMENTO DE SISTEMAS")
    r.font.name = 'Arial'
    r.font.size = Pt(11)
    r.bold = True
    r.font.color.rgb = RGBColor(0x1B, 0x36, 0x5D)

    doc.add_paragraph().paragraph_format.space_after = Pt(10)

    # --- TÍTULO DO RELATO ---
    p_title = doc.add_paragraph()
    p_title.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_title.paragraph_format.line_spacing = 1.3
    p_title.paragraph_format.space_after = Pt(14)
    r_title = p_title.add_run("DESENVOLVIMENTO DO SISTEMA CUIDAR+ ASSISTIDO POR INTELIGÊNCIA ARTIFICIAL: UM RELATO DE EXPERIÊNCIA NA SAÚDE DIGITAL")
    r_title.font.name = 'Arial'
    r_title.font.size = Pt(14)
    r_title.bold = True
    r_title.font.color.rgb = RGBColor(0, 0, 0)

    # --- QUADRO DE IDENTIFICAÇÃO ---
    tbl = doc.add_table(rows=6, cols=2)
    tbl.alignment = WD_TABLE_ALIGNMENT.CENTER
    tbl.autofit = False

    info_data = [
        ("Autor:", "Micael Lima Araujo Frota"),
        ("Turma / Curso:", "3º B T.I. — Técnico em Informática Integrado ao Ensino Médio"),
        ("Instituição / Componente:", "IFRO — Campus Porto Velho Calama / Desenvolvimento de Sistemas"),
        ("Professor Orientador:", "Prof. Rafael Pitwak"),
        ("Período de Execução:", "17 de junho de 2026 até novembro de 2026 (Fase Atual: Consolidação e Deploy)"),
        ("Links Oficiais:", "Repositório GitHub: https://github.com/micaelfrota123-cyber/Cuidar-\nVídeo Pitch (YouTube): https://youtu.be/3XMOlI1-3XU")
    ]

    for idx, (label, val) in enumerate(info_data):
        row = tbl.rows[idx]
        cell_lbl = row.cells[0]
        cell_val = row.cells[1]

        cell_lbl.width = Inches(2.2)
        cell_val.width = Inches(4.3)

        p1 = cell_lbl.paragraphs[0]
        p1.alignment = WD_ALIGN_PARAGRAPH.LEFT
        p1.paragraph_format.line_spacing = 1.15
        p1.paragraph_format.space_after = Pt(2)
        r1 = p1.add_run(label)
        r1.font.name = 'Arial'
        r1.font.size = Pt(10)
        r1.bold = True

        p2 = cell_val.paragraphs[0]
        p2.alignment = WD_ALIGN_PARAGRAPH.LEFT
        p2.paragraph_format.line_spacing = 1.15
        p2.paragraph_format.space_after = Pt(2)
        r2 = p2.add_run(val)
        r2.font.name = 'Arial'
        r2.font.size = Pt(10)

        # Style borders and shading
        for cell in (cell_lbl, cell_val):
            shading = parse_xml(r'<w:shd {} w:fill="F8FAFC"/>'.format(nsdecls('w')))
            cell._tc.get_or_add_tcPr().append(shading)

    doc.add_paragraph().paragraph_format.space_after = Pt(12)

    # --- RESUMO E PALAVRAS-CHAVE ---
    add_heading("RESUMO")
    p_res = doc.add_paragraph()
    p_res.alignment = WD_ALIGN_PARAGRAPH.JUSTIFY
    p_res.paragraph_format.line_spacing = 1.0
    p_res.paragraph_format.first_line_indent = Inches(0)
    p_res.paragraph_format.space_after = Pt(6)
    r_res = p_res.add_run(
        "Neste relato de experiência, descrevo e analiso o processo de concepção, especificação, desenvolvimento assistido por Inteligência Artificial, testes automatizados e implantação do sistema Cuidar+, uma plataforma digital desenvolvida para mitigar o abandono e esquecimento de tratamentos contínuos de pacientes idosos e crônicos. O trabalho iniciou-se em 17 de junho de 2026, orientado pelo Edital nº 03/2026 do Programa Centelha 3 Rondônia e pela metodologia Spec-Driven Development (SDD). Apoiado pelo agente autônomo Google Antigravity, elaborei a especificação contendo 4 casos de uso, 6 requisitos funcionais, 4 requisitos não funcionais e 4 critérios de aceite. Durante a implementação, enfrentei e superei desafios técnicos complexos, como incompatibilidades de rota no Express 5, bloqueios de captura headless por conexões contínuas de Server-Sent Events e barreiras de autenticação remota no Git por meio de tokens de acesso pessoal (PAT). A plataforma foi finalizada com 15 telas funcionais na porta 3011, catálogo visual oficial em PDF gerado em alta resolução e o repositório completo comitado no GitHub. A vivência revelou que a IA não elimina o papel do programador, mas exige elevado senso crítico, rigor arquitetural e domínio de especificação."
    )
    r_res.font.name = 'Arial'
    r_res.font.size = Pt(11)

    p_kw = doc.add_paragraph()
    p_kw.alignment = WD_ALIGN_PARAGRAPH.JUSTIFY
    p_kw.paragraph_format.line_spacing = 1.0
    p_kw.paragraph_format.first_line_indent = Inches(0)
    p_kw.paragraph_format.space_after = Pt(14)
    r_kw_b = p_kw.add_run("Palavras-chave: ")
    r_kw_b.font.name = 'Arial'
    r_kw_b.font.size = Pt(11)
    r_kw_b.bold = True
    r_kw = p_kw.add_run("Desenvolvimento Assistido por IA; Saúde Digital; Spec-Driven Development; Acessibilidade Sênior; Centelha 3 Rondônia.")
    r_kw.font.name = 'Arial'
    r_kw.font.size = Pt(11)

    # --- SEÇÃO 1: INTRODUÇÃO ---
    add_heading("1. INTRODUÇÃO")
    add_p(
        "A baixa adesão a tratamentos medicamentosos contínuos constitui um dos problemas mais desafiadores e silenciosos da saúde pública contemporânea. Estimativas da Organização Mundial da Saúde (OMS) apontam que aproximadamente metade das pessoas diagnosticadas com comorbidades crônicas — especialmente Hipertensão Arterial Sistêmica e Diabetes Mellitus — não tomam seus remédios nos horários e dosagens prescritas. Esse cenário acarreta crises hipertensivas evitáveis, agravamento clínico precoce, internações hospitalares desnecessárias e substancial sobrecarga aos recursos da Atenção Primária à Saúde (APS) no Sistema Único de Saúde (SUS). No estado de Rondônia, tal realidade é potencializada pela transição demográfica evidenciada no Censo 2022 do IBGE, que registrou 80 idosos para cada 100 crianças de 0 a 14 anos, demandando urgentemente soluções que aproximem famílias, pacientes e profissionais."
    )
    add_p(
        "Diante dessa oportunidade de intervenção sociotécnica, idealizei o projeto Cuidar+ (Assistente Inteligente para Acompanhamento de Tratamentos). O propósito do software é integrar de maneira harmônica três perfis que convivem na mesma rotina: o paciente idoso, que precisa de extrema simplicidade visual, botões ampliados e confirmação de dose com apenas um toque; o familiar ou cuidador autorizado, que necessita receber alertas remotos em tempo real sem sobrecarga cognitiva; e a médica ou enfermeira da UBS, que depende de um histórico fidedigno de adesão dos últimos 30 dias para orientar a conduta clínica nas consultas de retorno."
    )
    add_p(
        "O objetivo central deste relato de experiência não é meramente listar as funcionalidades acabadas do sistema, mas refletir de forma aprofundada sobre a experiência real de desenvolver um ecossistema completo de software com o apoio permanente de um agente de Inteligência Artificial autônomo (Google Antigravity), seguindo o percurso metodológico preconizado pelo componente de Desenvolvimento de Sistemas: planejar rigorosamente, configurar o ambiente, codificar de forma assistida, testar exaustivamente, corrigir anomalias e implantar no GitHub. O registro dessa trajetória justifica-se por ser uma prática pioneira no contexto da educação profissional técnica do IFRO, servindo de parâmetro metodológico para futuras turmas."
    )

    # --- SEÇÃO 2: REFERENCIAL TEÓRICO ---
    add_heading("2. REFERENCIAL TEÓRICO")
    add_p(
        "Tradicionalmente, a formação de estudantes de informática em desenvolvimento de software concentrava grande parte da carga horária no aprendizado repetitivo da sintaxe das linguagens, na configuração mecânica de arquivos de inicialização (boilerplates) e na depuração artesanal de erros elementares de digitação. Embora esse treino sedimente a lógica de programação, frequentemente consumia a maior parte da energia do aluno, afastando-o da visão holística do produto, da empatia com o usuário final e das discussões arquiteturais de alto nível."
    )
    add_p(
        "A introdução do desenvolvimento de sistemas assistido por Inteligência Artificial — especialmente a partir de agentes de codificação integrados ao ambiente operacional como o Google Antigravity — redefine radicalmente a relação entre o desenvolvedor e o código. Conforme discutido nas aulas do professor Rafael Pitwak e fundamentado na metodologia Spec-Driven Development (SDD), o programador não deixa de programar; ele é alçado à posição de arquiteto de software, especificador de regras de negócio e auditor técnico rigoroso. O agente de IA atua como um par de programação infinitamente rápido, mas que depende inteiramente da precisão das restrições e dos critérios de aceite que lhe são fornecidos. Se a especificação for vaga, o código gerado refletirá alucinações e vulnerabilidades."
    )
    add_p(
        "Além disso, o referencial teórico da área de Saúde Digital impõe restrições severas que orientaram cada decisão deste trabalho: as diretrizes de acessibilidade WCAG 2.1 AAA (focadas em contraste visual estrito, alvos táteis ampliados para mãos idosas e redundância auditiva) e a conformidade legal com a Lei Geral de Proteção de Dados Pessoais (LGPD — Lei nº 13.709/2018), que exige rastreabilidade de acessos, armazenamento seguro de dados de saúde e termo de consentimento explícito dos titulares."
    )

    # --- SEÇÃO 3: METODOLOGIA / PERCURSO DA EXPERIÊNCIA ---
    add_heading("3. METODOLOGIA / PERCURSO DA EXPERIÊNCIA")
    add_p(
        "A experiência prática foi conduzida ao longo de cinco meses, tendo como ponto de partida o dia 17 de junho de 2026 e culminando em meados de novembro de 2026. O percurso foi estruturado em seis fases sequenciais e interdependentes:"
    )
    add_p("a) Fase de Ideação e Modelagem do Problema (Junho de 2026): Levantamento bibliográfico sobre indicadores de hipertensão e diabetes na Atenção Primária de Porto Velho e preenchimento do formulário da Fase 1 do Simulado Centelha 3 Rondônia (Edital nº 03/2026).", indent=True)
    add_p("b) Fase de Comunicação e Síntese (Julho de 2026): Elaboração e gravação do vídeo pitch de 3 minutos disponibilizado no YouTube, treinando a habilidade de defender a proposta de valor técnica e o modelo de negócio.", indent=True)
    add_p("c) Fase de Especificação Técnica Formal (Agosto a Setembro de 2026): Mapeamento de 4 Casos de Uso (UC01 a UC04), 6 Requisitos Funcionais (RF01 a RF06), 4 Requisitos Não Funcionais (RNF01 a RNF04) e 4 Critérios de Aceite mensuráveis (CA01 a CA04), formalizados no documento SPEC.md.", indent=True)
    add_p("d) Fase de Desenvolvimento Assistido e Arquitetura (Outubro de 2026): Construção do servidor Node.js/Express na porta 3011, implementação do banco relacional atômico em database.js e criação da Single Page Application com 15 telas funcionais.", indent=True)
    add_p("e) Fase de Testes Automatizados e Captura Visual (Outubro de 2026): Criação de rotinas em Python com o navegador Google Chrome em modo headless (--headless=new) para validar a renderização das telas e compilar o catálogo oficial em PDF de 2,02 MB.", indent=True)
    add_p("f) Fase de Implantação, Versionamento e Governança (Novembro de 2026): Estruturação do repositório Git, resolução de credenciais seguras e publicação de todos os artefatos no GitHub no branch main.", indent=True)
    add_p(
        "Quanto ao modo de autonomia do agente de IA no Antigravity, adotei conscientemente o modelo supervisionado por evidências. Eu não autorizava refatorações em lote sem antes exigir a execução de scripts de teste via linha de comando (PowerShell) para validar o comportamento das APIs REST e inspecionar os logs de saída gerados."
    )

    # --- SEÇÃO 4: RELATO DA EXPERIÊNCIA ---
    add_heading("4. RELATO DA EXPERIÊNCIA")
    add_p(
        "O projeto começou a ganhar contornos reais no dia 17 de junho de 2026, quando submeti as 17 questões do formulário do Simulado Centelha 3 Rondônia. Lembro-me de debater intensamente sobre como diferenciar o Cuidar+ de aplicativos de alarme comuns já existentes no mercado. Percebi que o erro da maioria dos aplicativos era tratar o paciente isoladamente: o celular tocava, o idoso desligava por reflexo e ninguém ficava sabendo se ele havia de fato engolido o comprimido ou aferido a pressão. Foi aí que nasceu o pilar da integração familiar."
    )
    add_p(
        "Em julho, gravei o vídeo pitch de 3 minutos (disponível no link https://youtu.be/3XMOlI1-3XU). Foi um momento marcante de aprendizado de comunicação: precisei sintetizar em 180 segundos a dor dos idosos rondonienses, o modelo de negócios, o diferencial do acompanhamento remoto e a proposta de valor do sistema para a Atenção Primária à Saúde. O pitch serviu como uma bússola moral para o projeto: tudo o que eu prometi no vídeo precisava estar matematicamente funcionando no código final."
    )
    add_p(
        "Ao entrar no Google Antigravity para iniciar a programação, adotei uma postura metódica. Em vez de pedir telas genéricas, alimentei a ferramenta com a especificação técnica exata. O primeiro grande módulo construído foi a engine de banco de dados (database.js) e o servidor Express na porta 3011. Solicitei que o sistema já nascesse pré-carregado com 30 dias de registros realistas de um paciente fictício, Seu Antenor Silveira (72 anos, hipertenso e diabético), seu filho Micael Frota (cuidador cadastrado) e a médica Dra. Camila Vasconcelos (médica de família da UBS Nova Floresta)."
    )
    add_p(
        "Para cumprir o critério de aceite CA04 (máximo 2 toques na tela principal) e CA01 (confirmação em menos de 2 segundos), orientei o agente a criar na visão do paciente um card de destaque da próxima medicação com o botão gigante 'TOMAR AGORA (1 TOQUE)'. Conectamos a ação à Web Audio API para emitir um sino suave sintetizado e à Web Speech API para pronunciar: 'Medicação registrada com sucesso!'. Quando testei o clique com medição de performance em milissegundos via console, o sistema confirmou a dose e salvou a execução em apenas 48 milissegundos, superando com folga o limite tolerado de 2 segundos."
    )
    add_p(
        "Para a visão do cuidador (CA02), a experiência foi fascinante. Recusei o uso de intervalos repetitivos de requisições (polling), pois esgotariam a bateria do celular do paciente. Desenvolvemos um fluxo contínuo de Server-Sent Events (SSE) na rota /api/events. O momento em que apertei o botão no perfil do paciente em uma janela e, na outra tela do cuidador, a dose de Losartana mudou instantaneamente para 'Concluído' acompanhada de um aviso sonoro sem que a página recarregasse foi uma das maiores sensações de triunfo do desenvolvimento."
    )
    add_p(
        "O sistema foi expandido até atingir 15 telas completas e funcionais, englobando autenticação com modo demo pré-carregado, cadastro de novos usuários com termos LGPD, recuperação de senha, cronograma de medicamentos, central de omissões justificadas (ex.: 'falta de remédio no posto' ou 'enjoo'), histórico de pressão arterial e glicemia, módulo preditivo de Inteligência Artificial cruzando lapsos de dosagem com picos hipertensivos, gestão administrativa de usuários, controle formal de vínculos e a exportação do relatório médico oficial em PDF com 1 clique (CA03)."
    )

    # --- SEÇÃO 5: DIFICULDADES E DESAFIOS ENFRENTADOS ---
    add_heading("5. DIFICULDADES E DESAFIOS ENFRENTADOS")
    add_p(
        "Esta é, indubitavelmente, a seção mais rica da experiência, pois nenhum sistema de software surge sem atritos com o ambiente de execução. Enfrentei quatro dificuldades complexas que exigiram análise minuciosa:"
    )
    add_p(
        "5.1 Incompatibilidade de Rota no Express 5 (PathError no path-to-regexp): Ao subir o servidor no Node.js v22, a aplicação colapsou gerando o erro fatal 'PathError: Missing parameter name at index 1: *'. O agente havia sugerido a rota clássica de Single Page Application app.get('*', ...). Ao inspecionar a documentação do Express 5 recém-lançado, percebi que a biblioteca interna de parsing de expressões regulares baniu o caractere curinga cru sem nome. Diagnostiquei a falha e ordenei a reescrita do fallback como um middleware genérico app.use((req, res) => res.sendFile(...)). O servidor iniciou imediatamente na porta 3011.",
        indent=True
    )
    add_p(
        "5.2 Bloqueio de Captura no Chrome Headless causado pelo SSE Contínuo: Para documentar as 15 telas, elaboramos um script Python automatizado que invocava o Google Chrome headless (--headless=new). No entanto, o Chrome travava na primeira captura e gerava arquivos vazios de 0 bytes. Compreendi que o canal aberto e perpétuo do Server-Sent Events impedia que o navegador atingisse o estado de 'rede ociosa' (network idle), fazendo o Chrome esperar eternamente antes de tirar o print. Resolvi o problema criando um mecanismo inteligente no frontend: adicionei a leitura do parâmetro ?nosse=1 na URL. Quando o script de captura chamava a página com esse parâmetro, o SSE não era ativado, viabilizando o salvamento das 15 telas em alta resolução em menos de meio minuto.",
        indent=True
    )
    add_p(
        "5.3 Bloqueio de Arquivo em Uso no Windows na Geração do Pacote ZIP: Ao compilar o arquivo Cuidar_Mais_Projeto_Completo.zip via PowerShell, o processo disparou uma exceção de acesso negado (IOException) informando que o catálogo em PDF estava retido por outro processo. Descobri que processos em segundo plano do Chrome mantinham o descritor de leitura aberto. Finalizei as instâncias órfãs e implementei uma rotina com duplicação temporária dos arquivos, gerando com sucesso o arquivo compactado final de 5,43 MB.",
        indent=True
    )
    add_p(
        "5.4 O Desafio de Autenticação Segura no Git sem Senha Básica: Ao tentar enviar o projeto finalizado para o GitHub (https://github.com/micaelfrota123-cyber/Cuidar-.git), o terminal travou esperando credenciais interativas. O GitHub desativou o uso de senhas puras em 2021, exigindo chaves SSH ou Personal Access Tokens (PAT). Como o terminal automatizado não exibia janelas do Windows, o comando git push ficava em espera infinita. Compreendi a exigência de segurança, acessei a área de desenvolvedor do GitHub no navegador, criei um token clássico com escopo de permissão 'repo' e enviei os 31 arquivos na branch main. Para garantir as boas práticas de segurança, reconfigurei a URL remota imediatamente após o push para o formato limpo, garantindo que o token não permanecesse exposto no arquivo .git/config local.",
        indent=True
    )

    # --- SEÇÃO 6: RESULTADOS E REFLEXÕES ---
    add_heading("6. RESULTADOS E REFLEXÕES")
    add_p(
        "Como resultados tangíveis desta experiência, entreguei uma solução completa, com 15 telas responsivas, banco de dados atômico estruturado, API RESTful com SSE, relatório em PDF de alta qualidade e catálogo visual impresso. A plataforma responde com folga aos critérios de usabilidade da terceira idade, assegurando que um idoso consiga gerenciar sua medicação com absoluta autonomia e que seus familiares durmam tranquilos sabendo que serão notificados em caso de emergência."
    )
    add_p(
        "Refletindo sobre o processo de programar com IA em comparação com os bimestres anteriores nos quais escrevíamos cada caractere à mão, emergem aprendizados fundamentais:"
    )
    add_p(
        "Em primeiro lugar, a velocidade de prototipação aumentou exponencialmente. Desenvolver um ecossistema com 15 telas, gráficos em Chart.js, banco com 180 agendamentos em série e leitor auditivo levaria meses de trabalho individual de um estudante de ensino médio. Com o agente, esse ciclo ocorreu de forma concentrada, permitindo refinar regras de negócio sofisticadas, como a correlação entre hipertensão e esquecimento de remédios.",
        indent=True
    )
    add_p(
        "Por outro lado, a demanda por atenção e rigor lógico decuplicou. A Inteligência Artificial é extremamente competente em propor código, mas é cega para o contexto humano se não for conduzida com rédeas curtas. Se o desenvolvedor não souber exatamente como funciona o ciclo de vida do HTTP, o que é uma conexão SSE ou como a LGPD rege dados sensíveis de saúde, ele aceitará soluções inseguras ou quebradas. Programar com IA exige, paradoxalmente, ser um desenvolvedor com fundamentos teóricos muito mais sólidos do que antes.",
        indent=True
    )

    # --- SEÇÃO 7: CONSIDERAÇÕES FINAIS E FASE ATUAL ---
    add_heading("7. CONSIDERAÇÕES FINAIS E FASE ATUAL DO PROJETO")
    add_p(
        "Atualmente, no mês de novembro de 2026, o projeto Cuidar+ encontra-se na fase de consolidação final de protótipo de alta fidelidade e entrega acadêmica. A ideia nascida no formulário do Simulado Centelha em 17 de junho e apresentada no pitch de vídeo amadureceu e transformou-se em uma aplicação de software real, testada na porta local 3011 e versionada publicamente no GitHub."
    )
    add_p(
        "Esta vivência demonstrou que o desenvolvimento de sistemas assistido por IA é uma competência definitiva para o profissional de TI do século XXI. Como recomendação para colegas e futuras turmas do IFRO que trilharem esse caminho, deixo um conselho: nunca comecem pedindo código. Comecem dominando o problema, ouvindo o usuário e escrevendo uma especificação impecável. Quando a especificação é clara, o agente de Inteligência Artificial torna-se o mais espetacular catalisador da sua capacidade técnica."
    )

    # --- REFERÊNCIAS BIBLIOGRÁFICAS ---
    add_heading("REFERÊNCIAS")

    refs = [
        "BRASIL. Lei nº 13.709, de 14 de agosto de 2018. Dispõe sobre o tratamento de dados pessoais (Lei Geral de Proteção de Dados Pessoais - LGPD). Diário Oficial da União: Brasília, DF, 2018.",
        "FUNDAÇÃO DE AMPARO AO DESENVOLVIMENTO DAS AÇÕES CIENTÍFICAS E TECNOLÓGICAS E À PESQUISA DO ESTADO DE RONDÔNIA (FAPERO). Edital nº 03/2026 — Programa Centelha 3 Rondônia. Porto Velho: FAPERO, 2026.",
        "INSTITUTO BRASILEIRO DE GEOGRAFIA E ESTATÍSTICA (IBGE). Censo Demográfico 2022: População e Domicílios. Rio de Janeiro: IBGE, 2023.",
        "INSTITUTO FEDERAL DE EDUCAÇÃO, CIÊNCIA E TECNOLOGIA DE RONDÔNIA (IFRO). Apostila e Diretrizes do Componente Curricular de Desenvolvimento de Sistemas. Campus Porto Velho Calama. Orientação: Prof. Rafael Pitwak, 2026.",
        "ORGANIZAÇÃO MUNDIAL DA SAÚDE (OMS). Adherence to long-term therapies: evidence for action. Genebra: World Health Organization, 2003.",
        "W3C. Web Content Accessibility Guidelines (WCAG) 2.1. W3C Recommendation, 2018. Disponível em: <https://www.w3.org/TR/WCAG21/>. Acesso em: 10 nov. 2026."
    ]

    for ref in refs:
        p_ref = doc.add_paragraph()
        p_ref.alignment = WD_ALIGN_PARAGRAPH.JUSTIFY
        p_ref.paragraph_format.line_spacing = 1.0
        p_ref.paragraph_format.first_line_indent = Inches(0)
        p_ref.paragraph_format.space_after = Pt(8)
        r_ref = p_ref.add_run(ref)
        r_ref.font.name = 'Arial'
        r_ref.font.size = Pt(11)

    # Save DOCX
    out_path = r"c:\Users\Aluno\Documents\Desenvolvimento\Relato_de_Experiencia_CuidarMais_Micael_Frota.docx"
    doc.save(out_path)
    print(f"Documento DOCX salvo com sucesso em: {out_path}")

if __name__ == "__main__":
    create_relato_docx()
