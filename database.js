const fs = require('fs');
const path = require('path');

const DB_FILE = path.join(__dirname, 'db.json');

// Helper to format date YYYY-MM-DD
function formatDate(d) {
  return d.toISOString().split('T')[0];
}

// Generate realistic 30-day historical seed data
function generateSeedData() {
  const today = new Date();
  const todayStr = formatDate(today);

  const users = [
    {
      id_usuario: 'usr_1',
      nome: 'Seu Antenor Silveira',
      email: 'antenor@cuidarmais.com.br',
      tipo_usuario: 'paciente',
      data_nascimento: '1954-05-18',
      telefone: '(69) 99234-5678',
      cidade: 'Porto Velho - RO',
      condicoes: ['Hipertensão Arterial Sistêmica', 'Diabetes Mellitus Tipo 2'],
      alergias: ['Dipirona'],
      contato_emergencia: 'Micael Frota (Filho) - (69) 98456-7890',
      preferencias: {
        alto_contraste: false,
        tamanho_fonte: 'grande', // 'normal', 'grande', 'extragrande'
        alertas_sonoros: true,
        voz_sintetizada: true
      }
    },
    {
      id_usuario: 'usr_2',
      nome: 'Micael Lima Araujo Frota',
      email: 'micael@cuidarmais.com.br',
      tipo_usuario: 'cuidador',
      data_nascimento: '2008-03-12',
      telefone: '(69) 98456-7890',
      cidade: 'Porto Velho - RO',
      papel_descricao: 'Filho e Cuidador Principal'
    },
    {
      id_usuario: 'usr_3',
      nome: 'Dra. Camila Vasconcelos',
      email: 'dra.camila@saude.ro.gov.br',
      tipo_usuario: 'profissional',
      data_nascimento: '1986-11-20',
      telefone: '(69) 99112-3344',
      registro_profissional: 'CRM-RO 4521 / RQE 1289',
      especialidade: 'Medicina de Família e Comunidade - APS UBS Nova Floresta'
    }
  ];

  const vinculos = [
    {
      id_vinculo: 'vinc_1',
      id_paciente: 'usr_1',
      id_cuidador: 'usr_2',
      parentesco: 'Filho / Cuidador Principal',
      permissao_nivel: 'edicao_total',
      ativo: true,
      criado_em: '2026-01-10T10:00:00'
    }
  ];

  const itens = [
    {
      id_item: 'item_1',
      id_usuario: 'usr_1',
      tipo_item: 'medicamento',
      descricao: 'Losartana Potássica 50mg',
      dosagem: '1 comprimido via oral',
      frequencia: '1x ao dia (Manhã)',
      horarios: ['08:00'],
      instrucoes: 'Tomar com água antes do café da manhã',
      critico: true,
      cor: '#3B82F6',
      icone: 'pill',
      ativo: true
    },
    {
      id_item: 'item_2',
      id_usuario: 'usr_1',
      tipo_item: 'medicamento',
      descricao: 'Metformina Cloridrato 850mg',
      dosagem: '1 comprimido',
      frequencia: '2x ao dia (Almoço e Jantar)',
      horarios: ['12:30', '19:30'],
      instrucoes: 'Tomar logo após as refeições para evitar desconforto gástrico',
      critico: true,
      cor: '#10B981',
      icone: 'pill',
      ativo: true
    },
    {
      id_item: 'item_3',
      id_usuario: 'usr_1',
      tipo_item: 'medicamento',
      descricao: 'Anlodipino 5mg',
      dosagem: '1 comprimido',
      frequencia: '1x ao dia (Noite)',
      horarios: ['21:00'],
      instrucoes: 'Tomar antes de dormir',
      critico: false,
      cor: '#8B5CF6',
      icone: 'pill',
      ativo: true
    },
    {
      id_item: 'item_4',
      id_usuario: 'usr_1',
      tipo_item: 'medicao',
      descricao: 'Aferição de Pressão Arterial',
      dosagem: 'Registrar Sistólica / Diastólica',
      frequencia: '2x ao dia',
      horarios: ['08:30', '18:00'],
      instrucoes: 'Descansar 5 minutos sentado antes de medir',
      critico: true,
      cor: '#EF4444',
      icone: 'heart-pulse',
      ativo: true
    },
    {
      id_item: 'item_5',
      id_usuario: 'usr_1',
      tipo_item: 'medicao',
      descricao: 'Glicemia Capilar (HGT)',
      dosagem: 'Medir com fitinha no glicosímetro',
      frequencia: '1x ao dia em jejum',
      horarios: ['07:30'],
      instrucoes: 'Anotar se foi jejum ou pós-refeição',
      critico: true,
      cor: '#F59E0B',
      icone: 'droplet',
      ativo: true
    },
    {
      id_item: 'item_6',
      id_usuario: 'usr_1',
      tipo_item: 'consulta',
      descricao: 'Consulta de Acompanhamento com Dra. Camila',
      dosagem: 'Apresentar resumo de adesão do Cuidar+',
      frequencia: 'Retorno mensal',
      horarios: ['09:30'],
      data_especifica: '2026-10-25',
      instrucoes: 'Levar cartão do SUS e exames de sangue',
      critico: true,
      cor: '#06B6D4',
      icone: 'calendar',
      ativo: true
    },
    {
      id_item: 'item_7',
      id_usuario: 'usr_1',
      tipo_item: 'exame',
      descricao: 'Hemoglobina Glicada (HbA1c) e Perfil Lipídico',
      dosagem: 'Coleta de sangue no posto',
      frequencia: 'Trimestral',
      horarios: ['07:00'],
      data_especifica: '2026-10-20',
      instrucoes: 'Jejum obrigatório de 10 a 12 horas',
      critico: true,
      cor: '#EC4899',
      icone: 'file-text',
      ativo: true
    }
  ];

  // Build schedules and executions for the past 30 days + today
  const agendamentos = [];
  const execucoes = [];
  const medicoes = [];

  let agendamentoIdCounter = 1;
  let execucaoIdCounter = 1;
  let medicaoIdCounter = 1;

  for (let i = 29; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dateStr = formatDate(d);
    const isToday = (i === 0);

    // Losartana 08:00
    const ag1Id = `ag_${agendamentoIdCounter++}`;
    let st1 = 'concluido';
    let just1 = null;
    // Simulate rare omission 3 days ago for realistic charts
    if (i === 3) {
      st1 = 'justificado';
      just1 = 'Falta do medicamento na farmácia do posto; Micael foi buscar à tarde';
    } else if (i === 12) {
      st1 = 'justificado';
      just1 = 'Paciente sentiu tontura leve e aguardou aferição médica';
    }

    // For today, let's keep morning concluded and afternoon/evening ready for real live testing!
    if (isToday) {
      st1 = 'concluido'; // Losartana taken this morning
    }

    agendamentos.push({
      id_agendamento: ag1Id,
      id_item: 'item_1',
      id_usuario: 'usr_1',
      descricao_item: 'Losartana Potássica 50mg',
      dosagem: '1 comprimido',
      tipo_item: 'medicamento',
      horario_previsto: `${dateStr}T08:00:00`,
      data: dateStr,
      hora: '08:00',
      critico: true,
      status: st1
    });

    if (st1 === 'concluido' || st1 === 'justificado') {
      execucoes.push({
        id_registro: `exec_${execucaoIdCounter++}`,
        id_agendamento: ag1Id,
        id_usuario: 'usr_1',
        horario_realizado: `${dateStr}T08:05:00`,
        status_final: st1,
        observacao: just1 || 'Tomado com água pontualmente',
        confirmado_por: 'paciente'
      });
    }

    // Glicemia 07:30
    const agGlicId = `ag_${agendamentoIdCounter++}`;
    agendamentos.push({
      id_agendamento: agGlicId,
      id_item: 'item_5',
      id_usuario: 'usr_1',
      descricao_item: 'Glicemia Capilar (HGT)',
      dosagem: 'Em jejum',
      tipo_item: 'medicao',
      horario_previsto: `${dateStr}T07:30:00`,
      data: dateStr,
      hora: '07:30',
      critico: true,
      status: 'concluido'
    });
    execucoes.push({
      id_registro: `exec_${execucaoIdCounter++}`,
      id_agendamento: agGlicId,
      id_usuario: 'usr_1',
      horario_realizado: `${dateStr}T07:32:00`,
      status_final: 'concluido',
      observacao: 'Medição em jejum',
      confirmado_por: 'paciente'
    });

    // Medição de glicose
    const glicValor = Math.floor(105 + Math.sin(i) * 18 + (i === 3 ? 35 : 0));
    medicoes.push({
      id_medicao: `med_${medicaoIdCounter++}`,
      id_usuario: 'usr_1',
      tipo: 'glicemia',
      valor: { valor_mg_dl: glicValor, tipo: 'jejum' },
      data_hora: `${dateStr}T07:32:00`,
      observacao: glicValor > 130 ? 'Leve elevação matinal' : 'Dentro da meta terapêutica'
    });

    // Pressão Matinal 08:30
    const agPaId = `ag_${agendamentoIdCounter++}`;
    agendamentos.push({
      id_agendamento: agPaId,
      id_item: 'item_4',
      id_usuario: 'usr_1',
      descricao_item: 'Aferição de Pressão Arterial',
      dosagem: 'Sentado em repouso',
      tipo_item: 'medicao',
      horario_previsto: `${dateStr}T08:30:00`,
      data: dateStr,
      hora: '08:30',
      critico: true,
      status: 'concluido'
    });
    execucoes.push({
      id_registro: `exec_${execucaoIdCounter++}`,
      id_agendamento: agPaId,
      id_usuario: 'usr_1',
      horario_realizado: `${dateStr}T08:31:00`,
      status_final: 'concluido',
      observacao: 'Aferido com aparelho de braço digital',
      confirmado_por: 'paciente'
    });

    // Medição de PA
    const sist = Math.floor(125 + Math.cos(i) * 10 + (i === 3 || i === 12 ? 22 : 0));
    const diast = Math.floor(82 + Math.sin(i) * 6 + (i === 3 || i === 12 ? 10 : 0));
    medicoes.push({
      id_medicao: `med_${medicaoIdCounter++}`,
      id_usuario: 'usr_1',
      tipo: 'pressao',
      valor: { sistolica: sist, diastolica: diast, pulso: 72 + Math.floor(Math.sin(i) * 5) },
      data_hora: `${dateStr}T08:31:00`,
      observacao: sist >= 140 ? 'Pressão acima da meta clínica' : 'Pressão arterial controlada'
    });

    // Metformina 12:30
    const ag2Id = `ag_${agendamentoIdCounter++}`;
    let st2 = isToday ? 'pendente' : 'concluido'; // PENDENTE HOJE para o usuário testar!
    agendamentos.push({
      id_agendamento: ag2Id,
      id_item: 'item_2',
      id_usuario: 'usr_1',
      descricao_item: 'Metformina Cloridrato 850mg (Almoço)',
      dosagem: '1 comprimido',
      tipo_item: 'medicamento',
      horario_previsto: `${dateStr}T12:30:00`,
      data: dateStr,
      hora: '12:30',
      critico: true,
      status: st2
    });
    if (!isToday) {
      execucoes.push({
        id_registro: `exec_${execucaoIdCounter++}`,
        id_agendamento: ag2Id,
        id_usuario: 'usr_1',
        horario_realizado: `${dateStr}T12:40:00`,
        status_final: 'concluido',
        observacao: 'Tomado após almoço',
        confirmado_por: 'paciente'
      });
    }

    // Metformina 19:30
    const ag3Id = `ag_${agendamentoIdCounter++}`;
    let st3 = isToday ? 'pendente' : 'concluido';
    agendamentos.push({
      id_agendamento: ag3Id,
      id_item: 'item_2',
      id_usuario: 'usr_1',
      descricao_item: 'Metformina Cloridrato 850mg (Jantar)',
      dosagem: '1 comprimido',
      tipo_item: 'medicamento',
      horario_previsto: `${dateStr}T19:30:00`,
      data: dateStr,
      hora: '19:30',
      critico: true,
      status: st3
    });
    if (!isToday) {
      execucoes.push({
        id_registro: `exec_${execucaoIdCounter++}`,
        id_agendamento: ag3Id,
        id_usuario: 'usr_1',
        horario_realizado: `${dateStr}T19:35:00`,
        status_final: 'concluido',
        observacao: 'Tomado após jantar',
        confirmado_por: 'paciente'
      });
    }

    // Anlodipino 21:00
    const ag4Id = `ag_${agendamentoIdCounter++}`;
    let st4 = isToday ? 'pendente' : 'concluido';
    agendamentos.push({
      id_agendamento: ag4Id,
      id_item: 'item_3',
      id_usuario: 'usr_1',
      descricao_item: 'Anlodipino 5mg',
      dosagem: '1 comprimido',
      tipo_item: 'medicamento',
      horario_previsto: `${dateStr}T21:00:00`,
      data: dateStr,
      hora: '21:00',
      critico: false,
      status: st4
    });
    if (!isToday) {
      execucoes.push({
        id_registro: `exec_${execucaoIdCounter++}`,
        id_agendamento: ag4Id,
        id_usuario: 'usr_1',
        horario_realizado: `${dateStr}T21:02:00`,
        status_final: 'concluido',
        observacao: 'Tomado antes de dormir',
        confirmado_por: 'paciente'
      });
    }
  }

  const notificacoes = [
    {
      id_notificacao: 'notif_1',
      id_destinatario: 'usr_2',
      tipo: 'sucesso',
      titulo: 'Medicação confirmada',
      mensagem: 'Seu Antenor confirmou o uso de Losartana 50mg pontualmente hoje.',
      horario: `${todayStr}T08:05:00`,
      lida: false
    },
    {
      id_notificacao: 'notif_2',
      id_destinatario: 'usr_2',
      tipo: 'lembrete',
      titulo: 'Próxima dose agendada',
      mensagem: 'Próxima medicação: Metformina 850mg às 12:30.',
      horario: `${todayStr}T11:00:00`,
      lida: false
    }
  ];

  return {
    users,
    vinculos,
    itens,
    agendamentos,
    execucoes,
    medicoes,
    notificacoes
  };
}

class Database {
  constructor() {
    this.data = null;
    this.init();
  }

  init() {
    try {
      if (fs.existsSync(DB_FILE)) {
        const raw = fs.readFileSync(DB_FILE, 'utf8');
        this.data = JSON.parse(raw);
      } else {
        this.data = generateSeedData();
        this.save();
      }
    } catch (e) {
      console.error('Error loading DB, regenerating seed data:', e);
      this.data = generateSeedData();
      this.save();
    }
  }

  save() {
    try {
      const tempPath = `${DB_FILE}.tmp`;
      fs.writeFileSync(tempPath, JSON.stringify(this.data, null, 2), 'utf8');
      fs.renameSync(tempPath, DB_FILE);
    } catch (e) {
      console.error('Error saving DB:', e);
    }
  }

  resetSeed() {
    this.data = generateSeedData();
    this.save();
    return this.data;
  }

  // Users
  getUsers() {
    return this.data.users;
  }

  getUserById(id) {
    return this.data.users.find(u => u.id_usuario === id);
  }

  updateUserPreferences(id, prefs) {
    const user = this.getUserById(id);
    if (user) {
      user.preferencias = { ...user.preferencias, ...prefs };
      this.save();
      return user;
    }
    return null;
  }

  // Items
  getItems(userId) {
    if (userId) {
      return this.data.itens.filter(i => i.id_usuario === userId && i.ativo !== false);
    }
    return this.data.itens.filter(i => i.ativo !== false);
  }

  getItemById(id) {
    return this.data.itens.find(i => i.id_item === id);
  }

  createItem(itemData) {
    const id = `item_${Date.now()}`;
    const newItem = {
      id_item: id,
      ativo: true,
      ...itemData
    };
    this.data.itens.push(newItem);

    // Also create schedules for today if frequency is daily
    const todayStr = formatDate(new Date());
    if (Array.isArray(newItem.horarios)) {
      newItem.horarios.forEach((hora, idx) => {
        const agId = `ag_${Date.now()}_${idx}`;
        this.data.agendamentos.push({
          id_agendamento: agId,
          id_item: newItem.id_item,
          id_usuario: newItem.id_usuario,
          descricao_item: newItem.descricao,
          dosagem: newItem.dosagem,
          tipo_item: newItem.tipo_item,
          horario_previsto: `${todayStr}T${hora}:00`,
          data: todayStr,
          hora: hora,
          critico: !!newItem.critico,
          status: 'pendente'
        });
      });
    }

    this.save();
    return newItem;
  }

  updateItem(id, updates) {
    const idx = this.data.itens.findIndex(i => i.id_item === id);
    if (idx !== -1) {
      this.data.itens[idx] = { ...this.data.itens[idx], ...updates };
      this.save();
      return this.data.itens[idx];
    }
    return null;
  }

  deleteItem(id) {
    const item = this.getItemById(id);
    if (item) {
      item.ativo = false;
      this.save();
      return true;
    }
    return false;
  }

  // Schedules
  getSchedules(userId, date) {
    let list = this.data.agendamentos;
    if (userId) {
      list = list.filter(a => a.id_usuario === userId);
    }
    if (date) {
      list = list.filter(a => a.data === date);
    }
    // Sort by hour
    return list.sort((a, b) => a.horario_previsto.localeCompare(b.horario_previsto));
  }

  getTodaySchedules(userId) {
    const todayStr = formatDate(new Date());
    return this.getSchedules(userId, todayStr);
  }

  getScheduleById(id) {
    return this.data.agendamentos.find(a => a.id_agendamento === id);
  }

  // Confirm execution (CA01: <2 seconds execution and instant update)
  confirmSchedule(scheduleId, confirmedBy = 'paciente', observacao = 'Confirmado com sucesso') {
    const ag = this.getScheduleById(scheduleId);
    if (!ag) return null;

    ag.status = 'concluido';

    const execId = `exec_${Date.now()}`;
    const nowIso = new Date().toISOString();
    const newExec = {
      id_registro: execId,
      id_agendamento: scheduleId,
      id_usuario: ag.id_usuario,
      horario_realizado: nowIso,
      status_final: 'concluido',
      observacao: observacao,
      confirmado_por: confirmedBy
    };
    this.data.execucoes.push(newExec);

    // Add notification for caregiver
    const vinculados = this.data.vinculos.filter(v => v.id_paciente === ag.id_usuario && v.ativo);
    vinculados.forEach(v => {
      this.addNotification({
        id_destinatario: v.id_cuidador,
        tipo: 'sucesso',
        titulo: 'Tarefa Concluída',
        mensagem: `${ag.descricao_item} foi confirmado por ${confirmedBy === 'paciente' ? 'Seu Antenor' : confirmedBy}.`,
        horario: nowIso
      });
    });

    this.save();
    return { agendamento: ag, execucao: newExec };
  }

  // Justify omission (RF04)
  justifySchedule(scheduleId, motivo, confirmedBy = 'paciente') {
    const ag = this.getScheduleById(scheduleId);
    if (!ag) return null;

    ag.status = 'justificado';

    const execId = `exec_${Date.now()}`;
    const nowIso = new Date().toISOString();
    const newExec = {
      id_registro: execId,
      id_agendamento: scheduleId,
      id_usuario: ag.id_usuario,
      horario_realizado: nowIso,
      status_final: 'justificado',
      observacao: motivo || 'Não realizado (Justificado)',
      confirmado_por: confirmedBy
    };
    this.data.execucoes.push(newExec);

    // If critical, generate alert notification for caregiver
    if (ag.critico) {
      const vinculados = this.data.vinculos.filter(v => v.id_paciente === ag.id_usuario && v.ativo);
      vinculados.forEach(v => {
        this.addNotification({
          id_destinatario: v.id_cuidador,
          tipo: 'alerta_critico',
          titulo: '⚠️ Alerta de Dose Omitida',
          mensagem: `Atenção: A medicação crítica "${ag.descricao_item}" não foi tomada. Motivo informado: "${motivo}".`,
          horario: nowIso
        });
      });
    }

    this.save();
    return { agendamento: ag, execucao: newExec };
  }

  // Metrics (RF02 / Medições)
  getMetrics(userId, tipo) {
    let list = this.data.medicoes;
    if (userId) {
      list = list.filter(m => m.id_usuario === userId);
    }
    if (tipo) {
      list = list.filter(m => m.tipo === tipo);
    }
    return list.sort((a, b) => b.data_hora.localeCompare(a.data_hora));
  }

  addMetric(metricData) {
    const id = `med_${Date.now()}`;
    const newMetric = {
      id_medicao: id,
      data_hora: metricData.data_hora || new Date().toISOString(),
      ...metricData
    };
    this.data.medicoes.push(newMetric);

    // Check critical thresholds
    if (newMetric.tipo === 'pressao' && newMetric.valor) {
      const { sistolica, diastolica } = newMetric.valor;
      if (sistolica >= 140 || diastolica >= 90) {
        const vinculados = this.data.vinculos.filter(v => v.id_paciente === newMetric.id_usuario && v.ativo);
        vinculados.forEach(v => {
          this.addNotification({
            id_destinatario: v.id_cuidador,
            tipo: 'alerta_pressao',
            titulo: '⚠️ Alerta: Pressão Arterial Elevada',
            mensagem: `Pressão aferida: ${sistolica}/${diastolica} mmHg. Acompanhe o paciente.`,
            horario: newMetric.data_hora
          });
        });
      }
    }

    this.save();
    return newMetric;
  }

  // Caregivers & Vinculos
  getVinculos(userId) {
    return this.data.vinculos.filter(v => v.id_paciente === userId || v.id_cuidador === userId);
  }

  // Notifications
  getNotifications(userId) {
    if (userId) {
      return this.data.notificacoes.filter(n => n.id_destinatario === userId);
    }
    return this.data.notificacoes;
  }

  addNotification(notifData) {
    const newNotif = {
      id_notificacao: `notif_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
      lida: false,
      ...notifData
    };
    this.data.notificacoes.unshift(newNotif);
    // Keep last 100
    if (this.data.notificacoes.length > 100) {
      this.data.notificacoes = this.data.notificacoes.slice(0, 100);
    }
    this.save();
    return newNotif;
  }

  markNotificationsRead(userId) {
    this.data.notificacoes.forEach(n => {
      if (n.id_destinatario === userId) n.lida = true;
    });
    this.save();
  }

  // 30-Day Adherence Report Aggregation (CA03 & RF06)
  get30DayAdherenceReport(userId = 'usr_1') {
    const today = new Date();
    const startDate = new Date();
    startDate.setDate(today.getDate() - 29);
    const startStr = formatDate(startDate);
    const endStr = formatDate(today);

    const relevantSchedules = this.data.agendamentos.filter(a =>
      a.id_usuario === userId &&
      a.data >= startStr &&
      a.data <= endStr
    );

    const totalScheduled = relevantSchedules.length;
    const completed = relevantSchedules.filter(a => a.status === 'concluido').length;
    const justified = relevantSchedules.filter(a => a.status === 'justificado').length;
    const pending = relevantSchedules.filter(a => a.status === 'pendente').length;
    const delayed = relevantSchedules.filter(a => a.status === 'atrasado').length;

    const rate = totalScheduled > 0 ? Math.round((completed / totalScheduled) * 100) : 100;

    // Breakdown by item
    const itemMap = {};
    relevantSchedules.forEach(a => {
      if (!itemMap[a.id_item]) {
        itemMap[a.id_item] = {
          id_item: a.id_item,
          descricao: a.descricao_item,
          tipo: a.tipo_item,
          total: 0,
          concluidos: 0,
          justificados: 0,
          pendentes: 0
        };
      }
      itemMap[a.id_item].total++;
      if (a.status === 'concluido') itemMap[a.id_item].concluidos++;
      if (a.status === 'justificado') itemMap[a.id_item].justificados++;
      if (a.status === 'pendente') itemMap[a.id_item].pendentes++;
    });

    const itemBreakdown = Object.values(itemMap).map(i => ({
      ...i,
      adesao_percent: Math.round((i.concluidos / (i.total || 1)) * 100)
    }));

    // List omissions / justifications for doctor review
    const justificativas = this.data.execucoes
      .filter(e => e.id_usuario === userId && e.status_final === 'justificado')
      .map(e => {
        const ag = this.data.agendamentos.find(a => a.id_agendamento === e.id_agendamento);
        return {
          id_registro: e.id_registro,
          horario: e.horario_realizado,
          item: ag ? ag.descricao_item : 'Item do plano',
          motivo: e.observacao,
          confirmado_por: e.confirmado_por
        };
      })
      .slice(0, 10);

    // Metrics summary
    const pressaoMetrics = this.getMetrics(userId, 'pressao').slice(0, 30);
    const glicemiaMetrics = this.getMetrics(userId, 'glicemia').slice(0, 30);

    const user = this.getUserById(userId);

    return {
      periodo: {
        inicio: startStr,
        fim: endStr,
        dias: 30
      },
      paciente: user,
      resumo: {
        total_agendamentos: totalScheduled,
        concluidos: completed,
        justificados: justified,
        pendentes: pending,
        atrasados: delayed,
        taxa_adesao_percentual: rate,
        nivel_adesao: rate >= 90 ? 'Excelente' : (rate >= 75 ? 'Regular' : 'Baixa - Risco')
      },
      itens: itemBreakdown,
      justificativas: justificativas,
      historico_medicoes: {
        pressao: pressaoMetrics,
        glicemia: glicemiaMetrics
      }
    };
  }

  // --- Auth & Admin Methods ---
  findUserByEmail(email) {
    if (!email) return null;
    return this.data.users.find(u => u.email.toLowerCase() === email.toLowerCase());
  }

  registerUser(userData) {
    const existing = this.findUserByEmail(userData.email);
    if (existing) {
      throw new Error('E-mail já cadastrado na plataforma.');
    }

    const id = `usr_${Date.now()}`;
    const newUser = {
      id_usuario: id,
      nome: userData.nome,
      email: userData.email,
      senha_hash: userData.senha || 'demo123',
      tipo_usuario: userData.tipo_usuario || 'paciente',
      data_nascimento: userData.data_nascimento || '1960-01-01',
      telefone: userData.telefone || '(69) 99999-0000',
      cidade: userData.cidade || 'Porto Velho - RO',
      condicoes: userData.condicoes || ['Hipertensão Arterial'],
      contato_emergencia: userData.contato_emergencia || '',
      papel_descricao: userData.papel_descricao || (userData.tipo_usuario === 'cuidador' ? 'Cuidador Familiar' : ''),
      registro_profissional: userData.registro_profissional || '',
      especialidade: userData.especialidade || '',
      preferencias: {
        alto_contraste: false,
        tamanho_fonte: 'normal',
        alertas_sonoros: true,
        voz_sintetizada: true
      },
      criado_em: new Date().toISOString()
    };

    this.data.users.push(newUser);

    this.addLgpdLog('CADASTRO_USUARIO', id, `Novo usuário criado com perfil [${newUser.tipo_usuario}]. Consentimento LGPD registrado.`);

    this.save();
    return newUser;
  }

  authenticate(email, senha) {
    const user = this.findUserByEmail(email);
    if (!user) {
      return null;
    }
    // Simple demo password check (or default pass demo123)
    if (user.senha_hash && senha && user.senha_hash !== senha && senha !== 'demo123') {
      return null;
    }
    this.addLgpdLog('LOGIN_ACESSO', user.id_usuario, `Autenticação bem-sucedida para ${user.email}.`);
    return user;
  }

  requestPasswordReset(email) {
    const user = this.findUserByEmail(email);
    const token = `reset_${Math.random().toString(36).substring(2, 10)}`;
    const nowIso = new Date().toISOString();

    if (user) {
      user.reset_token = token;
      user.reset_requested_at = nowIso;
      this.addLgpdLog('SOLICITACAO_RESET_SENHA', user.id_usuario, `Token gerado para envio de e-mail de recuperação.`);
      this.save();
      return { found: true, email: user.email, token };
    }

    return { found: false, email, token: null };
  }

  // Admin: Vínculos
  addVinculo({ id_paciente, id_cuidador, parentesco, permissao_nivel }) {
    const id = `vinc_${Date.now()}`;
    const newVinculo = {
      id_vinculo: id,
      id_paciente,
      id_cuidador,
      parentesco: parentesco || 'Familiar Autorizado',
      permissao_nivel: permissao_nivel || 'edicao_total',
      ativo: true,
      criado_em: new Date().toISOString()
    };
    this.data.vinculos.push(newVinculo);
    this.addLgpdLog('VINCULO_CRIADO', id_paciente, `Novo cuidador [${id_cuidador}] vinculado com permissão [${newVinculo.permissao_nivel}].`);
    this.save();
    return newVinculo;
  }

  deleteVinculo(id_vinculo) {
    const idx = this.data.vinculos.findIndex(v => v.id_vinculo === id_vinculo);
    if (idx !== -1) {
      const v = this.data.vinculos[idx];
      this.data.vinculos.splice(idx, 1);
      this.addLgpdLog('VINCULO_REMOVIDO', v.id_paciente, `Vínculo com cuidador [${v.id_cuidador}] desativado.`);
      this.save();
      return true;
    }
    return false;
  }

  deleteUser(id_usuario) {
    const idx = this.data.users.findIndex(u => u.id_usuario === id_usuario);
    if (idx !== -1) {
      const u = this.data.users[idx];
      this.data.users.splice(idx, 1);
      this.addLgpdLog('EXCLUSAO_USUARIO', id_usuario, `Conta de usuário excluída a pedido do titular (Direito ao esquecimento LGPD).`);
      this.save();
      return true;
    }
    return false;
  }

  // Admin: LGPD Audit Logs
  getLgpdLogs() {
    if (!this.data.lgpd_logs) {
      this.data.lgpd_logs = [
        {
          id_log: 'log_1',
          data_hora: '2026-10-13T08:00:10',
          acao: 'CONSENTIMENTO_INICIAL',
          id_usuario: 'usr_1',
          detalhes: 'Consentimento formal para tratamento de dados sensíveis de saúde coletado.'
        },
        {
          id_log: 'log_2',
          data_hora: '2026-10-13T08:05:00',
          acao: 'COMPARTILHAMENTO_AUTORIZADO',
          id_usuario: 'usr_1',
          detalhes: 'Acesso concedido ao cuidador familiar Micael Frota (Parentesco: Filho).'
        },
        {
          id_log: 'log_3',
          data_hora: '2026-10-13T09:30:00',
          acao: 'EXPORTACAO_RELATORIO',
          id_usuario: 'usr_1',
          detalhes: 'Download de relatório de adesão de 30 dias para apresentação na consulta APS.'
        }
      ];
      this.save();
    }
    return this.data.lgpd_logs;
  }

  addLgpdLog(acao, id_usuario, detalhes) {
    if (!this.data.lgpd_logs) {
      this.data.lgpd_logs = [];
    }
    const log = {
      id_log: `log_${Date.now()}`,
      data_hora: new Date().toISOString(),
      acao,
      id_usuario: id_usuario || 'sistema',
      detalhes: detalhes || ''
    };
    this.data.lgpd_logs.unshift(log);
    if (this.data.lgpd_logs.length > 200) {
      this.data.lgpd_logs = this.data.lgpd_logs.slice(0, 200);
    }
    this.save();
    return log;
  }
}

const db = new Database();

module.exports = db;
