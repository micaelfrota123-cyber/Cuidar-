const express = require('express');
const cors = require('cors');
const path = require('path');
const db = require('./database');

const app = express();
const PORT = 3011;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Server-Sent Events (SSE) clients for real-time updates (CA02)
const sseClients = new Set();

function broadcastEvent(type, data) {
  const payload = `event: ${type}\ndata: ${JSON.stringify(data)}\n\n`;
  for (const res of sseClients) {
    try {
      res.write(payload);
    } catch (e) {
      sseClients.delete(res);
    }
  }
}

// SSE Endpoint
app.get('/api/events', (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders();

  sseClients.add(res);

  // Send initial ping
  res.write(`event: connected\ndata: ${JSON.stringify({ status: 'online', time: new Date().toISOString() })}\n\n`);

  req.on('close', () => {
    sseClients.delete(res);
  });
});

// Periodic check for delayed schedules (every 30 seconds)
setInterval(() => {
  const now = new Date();
  const currentHours = now.getHours();
  const currentMinutes = now.getMinutes();
  const nowTime = `${String(currentHours).padStart(2, '0')}:${String(currentMinutes).padStart(2, '0')}`;
  const todayStr = now.toISOString().split('T')[0];

  const todaySchedules = db.getSchedules('usr_1', todayStr);
  let changed = false;

  todaySchedules.forEach(ag => {
    if (ag.status === 'pendente') {
      const [h, m] = ag.hora.split(':').map(Number);
      const scheduleTotalMin = h * 60 + m;
      const currentTotalMin = currentHours * 60 + currentMinutes;

      // If delayed by more than 30 minutes, mark as delayed and notify caregiver
      if (currentTotalMin - scheduleTotalMin > 30) {
        ag.status = 'atrasado';
        changed = true;
        if (ag.critico) {
          db.addNotification({
            id_destinatario: 'usr_2',
            tipo: 'alerta_critico',
            titulo: '⏰ Dose Atrasada!',
            mensagem: `A medicação "${ag.descricao_item}" prevista para às ${ag.hora} ainda não foi confirmada.`,
            horario: now.toISOString()
          });
        }
      }
    }
  });

  if (changed) {
    db.save();
    broadcastEvent('schedule_update', { message: 'Atualização de status de agendamentos' });
  }
}, 30000);

// --- REST API Endpoints ---

// 0. Autenticação & Recuperação de Senha (RF01)
app.post('/api/auth/login', (req, res) => {
  const { email, senha } = req.body;
  if (!email) {
    return res.status(400).json({ success: false, error: 'E-mail é obrigatório.' });
  }

  const user = db.authenticate(email, senha);
  if (!user) {
    return res.status(401).json({ success: false, error: 'Credenciais inválidas. Verifique o e-mail ou use o acesso de teste.' });
  }

  res.json({
    success: true,
    message: 'Autenticação realizada com sucesso!',
    token: `jwt_${Date.now()}_cuidarmais`,
    user
  });
});

app.post('/api/auth/register', (req, res) => {
  try {
    const { nome, email, senha, tipo_usuario, data_nascimento, telefone, condicoes, papel_descricao, registro_profissional, especialidade } = req.body;
    if (!nome || !email) {
      return res.status(400).json({ success: false, error: 'Nome e e-mail são obrigatórios.' });
    }

    const newUser = db.registerUser({
      nome,
      email,
      senha,
      tipo_usuario,
      data_nascimento,
      telefone,
      condicoes: Array.isArray(condicoes) ? condicoes : (condicoes ? [condicoes] : []),
      papel_descricao,
      registro_profissional,
      especialidade
    });

    broadcastEvent('user_registered', { id_usuario: newUser.id_usuario, nome: newUser.nome });
    res.status(201).json({
      success: true,
      message: 'Conta criada com sucesso!',
      user: newUser
    });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

app.post('/api/auth/recover', (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ success: false, error: 'E-mail é obrigatório para recuperação.' });
  }

  const result = db.requestPasswordReset(email);
  res.json({
    success: true,
    message: result.found 
      ? `Link de redefinição de senha enviado com sucesso para ${email}. Verifique sua caixa de entrada.`
      : `Se o e-mail estiver cadastrado, as instruções serão enviadas em instantes.`,
    token: result.token
  });
});

// Admin: Gerenciamento Geral
app.get('/api/admin/users', (req, res) => {
  res.json({ success: true, data: db.getUsers() });
});

app.delete('/api/admin/users/:id', (req, res) => {
  const ok = db.deleteUser(req.params.id);
  if (!ok) return res.status(404).json({ success: false, error: 'Usuário não encontrado' });
  broadcastEvent('user_deleted', { id: req.params.id });
  res.json({ success: true, message: 'Usuário removido da base de dados' });
});

app.get('/api/admin/vinculos', (req, res) => {
  res.json({ success: true, data: db.data.vinculos });
});

app.post('/api/admin/vinculos', (req, res) => {
  const { id_paciente, id_cuidador, parentesco, permissao_nivel } = req.body;
  if (!id_paciente || !id_cuidador) {
    return res.status(400).json({ success: false, error: 'Paciente e cuidador são obrigatórios' });
  }
  const vinculo = db.addVinculo({ id_paciente, id_cuidador, parentesco, permissao_nivel });
  broadcastEvent('vinculo_created', vinculo);
  res.status(201).json({ success: true, data: vinculo });
});

app.delete('/api/admin/vinculos/:id', (req, res) => {
  const ok = db.deleteVinculo(req.params.id);
  if (!ok) return res.status(404).json({ success: false, error: 'Vínculo não encontrado' });
  broadcastEvent('vinculo_deleted', { id: req.params.id });
  res.json({ success: true, message: 'Vínculo desativado com sucesso' });
});

app.get('/api/admin/lgpd-logs', (req, res) => {
  res.json({ success: true, data: db.getLgpdLogs() });
});

// 1. Users
app.get('/api/users', (req, res) => {
  res.json({ success: true, data: db.getUsers() });
});

app.get('/api/users/:id', (req, res) => {
  const user = db.getUserById(req.params.id);
  if (!user) return res.status(404).json({ success: false, error: 'Usuário não encontrado' });
  res.json({ success: true, data: user });
});

app.put('/api/users/:id/preferences', (req, res) => {
  const updated = db.updateUserPreferences(req.params.id, req.body);
  if (!updated) return res.status(404).json({ success: false, error: 'Usuário não encontrado' });
  broadcastEvent('preferences_updated', { userId: req.params.id, preferencias: updated.preferencias });
  res.json({ success: true, data: updated });
});

// 2. Items of Care (RF02)
app.get('/api/items', (req, res) => {
  const { userId } = req.query;
  const items = db.getItems(userId);
  res.json({ success: true, data: items });
});

app.post('/api/items', (req, res) => {
  try {
    const { id_usuario, tipo_item, descricao, dosagem, frequencia, horarios, instrucoes, critico, cor, icone } = req.body;
    if (!descricao || !tipo_item) {
      return res.status(400).json({ success: false, error: 'Campos obrigatórios ausentes.' });
    }
    const item = db.createItem({
      id_usuario: id_usuario || 'usr_1',
      tipo_item,
      descricao,
      dosagem: dosagem || '1 dose',
      frequencia: frequencia || 'Diário',
      horarios: Array.isArray(horarios) && horarios.length ? horarios : ['08:00'],
      instrucoes: instrucoes || '',
      critico: critico !== undefined ? critico : true,
      cor: cor || '#3B82F6',
      icone: icone || (tipo_item === 'medicamento' ? 'pill' : tipo_item === 'medicao' ? 'heart-pulse' : 'calendar')
    });

    broadcastEvent('item_created', item);
    broadcastEvent('schedule_update', { message: 'Novo item cadastrado' });
    res.status(201).json({ success: true, data: item });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.put('/api/items/:id', (req, res) => {
  const updated = db.updateItem(req.params.id, req.body);
  if (!updated) return res.status(404).json({ success: false, error: 'Item não encontrado' });
  broadcastEvent('item_updated', updated);
  res.json({ success: true, data: updated });
});

app.delete('/api/items/:id', (req, res) => {
  const ok = db.deleteItem(req.params.id);
  if (!ok) return res.status(404).json({ success: false, error: 'Item não encontrado' });
  broadcastEvent('item_deleted', { id: req.params.id });
  res.json({ success: true, message: 'Item removido' });
});

// 3. Schedules (UC01, UC02)
app.get('/api/schedules/today', (req, res) => {
  const { userId } = req.query;
  const schedules = db.getTodaySchedules(userId || 'usr_1');
  res.json({ success: true, data: schedules });
});

app.get('/api/schedules', (req, res) => {
  const { userId, date } = req.query;
  const schedules = db.getSchedules(userId || 'usr_1', date);
  res.json({ success: true, data: schedules });
});

// Confirm task (CA01: response time < 2s; CA04: max 2 touches)
app.post('/api/schedules/:id/confirm', (req, res) => {
  const { confirmedBy, observacao } = req.body;
  const result = db.confirmSchedule(req.params.id, confirmedBy || 'paciente', observacao || 'Confirmado via aplicativo');
  if (!result) return res.status(404).json({ success: false, error: 'Agendamento não encontrado' });

  broadcastEvent('schedule_confirmed', {
    schedule: result.agendamento,
    execution: result.execucao
  });

  res.json({ success: true, data: result });
});

// Justify non-compliance (RF04)
app.post('/api/schedules/:id/justify', (req, res) => {
  const { motivo, confirmedBy } = req.body;
  if (!motivo) return res.status(400).json({ success: false, error: 'Informe a justificativa/motivo' });

  const result = db.justifySchedule(req.params.id, motivo, confirmedBy || 'paciente');
  if (!result) return res.status(404).json({ success: false, error: 'Agendamento não encontrado' });

  broadcastEvent('schedule_justified', {
    schedule: result.agendamento,
    execution: result.execucao
  });

  res.json({ success: true, data: result });
});

// 4. Health Metrics (RF02 / Medições: PA, Glicemia)
app.get('/api/metrics', (req, res) => {
  const { userId, tipo } = req.query;
  const metrics = db.getMetrics(userId || 'usr_1', tipo);
  res.json({ success: true, data: metrics });
});

app.post('/api/metrics', (req, res) => {
  const { id_usuario, tipo, valor, observacao, data_hora } = req.body;
  if (!tipo || !valor) {
    return res.status(400).json({ success: false, error: 'Tipo e valor da medição são obrigatórios' });
  }

  const metric = db.addMetric({
    id_usuario: id_usuario || 'usr_1',
    tipo,
    valor,
    observacao: observacao || '',
    data_hora: data_hora || new Date().toISOString()
  });

  broadcastEvent('metric_added', metric);
  res.status(201).json({ success: true, data: metric });
});

// 5. Caregiver Linkage & Notifications (RF05, CA02)
app.get('/api/caregivers/vinculos', (req, res) => {
  const { userId } = req.query;
  const vinculos = db.getVinculos(userId || 'usr_1');
  res.json({ success: true, data: vinculos });
});

app.get('/api/notifications', (req, res) => {
  const { userId } = req.query;
  const notifs = db.getNotifications(userId);
  res.json({ success: true, data: notifs });
});

app.post('/api/notifications/mark-read', (req, res) => {
  const { userId } = req.body;
  db.markNotificationsRead(userId || 'usr_2');
  res.json({ success: true });
});

// Cuidador envia alerta sonoro / lembrete remoto em tempo real para o idoso (CA02)
app.post('/api/notifications/nudge', (req, res) => {
  const { id_paciente, mensagem } = req.body;
  const notif = db.addNotification({
    id_destinatario: id_paciente || 'usr_1',
    tipo: 'alerta_cuidador_direto',
    titulo: '🔔 Lembrete do Cuidador Micael!',
    mensagem: mensagem || 'Seu Antenor, não se esqueça de tomar o seu remédio com água!',
    horario: new Date().toISOString()
  });

  broadcastEvent('patient_nudge', {
    pacienteId: id_paciente || 'usr_1',
    mensagem: mensagem || 'Seu Antenor, não se esqueça de tomar o seu remédio com água!'
  });

  res.json({ success: true, data: notif });
});

// 6. Reports & 30-Day Adherence (RF06, CA03, UC04)
app.get('/api/reports/adherence-30days', (req, res) => {
  const { userId } = req.query;
  const report = db.get30DayAdherenceReport(userId || 'usr_1');
  res.json({ success: true, data: report });
});

// 7. Intelligent AI Assistant Insights
app.get('/api/ai/insights', (req, res) => {
  const { userId } = req.query;
  const report = db.get30DayAdherenceReport(userId || 'usr_1');
  const metrics = db.getMetrics(userId || 'usr_1');

  // Rule-based clinical heuristic simulating AI Assistant for Cuidar+
  const rate = report.resumo.taxa_adesao_percentual;
  const pressaoElevadaCount = metrics.filter(m => m.tipo === 'pressao' && m.valor && (m.valor.sistolica >= 140 || m.valor.diastolica >= 90)).length;
  const glicemiaElevadaCount = metrics.filter(m => m.tipo === 'glicemia' && m.valor && m.valor.valor_mg_dl >= 130).length;

  const insights = [
    {
      categoria: 'Adesão Terapêutica',
      status: rate >= 90 ? 'positivo' : 'alerta',
      titulo: `Taxa de Adesão Global de ${rate}% nos últimos 30 dias`,
      descricao: rate >= 90
        ? 'Excelente engajamento ao plano medicamentoso. O paciente mantém consistência superior à média recomendada pela OMS.'
        : 'Adesão abaixo do ideal. Detectada necessidade de intervenção do cuidador ou ajuste de horários de rotina.'
    },
    {
      categoria: 'Correlação Clínica (IA Cuidar+)',
      status: pressaoElevadaCount > 2 ? 'alerta' : 'positivo',
      titulo: `${pressaoElevadaCount} episódios de pressão arterial limítrofe/elevada detectados`,
      descricao: pressaoElevadaCount > 0
        ? 'O modelo de correlação identificou que picos pressóricos coincidem com dias em que houve atraso ou justificativa na tomada da Losartana.'
        : 'Controle pressórico estável durante o período monitorado.'
    },
    {
      categoria: 'Padrão Comportamental de Horários',
      status: 'informativo',
      titulo: 'Maior índice de pontualidade no turno matutino (98%)',
      descricao: 'O paciente adere com facilidade aos remédios da manhã junto ao café. A dose do almoço (12:30) apresenta maior tempo de latência até a confirmação.'
    },
    {
      categoria: 'Sugestão para Consulta Médica',
      status: 'recomendacao',
      titulo: 'Recomendação para a Dra. Camila (APS)',
      descricao: `Apresentar o relatório de 30 dias na consulta do dia 25/10. O paciente relatou justificativa com ${report.justificativas.length} eventos (principalmente indisponibilidade no posto ou enjoo leve).`
    }
  ];

  res.json({
    success: true,
    data: {
      paciente: report.paciente.nome,
      data_analise: new Date().toISOString(),
      score_geral: rate,
      insights
    }
  });
});

// 8. Demo reset
app.post('/api/system/reset-demo', (req, res) => {
  db.resetSeed();
  broadcastEvent('system_reset', { message: 'Dados de demonstração restaurados' });
  res.json({ success: true, message: 'Dados restaurados com sucesso!' });
});

// Fallback route for SPA (Express 5 compatible)
app.use((req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start Server on PORT 3011
app.listen(PORT, '0.0.0.0', () => {
  console.log(`=======================================================`);
  console.log(`  SISTEMA CUIDAR+ — ASSISTENTE INTELIGENTE`);
  console.log(`  Edital Centelha 3 Rondônia - Micael Frota`);
  console.log(`  Servidor rodando com sucesso em: http://localhost:${PORT}`);
  console.log(`=======================================================`);
});
