-- =============================================================================
-- BANCO DE DADOS: CUIDAR+ (Assistente Inteligente para Tratamentos)
-- Edital Centelha 3 Rondônia / IFRO Calama - Prof. Rafael Pitwak
-- SGBD Recomendado: PostgreSQL 14+ / MySQL 8.0+ / SQLite 3
-- Arquivo: database/schema.sql
-- =============================================================================

-- 1. Criação do Banco de Dados (se aplicável ao ambiente local)
-- CREATE DATABASE cuidar_mais CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
-- \c cuidar_mais;

-- =============================================================================
-- TABELA 1: usuarios
-- Armazena os perfis de acesso: Paciente, Cuidador Familiar ou Profissional APS
-- =============================================================================
CREATE TABLE IF NOT EXISTS usuarios (
    id_usuario VARCHAR(50) PRIMARY KEY,
    nome VARCHAR(150) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    senha_hash VARCHAR(255) NOT NULL,
    tipo_usuario VARCHAR(30) NOT NULL CHECK (tipo_usuario IN ('paciente', 'cuidador', 'profissional', 'administrador')),
    data_nascimento DATE,
    telefone VARCHAR(30),
    cidade VARCHAR(100) DEFAULT 'Porto Velho - RO',
    condicoes TEXT, -- JSON ou lista separada por vírgulas: HAS, DM2, etc.
    alergias TEXT,
    contato_emergencia VARCHAR(255),
    papel_descricao VARCHAR(150),
    registro_profissional VARCHAR(80), -- CRM, COREN, RQE
    especialidade VARCHAR(150),
    preferencias_json TEXT, -- alto_contraste, tamanho_fonte, voz_sintetizada
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =============================================================================
-- TABELA 2: itens_cuidado
-- Itens cadastrados no plano terapêutico: remédios, medições, consultas e exames
-- =============================================================================
CREATE TABLE IF NOT EXISTS itens_cuidado (
    id_item VARCHAR(50) PRIMARY KEY,
    id_usuario VARCHAR(50) NOT NULL,
    tipo_item VARCHAR(30) NOT NULL CHECK (tipo_item IN ('medicamento', 'medicao', 'consulta', 'exame')),
    descricao VARCHAR(200) NOT NULL,
    dosagem VARCHAR(100),
    frequencia VARCHAR(100),
    horarios_json TEXT NOT NULL, -- Array JSON com horários previstos ['08:00', '12:30']
    instrucoes TEXT,
    critico BOOLEAN DEFAULT TRUE,
    cor VARCHAR(20) DEFAULT '#10B981',
    icone VARCHAR(50) DEFAULT 'pill',
    ativo BOOLEAN DEFAULT TRUE,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_item_usuario FOREIGN KEY (id_usuario) REFERENCES usuarios (id_usuario) ON DELETE CASCADE
);

-- =============================================================================
-- TABELA 3: agendamentos
-- Instâncias diárias de cada dose ou tarefa programada
-- =============================================================================
CREATE TABLE IF NOT EXISTS agendamentos (
    id_agendamento VARCHAR(50) PRIMARY KEY,
    id_item VARCHAR(50) NOT NULL,
    id_usuario VARCHAR(50) NOT NULL,
    descricao_item VARCHAR(200) NOT NULL,
    dosagem VARCHAR(100),
    tipo_item VARCHAR(30) NOT NULL,
    horario_previsto TIMESTAMP NOT NULL,
    data_prevista DATE NOT NULL,
    hora_prevista VARCHAR(10) NOT NULL,
    critico BOOLEAN DEFAULT TRUE,
    status VARCHAR(20) DEFAULT 'pendente' CHECK (status IN ('pendente', 'concluido', 'justificado', 'atrasado')),
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_agendamento_item FOREIGN KEY (id_item) REFERENCES itens_cuidado (id_item) ON DELETE CASCADE,
    CONSTRAINT fk_agendamento_usuario FOREIGN KEY (id_usuario) REFERENCES usuarios (id_usuario) ON DELETE CASCADE
);

-- =============================================================================
-- TABELA 4: registros_execucao
-- Registro de comprovação da tomada (CA01) ou justificativa de omissão (RF04)
-- =============================================================================
CREATE TABLE IF NOT EXISTS registros_execucao (
    id_registro VARCHAR(50) PRIMARY KEY,
    id_agendamento VARCHAR(50) NOT NULL UNIQUE,
    id_usuario VARCHAR(50) NOT NULL,
    horario_realizado TIMESTAMP NOT NULL,
    status_final VARCHAR(20) NOT NULL CHECK (status_final IN ('concluido', 'justificado')),
    observacao TEXT,
    confirmado_por VARCHAR(50) DEFAULT 'paciente',
    CONSTRAINT fk_execucao_agendamento FOREIGN KEY (id_agendamento) REFERENCES agendamentos (id_agendamento) ON DELETE CASCADE,
    CONSTRAINT fk_execucao_usuario FOREIGN KEY (id_usuario) REFERENCES usuarios (id_usuario) ON DELETE CASCADE
);

-- =============================================================================
-- TABELA 5: vinculos_cuidador
-- Mapeamento formal de permissão entre paciente e cuidadores (RF05)
-- =============================================================================
CREATE TABLE IF NOT EXISTS vinculos_cuidador (
    id_vinculo VARCHAR(50) PRIMARY KEY,
    id_paciente VARCHAR(50) NOT NULL,
    id_cuidador VARCHAR(50) NOT NULL,
    parentesco VARCHAR(100) NOT NULL,
    permissao_nivel VARCHAR(30) DEFAULT 'edicao_total' CHECK (permissao_nivel IN ('edicao_total', 'visualizacao')),
    ativo BOOLEAN DEFAULT TRUE,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_vinculo_paciente FOREIGN KEY (id_paciente) REFERENCES usuarios (id_usuario) ON DELETE CASCADE,
    CONSTRAINT fk_vinculo_cuidador FOREIGN KEY (id_cuidador) REFERENCES usuarios (id_usuario) ON DELETE CASCADE
);

-- =============================================================================
-- TABELA 6: medicoes_saude
-- Histórico clínico de aferições: Pressão Arterial e Glicemia Capilar (HGT)
-- =============================================================================
CREATE TABLE IF NOT EXISTS medicoes_saude (
    id_medicao VARCHAR(50) PRIMARY KEY,
    id_usuario VARCHAR(50) NOT NULL,
    tipo VARCHAR(30) NOT NULL CHECK (tipo IN ('pressao', 'glicemia')),
    valor_json TEXT NOT NULL, -- Ex: {"sistolica": 125, "diastolica": 82} ou {"valor_mg_dl": 108, "tipo": "jejum"}
    observacao VARCHAR(255),
    data_hora TIMESTAMP NOT NULL,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_medicao_usuario FOREIGN KEY (id_usuario) REFERENCES usuarios (id_usuario) ON DELETE CASCADE
);

-- =============================================================================
-- TABELA 7: notificacoes
-- Registro e fila de alertas sonoros, atrasos e chamados de emergência (RF03)
-- =============================================================================
CREATE TABLE IF NOT EXISTS notificacoes (
    id_notificacao VARCHAR(50) PRIMARY KEY,
    id_destinatario VARCHAR(50) NOT NULL,
    tipo VARCHAR(50) NOT NULL, -- sucesso, alerta_critico, lembrete, emergencia
    titulo VARCHAR(150) NOT NULL,
    mensagem TEXT NOT NULL,
    horario TIMESTAMP NOT NULL,
    lida BOOLEAN DEFAULT FALSE,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_notificacao_usuario FOREIGN KEY (id_destinatario) REFERENCES usuarios (id_usuario) ON DELETE CASCADE
);

-- =============================================================================
-- TABELA 8: lgpd_logs
-- Auditoria de rastreabilidade e proteção de dados sensíveis de saúde (RNF02)
-- =============================================================================
CREATE TABLE IF NOT EXISTS lgpd_logs (
    id_log VARCHAR(50) PRIMARY KEY,
    data_hora TIMESTAMP NOT NULL,
    acao VARCHAR(100) NOT NULL,
    id_usuario VARCHAR(50) NOT NULL,
    detalhes TEXT,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =============================================================================
-- CARGA DE DADOS INICIAIS (SEED DATA DE TESTE REALÍSTICO)
-- =============================================================================

-- Usuários
INSERT INTO usuarios (id_usuario, nome, email, senha_hash, tipo_usuario, data_nascimento, telefone, cidade, condicoes, alergias, contato_emergencia, preferencias_json)
VALUES 
('usr_1', 'Seu Antenor Silveira', 'antenor@cuidarmais.com.br', 'demo123', 'paciente', '1954-05-18', '(69) 99234-5678', 'Porto Velho - RO', 'Hipertensão Arterial Sistêmica, Diabetes Mellitus Tipo 2', 'Dipirona', 'Micael Frota (Filho) - (69) 98456-7890', '{"alto_contraste":false,"tamanho_fonte":"grande","alertas_sonoros":true,"voz_sintetizada":true}'),
('usr_2', 'Micael Lima Araujo Frota', 'micael@cuidarmais.com.br', 'demo123', 'cuidador', '2008-03-12', '(69) 98456-7890', 'Porto Velho - RO', NULL, NULL, NULL, NULL),
('usr_3', 'Dra. Camila Vasconcelos', 'dra.camila@saude.ro.gov.br', 'demo123', 'profissional', '1986-11-20', '(69) 99112-3344', 'Porto Velho - RO', NULL, NULL, NULL, NULL)
ON CONFLICT (id_usuario) DO NOTHING;

-- Vínculo Cuidador
INSERT INTO vinculos_cuidador (id_vinculo, id_paciente, id_cuidador, parentesco, permissao_nivel, ativo)
VALUES 
('vinc_1', 'usr_1', 'usr_2', 'Filho / Cuidador Principal', 'edicao_total', TRUE)
ON CONFLICT (id_vinculo) DO NOTHING;

-- Itens de Cuidado
INSERT INTO itens_cuidado (id_item, id_usuario, tipo_item, descricao, dosagem, frequencia, horarios_json, instrucoes, critico, cor, icone)
VALUES
('item_1', 'usr_1', 'medicamento', 'Losartana Potássica 50mg', '1 comprimido via oral', '1x ao dia (Manhã)', '["08:00"]', 'Tomar com água antes do café da manhã', TRUE, '#3B82F6', 'pill'),
('item_2', 'usr_1', 'medicamento', 'Metformina Cloridrato 850mg', '1 comprimido', '2x ao dia (Almoço e Jantar)', '["12:30", "19:30"]', 'Tomar logo após as refeições', TRUE, '#10B981', 'pill'),
('item_3', 'usr_1', 'medicamento', 'Anlodipino 5mg', '1 comprimido', '1x ao dia (Noite)', '["21:00"]', 'Tomar antes de dormir', FALSE, '#8B5CF6', 'pill'),
('item_4', 'usr_1', 'medicao', 'Aferição de Pressão Arterial', 'Sistólica / Diastólica', '2x ao dia', '["08:30", "18:00"]', 'Descansar 5 minutos sentado antes', TRUE, '#EF4444', 'heart-pulse'),
('item_5', 'usr_1', 'medicao', 'Glicemia Capilar (HGT)', 'Fitinha no glicosímetro', '1x ao dia em jejum', '["07:30"]', 'Aferir antes do desjejum', TRUE, '#F59E0B', 'droplet')
ON CONFLICT (id_item) DO NOTHING;

-- Auditoria LGPD
INSERT INTO lgpd_logs (id_log, data_hora, acao, id_usuario, detalhes)
VALUES
('log_1', CURRENT_TIMESTAMP, 'CONSENTIMENTO_INICIAL', 'usr_1', 'Consentimento formal para tratamento de dados sensíveis coletado.'),
('log_2', CURRENT_TIMESTAMP, 'VINCULO_AUTORIZADO', 'usr_1', 'Cuidador Micael Frota autorizado para acompanhamento em tempo real.')
ON CONFLICT (id_log) DO NOTHING;
