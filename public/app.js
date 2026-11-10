/**
 * Cuidar+ | Assistente Inteligente para Acompanhamento de Tratamentos
 * Sistema de 15 Telas Integradas (Edital Centelha 3 Rondônia)
 * Aluno: Micael Lima Araujo Frota (3º B T.I.)
 */

// Application Global State
const state = {
  currentScreen: 'dashboard-paciente',
  currentUserId: 'usr_1',
  users: [],
  currentUser: null,
  items: [],
  schedulesToday: [],
  notifications: [],
  reportData: null,
  aiInsights: null,
  metricsBP: [],
  metricsGlucose: [],
  adminUsers: [],
  adminVinculos: [],
  adminLgpdLogs: [],
  highContrast: false,
  fontSize: 'normal',
  voiceEnabled: true,
  selectedScheduleForJustify: null,
  selectedReason: null,
  charts: {
    pressao: null,
    glicemia: null
  }
};

// Web Audio API Sound Synthesizer
class SoundPlayer {
  constructor() {
    this.audioCtx = null;
  }

  getAudioContext() {
    if (!this.audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) this.audioCtx = new AudioContext();
    }
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
    return this.audioCtx;
  }

  playSuccessChime() {
    try {
      const ctx = this.getAudioContext();
      if (!ctx) return;
      const now = ctx.currentTime;
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gain = ctx.createGain();

      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(523.25, now); // C5
      osc1.frequency.exponentialRampToValueAtTime(659.25, now + 0.15); // E5

      osc2.type = 'triangle';
      osc2.frequency.setValueAtTime(659.25, now + 0.15); // E5
      osc2.frequency.exponentialRampToValueAtTime(783.99, now + 0.35); // G5

      gain.gain.setValueAtTime(0.3, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(ctx.destination);

      osc1.start(now);
      osc1.stop(now + 0.2);
      osc2.start(now + 0.15);
      osc2.stop(now + 0.5);
    } catch (e) {
      console.warn('Audio failed:', e);
    }
  }

  playAlertPing() {
    try {
      const ctx = this.getAudioContext();
      if (!ctx) return;
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(880, now);
      osc.frequency.setValueAtTime(440, now + 0.2);

      gain.gain.setValueAtTime(0.4, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.4);
    } catch (e) {
      console.warn('Alert audio failed:', e);
    }
  }
}

const sounds = new SoundPlayer();

// Web Speech API Voice Reader for Elderly (RNF01)
function speakText(text) {
  if (!state.voiceEnabled || !('speechSynthesis' in window)) return;
  try {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'pt-BR';
    utterance.rate = 0.95;
    utterance.pitch = 1.0;
    window.speechSynthesis.speak(utterance);
  } catch (e) {
    console.warn('Speech synthesis failed:', e);
  }
}

function getTodayFormatted() {
  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  const str = new Date().toLocaleDateString('pt-BR', options);
  return str.charAt(0).toUpperCase() + str.slice(1);
}

// =========================================================================
// ROUTING & NAVIGATION (ENTRE AS 15 TELAS)
// =========================================================================
function navigateTo(screenId) {
  state.currentScreen = screenId;
  window.location.hash = `#${screenId}`;

  // Hide all screens
  document.querySelectorAll('.screen-view').forEach(s => s.classList.add('hidden'));

  // Show active screen
  const target = document.getElementById(`screen-${screenId}`);
  if (target) {
    target.classList.remove('hidden');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // Update navigation tab highlights
  document.querySelectorAll('.nav-tab').forEach(btn => {
    btn.className = "nav-tab px-3.5 py-2 rounded-xl text-slate-400 hover:bg-slate-800 hover:text-white whitespace-nowrap flex items-center space-x-1.5 transition-all";
  });
  const activeNav = document.getElementById(`nav_${screenId}`);
  if (activeNav) {
    activeNav.className = "nav-tab px-3.5 py-2 rounded-xl text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 whitespace-nowrap flex items-center space-x-1.5 font-bold transition-all";
  }

  // Close menus
  closeDropdowns();

  // Screen specific rendering
  if (screenId === 'dashboard-paciente') {
    renderSeniorDashboard();
  } else if (screenId === 'painel-cuidador') {
    renderCaregiverDashboard();
  } else if (screenId === 'plano-cuidado') {
    renderCarePlan();
  } else if (screenId === 'notificacoes') {
    renderNotificacoesScreen();
  } else if (screenId === 'medicoes') {
    renderMedicoesScreen();
  } else if (screenId === 'painel-medico') {
    renderMedicalReport();
  } else if (screenId === 'ia-assistente') {
    renderAIInsightsScreen();
  } else if (screenId === 'admin-usuarios') {
    loadAdminUsers();
  } else if (screenId === 'admin-vinculos') {
    loadAdminVinculos();
  } else if (screenId === 'admin-lgpd') {
    loadAdminLgpdLogs();
  }
}

function handleHashChange() {
  const hash = window.location.hash.replace('#', '') || 'dashboard-paciente';
  navigateTo(hash);
}

window.addEventListener('hashchange', handleHashChange);

function toggleScreensMenu() {
  const dd = document.getElementById('screensDropdown');
  dd.classList.toggle('hidden');
}

function toggleUserDropdown() {
  const dd = document.getElementById('userDropdown');
  dd.classList.toggle('hidden');
}

function closeDropdowns() {
  const sdd = document.getElementById('screensDropdown');
  const udd = document.getElementById('userDropdown');
  if (sdd) sdd.classList.add('hidden');
  if (udd) udd.classList.add('hidden');
}

document.addEventListener('click', (e) => {
  const btnS = document.getElementById('btnScreensMenu');
  const sdd = document.getElementById('screensDropdown');
  const btnU = document.getElementById('userBtn');
  const udd = document.getElementById('userDropdown');

  if (btnS && sdd && !btnS.contains(e.target) && !sdd.contains(e.target)) {
    sdd.classList.add('hidden');
  }
  if (btnU && udd && !btnU.contains(e.target) && !udd.contains(e.target)) {
    udd.classList.add('hidden');
  }
});

// =========================================================================
// INITIALIZATION
// =========================================================================
document.addEventListener('DOMContentLoaded', async () => {
  const dateEl = document.getElementById('patientTodayDateText');
  if (dateEl) dateEl.textContent = getTodayFormatted();

  setupSSE();
  await loadUsers();
  await loadAllData();

  if (window.location.hash) {
    handleHashChange();
  } else {
    navigateTo('dashboard-paciente');
  }
});

// 1. Setup Server-Sent Events (SSE) (CA02)
function setupSSE() {
  if (window.location.search.includes('nosse=1')) {
    updateSSEStatus(true);
    return;
  }
  const evtSource = new EventSource('/api/events');

  evtSource.addEventListener('connected', () => {
    updateSSEStatus(true);
  });

  evtSource.addEventListener('schedule_confirmed', (e) => {
    const data = JSON.parse(e.data);
    showToast(`✅ ${data.schedule.descricao_item} confirmado!`, 'success');
    sounds.playSuccessChime();
    refreshDataSilently();
  });

  evtSource.addEventListener('schedule_justified', (e) => {
    const data = JSON.parse(e.data);
    showToast(`⚠️ Motivo registrado: ${data.schedule.descricao_item}`, 'warning');
    refreshDataSilently();
  });

  evtSource.addEventListener('patient_nudge', (e) => {
    const data = JSON.parse(e.data);
    sounds.playAlertPing();
    showToast(`🔔 Alerta do Cuidador: "${data.mensagem}"`, 'alert');
    speakText(`Atenção Seu Antenor: ${data.mensagem}`);
    refreshDataSilently();
  });

  evtSource.addEventListener('metric_added', () => {
    showToast('Nova medição de saúde registrada.', 'info');
    refreshDataSilently();
  });

  evtSource.addEventListener('schedule_update', () => {
    refreshDataSilently();
  });

  evtSource.onerror = () => {
    updateSSEStatus(false);
  };
}

function updateSSEStatus(online) {
  const el = document.getElementById('realtimeStatusText');
  if (el) {
    if (online) {
      el.className = "text-emerald-400 font-semibold flex items-center";
      el.innerHTML = '<i class="fa-solid fa-satellite-dish mr-1 text-[10px]"></i> Sincronizado SSE 24/7';
    } else {
      el.className = "text-amber-400 font-semibold flex items-center";
      el.innerHTML = '<i class="fa-solid fa-spinner fa-spin mr-1 text-[10px]"></i> Reconectando SSE...';
    }
  }
}

// 2. Data Loading
async function loadUsers() {
  try {
    const res = await fetch('/api/users');
    const json = await res.json();
    if (json.success) {
      state.users = json.data;
      state.currentUser = state.users.find(u => u.id_usuario === state.currentUserId) || state.users[0];
      updateHeaderUser();
    }
  } catch (e) {
    console.error('Erro ao carregar usuários:', e);
  }
}

async function loadAllData() {
  await Promise.all([
    loadSchedulesToday(),
    loadItems(),
    loadNotifications(),
    loadMetrics(),
    load30DayReport(),
    fetchAIInsights()
  ]);
}

async function refreshDataSilently() {
  await Promise.all([
    loadSchedulesToday(),
    loadItems(),
    loadNotifications(),
    loadMetrics(),
    load30DayReport()
  ]);
  // Re-render current screen
  if (state.currentScreen === 'dashboard-paciente') renderSeniorDashboard();
  if (state.currentScreen === 'painel-cuidador') renderCaregiverDashboard();
  if (state.currentScreen === 'plano-cuidado') renderCarePlan();
  if (state.currentScreen === 'notificacoes') renderNotificacoesScreen();
  if (state.currentScreen === 'medicoes') renderMedicoesScreen();
  if (state.currentScreen === 'painel-medico') renderMedicalReport();
  if (state.currentScreen === 'ia-assistente') renderAIInsightsScreen();
}

async function loadSchedulesToday() {
  try {
    const res = await fetch(`/api/schedules/today?userId=usr_1`);
    const json = await res.json();
    if (json.success) state.schedulesToday = json.data;
  } catch (e) {
    console.error('Erro schedules:', e);
  }
}

async function loadItems() {
  try {
    const res = await fetch('/api/items?userId=usr_1');
    const json = await res.json();
    if (json.success) state.items = json.data;
  } catch (e) {
    console.error('Erro items:', e);
  }
}

async function loadNotifications() {
  try {
    const res = await fetch('/api/notifications?userId=usr_2');
    const json = await res.json();
    if (json.success) state.notifications = json.data;
  } catch (e) {
    console.error('Erro notifications:', e);
  }
}

async function loadMetrics() {
  try {
    const [resBP, resGlucose] = await Promise.all([
      fetch('/api/metrics?userId=usr_1&tipo=pressao'),
      fetch('/api/metrics?userId=usr_1&tipo=glicemia')
    ]);
    const [jsonBP, jsonGlic] = await Promise.all([resBP.json(), resGlucose.json()]);
    if (jsonBP.success) state.metricsBP = jsonBP.data;
    if (jsonGlic.success) state.metricsGlucose = jsonGlic.data;
  } catch (e) {
    console.error('Erro metrics:', e);
  }
}

async function load30DayReport() {
  try {
    const res = await fetch('/api/reports/adherence-30days?userId=usr_1');
    const json = await res.json();
    if (json.success) state.reportData = json.data;
  } catch (e) {
    console.error('Erro report:', e);
  }
}

async function fetchAIInsights() {
  try {
    const res = await fetch('/api/ai/insights?userId=usr_1');
    const json = await res.json();
    if (json.success) state.aiInsights = json.data;
  } catch (e) {
    console.error('Erro AI insights:', e);
  }
}

// 3. User Switcher
function updateHeaderUser() {
  const nameEl = document.getElementById('currentUserName');
  const roleEl = document.getElementById('currentUserRole');
  const avatarEl = document.getElementById('userAvatarPlaceholder');

  if (state.currentUser) {
    nameEl.textContent = state.currentUser.nome.split(' ')[0] + ' ' + (state.currentUser.nome.split(' ')[1] || '');
    if (state.currentUser.tipo_usuario === 'paciente') {
      roleEl.textContent = 'Paciente (Modo Sênior)';
      avatarEl.textContent = '👴';
    } else if (state.currentUser.tipo_usuario === 'cuidador') {
      roleEl.textContent = 'Cuidador Autorizado';
      avatarEl.textContent = '👨‍👦';
    } else {
      roleEl.textContent = 'Médica de Família (APS)';
      avatarEl.textContent = '👩‍⚕️';
    }
  }
}

function selectUserProfile(userId) {
  state.currentUserId = userId;
  state.currentUser = state.users.find(u => u.id_usuario === userId);
  updateHeaderUser();
  closeDropdowns();

  if (state.currentUser.tipo_usuario === 'paciente') navigateTo('dashboard-paciente');
  else if (state.currentUser.tipo_usuario === 'cuidador') navigateTo('painel-cuidador');
  else navigateTo('painel-medico');
}

function quickDemoLogin() {
  selectUserProfile('usr_1');
  showToast('Acesso de Demonstração ativado (Seu Antenor)!', 'success');
}

// 4. Accessibility (RNF01)
function setFontSize(size) {
  state.fontSize = size;
  document.body.classList.remove('font-size-normal', 'font-size-large', 'font-size-extralarge');

  const btnN = document.getElementById('btnFontNormal');
  const btnL = document.getElementById('btnFontLarge');
  const btnXL = document.getElementById('btnFontExtraLarge');

  [btnN, btnL, btnXL].forEach(b => {
    b.className = "px-2 py-1 text-xs font-bold rounded-lg text-slate-400 hover:text-white";
  });

  if (size === 'normal') {
    document.body.classList.add('font-size-normal');
    btnN.className = "px-2 py-1 text-xs font-bold rounded-lg bg-slate-700 text-white";
  } else if (size === 'large') {
    document.body.classList.add('font-size-large');
    btnL.className = "px-2 py-1 text-sm font-bold rounded-lg bg-slate-700 text-white";
  } else if (size === 'extralarge') {
    document.body.classList.add('font-size-extralarge');
    btnXL.className = "px-2 py-1 text-base font-bold rounded-lg bg-slate-700 text-white";
  }
}

function toggleHighContrast() {
  state.highContrast = !state.highContrast;
  if (state.highContrast) {
    document.body.classList.add('high-contrast');
    showToast('Modo Alto Contraste Ativado (WCAG AAA)', 'info');
  } else {
    document.body.classList.remove('high-contrast');
    showToast('Modo Padrão Ativado', 'info');
  }
}

function toggleVoiceSpeech() {
  state.voiceEnabled = !state.voiceEnabled;
  const icon = document.getElementById('voiceIcon');
  if (state.voiceEnabled) {
    icon.className = "fa-solid fa-volume-high text-sm";
    showToast('Leitor por Voz Ativado 🔊', 'info');
    speakText('O leitor por voz do Cuidar Mais está ativado.');
  } else {
    icon.className = "fa-solid fa-volume-xmark text-sm text-slate-500";
    showToast('Leitor por Voz Desativado', 'info');
    if ('speechSynthesis' in window) window.speechSynthesis.cancel();
  }
}

// =========================================================================
// TELA 02: LOGIN
// =========================================================================
async function handleLoginSubmit(event) {
  event.preventDefault();
  const email = document.getElementById('loginEmail').value.trim();
  const senha = document.getElementById('loginSenha').value;

  try {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, senha })
    });
    const json = await res.json();
    if (json.success) {
      state.currentUser = json.user;
      state.currentUserId = json.user.id_usuario;
      updateHeaderUser();
      showToast('Login realizado com sucesso!', 'success');
      navigateTo('dashboard-paciente');
    } else {
      showToast(json.error || 'Credenciais inválidas.', 'alert');
    }
  } catch (err) {
    console.error('Erro no login:', err);
    showToast('Falha na conexão com o servidor.', 'alert');
  }
}

// =========================================================================
// TELA 03: CADASTRO
// =========================================================================
async function handleCadastroSubmit(event) {
  event.preventDefault();
  const nome = document.getElementById('cadNome').value.trim();
  const email = document.getElementById('cadEmail').value.trim();
  const telefone = document.getElementById('cadTelefone').value.trim();
  const tipo_usuario = document.getElementById('cadTipoUsuario').value;
  const senha = document.getElementById('cadSenha').value;

  try {
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nome, email, telefone, tipo_usuario, senha })
    });
    const json = await res.json();
    if (json.success) {
      showToast('Conta criada com sucesso! Faça login para começar.', 'success');
      document.getElementById('formCadastro').reset();
      navigateTo('login');
    } else {
      showToast(json.error || 'Erro ao criar conta.', 'alert');
    }
  } catch (e) {
    console.error('Erro cadastro:', e);
  }
}

// =========================================================================
// TELA 04: RECUPERAÇÃO DE SENHA
// =========================================================================
async function handleRecuperarSenhaSubmit(event) {
  event.preventDefault();
  const email = document.getElementById('recoverEmail').value.trim();
  const feedback = document.getElementById('recoverFeedback');

  try {
    const res = await fetch('/api/auth/recover', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    });
    const json = await res.json();
    feedback.textContent = json.message;
    feedback.classList.remove('hidden');
    showToast('Instruções de recuperação enviadas!', 'success');
  } catch (e) {
    console.error('Erro recuperar:', e);
  }
}

// =========================================================================
// TELA 05: DASHBOARD DO PACIENTE (MODO SÊNIOR) (CA01 & CA04)
// =========================================================================
function renderSeniorDashboard() {
  const heroContainer = document.getElementById('seniorHeroCard');
  const gridContainer = document.getElementById('seniorScheduleGrid');
  if (!heroContainer || !gridContainer) return;

  const pendingList = state.schedulesToday.filter(s => s.status === 'pendente' || s.status === 'atrasado');

  if (pendingList.length === 0) {
    heroContainer.innerHTML = `
      <div class="text-center py-6 space-y-3">
        <div class="w-20 h-20 mx-auto rounded-3xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-4xl shadow-inner">
          <i class="fa-solid fa-circle-check"></i>
        </div>
        <h3 class="text-3xl font-black text-white">Parabéns, Seu Antenor! 🎉</h3>
        <p class="text-slate-400 text-lg max-w-lg mx-auto">
          Todas as suas medicações e tarefas programadas para hoje já foram confirmadas com sucesso.
        </p>
        <div class="pt-2">
          <span class="inline-flex items-center space-x-2 px-4 py-2 rounded-2xl bg-emerald-500/10 text-emerald-300 text-xs font-bold border border-emerald-500/30">
            <i class="fa-solid fa-shield-heart"></i>
            <span>Seu cuidador Micael já foi notificado da sua adesão de 100% hoje!</span>
          </span>
        </div>
      </div>
    `;
  } else {
    const nextTask = pendingList[0];
    const isDelayed = nextTask.status === 'atrasado';

    heroContainer.innerHTML = `
      <div class="flex flex-col lg:flex-row items-center justify-between gap-6">
        <div class="space-y-3 text-center lg:text-left flex-1">
          <div class="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full ${isDelayed ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40' : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'} text-xs font-black uppercase tracking-wider">
            <i class="fa-solid ${isDelayed ? 'fa-triangle-exclamation' : 'fa-bell'} animate-bounce"></i>
            <span>${isDelayed ? 'Atenção: Horário Atrasado!' : 'Próxima Medicação do Dia'}</span>
          </div>

          <div class="flex flex-col sm:flex-row items-center sm:items-start space-y-2 sm:space-y-0 sm:space-x-4">
            <div class="w-16 h-16 rounded-2xl bg-emerald-500 text-slate-950 flex items-center justify-center text-3xl shadow-lg shadow-emerald-500/30 flex-shrink-0">
              <i class="fa-solid fa-pills"></i>
            </div>
            <div>
              <h3 class="text-2xl sm:text-3xl font-black text-white">${nextTask.descricao_item}</h3>
              <p class="text-base text-slate-300 font-semibold mt-0.5">
                Dosagem: <strong class="text-white">${nextTask.dosagem}</strong> | Horário: <strong class="text-emerald-400 font-black">${nextTask.hora}</strong>
              </p>
              <p class="text-xs text-slate-400 mt-1">
                <i class="fa-solid fa-info-circle mr-1"></i> Instrução: Tomar com água. Confirmação instantânea em 1 toque.
              </p>
            </div>
          </div>
        </div>

        <div class="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
          <!-- BOTÃO 1 TOQUE: TOMAR AGORA (CA01 & CA04) -->
          <button onclick="confirmTask('${nextTask.id_agendamento}')" 
                  class="px-8 py-5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xl sm:text-2xl shadow-2xl shadow-emerald-900/60 flex items-center justify-center space-x-3 transition-all transform hover:scale-[1.02] active:scale-95 touch-target-senior">
            <i class="fa-solid fa-check text-2xl"></i>
            <span>TOMAR AGORA (1 TOQUE)</span>
          </button>

          <!-- BOTÃO JUSTIFICAR (RF04) -->
          <button onclick="openJustifyModal('${nextTask.id_agendamento}', '${nextTask.descricao_item}')" 
                  class="px-5 py-4 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-sm sm:text-base flex items-center justify-center space-x-2 border border-slate-700 transition-all touch-target-senior">
            <i class="fa-solid fa-ban text-rose-400"></i>
            <span>Não Tomei / Justificar</span>
          </button>
        </div>
      </div>
    `;
  }

  // Grid
  gridContainer.innerHTML = state.schedulesToday.map(s => {
    const isDone = s.status === 'concluido';
    const isJustified = s.status === 'justificado';
    const isDelayed = s.status === 'atrasado';

    let badge = `<span class="px-2.5 py-1 rounded-full bg-blue-500/20 text-blue-300 font-bold text-xs">Pendente</span>`;
    let cardBorder = 'border-slate-800';

    if (isDone) {
      badge = `<span class="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-400 font-bold text-xs flex items-center space-x-1"><i class="fa-solid fa-check"></i><span>Concluído</span></span>`;
      cardBorder = 'border-emerald-500/40';
    } else if (isJustified) {
      badge = `<span class="px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-300 font-bold text-xs flex items-center space-x-1"><i class="fa-solid fa-triangle-exclamation"></i><span>Justificado</span></span>`;
      cardBorder = 'border-amber-500/40';
    } else if (isDelayed) {
      badge = `<span class="px-2.5 py-1 rounded-full bg-rose-500/20 text-rose-300 font-bold text-xs animate-pulse">Atrasado</span>`;
      cardBorder = 'border-rose-500/50';
    }

    return `
      <div class="bg-slate-900 rounded-2xl p-5 border ${cardBorder} shadow-sm flex flex-col justify-between space-y-4">
        <div class="space-y-2">
          <div class="flex items-center justify-between">
            <span class="text-xl font-black text-white">${s.hora}</span>
            ${badge}
          </div>
          <h4 class="text-lg font-bold text-white">${s.descricao_item}</h4>
          <p class="text-xs text-slate-400 font-medium">Dosagem: ${s.dosagem}</p>
        </div>

        <div class="pt-2 border-t border-slate-800 flex items-center space-x-2">
          ${isDone ? `
            <div class="text-xs text-emerald-400 font-bold flex items-center space-x-1 py-1">
              <i class="fa-solid fa-circle-check"></i>
              <span>Tomado pontualmente</span>
            </div>
          ` : isJustified ? `
            <div class="text-xs text-amber-300 font-semibold italic py-1">
              Motivo anotado no prontuário
            </div>
          ` : `
            <button onclick="confirmTask('${s.id_agendamento}')" 
                    class="flex-1 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-sm flex items-center justify-center space-x-1 shadow transition-all">
              <i class="fa-solid fa-check"></i>
              <span>Tomar</span>
            </button>
            <button onclick="openJustifyModal('${s.id_agendamento}', '${s.descricao_item}')" 
                    title="Justificar" class="w-10 h-10 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center text-sm border border-slate-700">
              <i class="fa-solid fa-ellipsis-vertical"></i>
            </button>
          `}
          <button onclick="speakTask('${s.descricao_item}', '${s.dosagem}', '${s.hora}')" title="Ouvir" class="w-10 h-10 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center text-sm border border-slate-700">
            <i class="fa-solid fa-volume-high"></i>
          </button>
        </div>
      </div>
    `;
  }).join('');
}

// Speak specific task
function speakTask(desc, dose, hora) {
  speakText(`Medicamento ${desc}. Dosagem: ${dose}. Horário programado: ${hora}.`);
}

function readPatientDailyRoutine() {
  const pending = state.schedulesToday.filter(s => s.status === 'pendente' || s.status === 'atrasado');
  if (pending.length === 0) {
    speakText('Parabéns, Seu Antenor! O senhor já completou todas as medicações de hoje!');
  } else {
    const next = pending[0];
    speakText(`Olá Seu Antenor! O senhor tem ${pending.length} tarefas pendentes. A próxima é: ${next.descricao_item}, às ${next.hora}.`);
  }
}

function triggerHelpAlert() {
  sounds.playAlertPing();
  showToast('Chamada de auxílio enviada para Micael (Filho)!', 'success');
  speakText('Chamando Micael pelo aplicativo. Ele já recebeu o seu alerta.');
  
  fetch('/api/notifications', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      id_destinatario: 'usr_2',
      tipo: 'alerta_emergencia',
      titulo: '🚨 Chamada de Ajuda de Seu Antenor',
      mensagem: 'Seu pai solicitou apoio ou contato via botão rápido do aplicativo.',
      horario: new Date().toISOString()
    })
  });
}

// CONFIRMAÇÃO DE TAREFA (CA01: <2s; CA04: 1 TOQUE)
async function confirmTask(scheduleId) {
  const startTime = performance.now();
  sounds.playSuccessChime();

  // Optimistic update
  const schedule = state.schedulesToday.find(s => s.id_agendamento === scheduleId);
  if (schedule) {
    schedule.status = 'concluido';
    renderSeniorDashboard();
  }

  try {
    const res = await fetch(`/api/schedules/${scheduleId}/confirm`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        confirmedBy: 'paciente',
        observacao: 'Confirmado com 1 toque no Modo Sênior'
      })
    });
    const json = await res.json();
    const elapsed = Math.round(performance.now() - startTime);

    if (json.success) {
      showToast(`✅ Confirmado com sucesso em ${elapsed}ms (Critério CA01 atendido!)`, 'success');
      speakText('Medicação registrada com sucesso!');
      await refreshDataSilently();
    }
  } catch (err) {
    console.error('Erro na confirmação:', err);
    showToast('Erro ao confirmar tarefa. Tente novamente.', 'warning');
  }
}

// JUSTIFICATIVA DE OMISSÃO (RF04)
function openJustifyModal(scheduleId, itemDescription) {
  state.selectedScheduleForJustify = scheduleId;
  state.selectedReason = null;
  document.getElementById('justifyItemSubtitle').textContent = `Item: ${itemDescription}`;
  document.getElementById('customJustifyInput').value = '';

  document.querySelectorAll('.reason-btn').forEach(b => {
    b.classList.remove('border-amber-500', 'bg-amber-500/10');
  });

  document.getElementById('modalJustify').classList.remove('hidden');
}

function selectJustificationReason(reason) {
  state.selectedReason = reason;
  document.getElementById('customJustifyInput').value = reason;

  document.querySelectorAll('.reason-btn').forEach(b => {
    if (b.textContent.includes(reason.slice(0, 15))) {
      b.classList.add('border-amber-500', 'bg-amber-500/10');
    } else {
      b.classList.remove('border-amber-500', 'bg-amber-500/10');
    }
  });
}

async function submitJustification() {
  const customVal = document.getElementById('customJustifyInput').value.trim();
  const motivo = customVal || state.selectedReason || 'Não informado';

  if (!state.selectedScheduleForJustify) return;

  try {
    const res = await fetch(`/api/schedules/${state.selectedScheduleForJustify}/justify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ motivo, confirmedBy: 'paciente' })
    });
    const json = await res.json();
    if (json.success) {
      closeModal('modalJustify');
      showToast('Motivo registrado com sucesso no histórico.', 'warning');
      await refreshDataSilently();
    }
  } catch (err) {
    console.error('Falha ao justificar:', err);
  }
}

// =========================================================================
// TELA 06: PAINEL DO CUIDADOR (CA02)
// =========================================================================
function renderCaregiverDashboard() {
  const fractionEl = document.getElementById('kpiCaregiverTodayFraction');
  const percentEl = document.getElementById('kpiCaregiverTodayPercent');
  const monthRateEl = document.getElementById('kpiCaregiverMonthRate');
  const bpEl = document.getElementById('kpiCaregiverBP');
  const glucoseEl = document.getElementById('kpiCaregiverGlucose');

  const total = state.schedulesToday.length;
  const done = state.schedulesToday.filter(s => s.status === 'concluido').length;
  const percent = total > 0 ? Math.round((done / total) * 100) : 100;

  if (fractionEl) fractionEl.textContent = `${done}/${total}`;
  if (percentEl) percentEl.textContent = `${percent}%`;

  if (state.reportData && state.reportData.resumo) {
    if (monthRateEl) monthRateEl.textContent = `${state.reportData.resumo.taxa_adesao_percentual}%`;
  }

  if (state.metricsBP.length > 0 && bpEl) {
    const last = state.metricsBP[0].valor;
    if (last) bpEl.textContent = `${last.sistolica}/${last.diastolica}`;
  }
  if (state.metricsGlucose.length > 0 && glucoseEl) {
    const last = state.metricsGlucose[0].valor;
    if (last) glucoseEl.textContent = `${last.valor_mg_dl} mg/dL`;
  }

  const liveList = document.getElementById('caregiverLiveScheduleFeed');
  if (liveList) {
    liveList.innerHTML = state.schedulesToday.map(s => {
      const isDone = s.status === 'concluido';
      const isJustified = s.status === 'justificado';
      const isDelayed = s.status === 'atrasado';

      return `
        <div class="flex items-center justify-between p-4 rounded-2xl border ${isDone ? 'border-emerald-500/40 bg-emerald-950/20' : isDelayed ? 'border-rose-500/40 bg-rose-950/20' : 'border-slate-800 bg-slate-950'}">
          <div class="flex items-center space-x-3">
            <div class="w-10 h-10 rounded-xl ${isDone ? 'bg-emerald-500 text-slate-950' : isDelayed ? 'bg-rose-500 text-white' : 'bg-blue-500 text-white'} flex items-center justify-center text-base font-bold">
              <i class="fa-solid ${isDone ? 'fa-check' : isDelayed ? 'fa-clock' : 'fa-pills'}"></i>
            </div>
            <div>
              <div class="text-sm font-bold text-white">${s.descricao_item}</div>
              <div class="text-xs text-slate-400">Horário: ${s.hora} | Dosagem: ${s.dosagem} ${s.critico ? '<span class="text-rose-400 font-bold ml-1">(Crítico)</span>' : ''}</div>
            </div>
          </div>
          <div>
            ${isDone ? `
              <span class="text-xs font-bold px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300">Concluído</span>
            ` : isJustified ? `
              <span class="text-xs font-bold px-3 py-1 rounded-full bg-amber-500/20 text-amber-300">Omissão Justificada</span>
            ` : isDelayed ? `
              <span class="text-xs font-bold px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 animate-pulse">Atrasado (>30 min)</span>
            ` : `
              <span class="text-xs font-bold px-3 py-1 rounded-full bg-blue-500/20 text-blue-300">Pendente</span>
            `}
          </div>
        </div>
      `;
    }).join('');
  }

  const notifList = document.getElementById('caregiverNotificationsFeed');
  if (notifList) {
    notifList.innerHTML = state.notifications.map(n => `
      <div class="p-3.5 rounded-2xl border ${n.tipo.includes('critico') || n.tipo.includes('emergencia') ? 'border-rose-500/40 bg-rose-950/30' : 'border-slate-800 bg-slate-950'} space-y-1">
        <div class="flex items-center justify-between">
          <span class="text-xs font-bold text-white">${n.titulo}</span>
          <span class="text-[10px] text-slate-500">${new Date(n.horario).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</span>
        </div>
        <p class="text-xs text-slate-400 leading-snug">${n.mensagem}</p>
      </div>
    `).join('');
  }
}

function openNudgeModal() {
  document.getElementById('modalNudge').classList.remove('hidden');
}

function setNudgePreset(msg) {
  document.getElementById('customNudgeMessage').value = msg;
}

async function sendNudgeNotification() {
  const msg = document.getElementById('customNudgeMessage').value.trim() || 'Seu Antenor, por favor tome o remédio com água!';
  try {
    const res = await fetch('/api/notifications/nudge', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id_paciente: 'usr_1', mensagem: msg })
    });
    const json = await res.json();
    if (json.success) {
      closeModal('modalNudge');
      showToast('Lembrete sonoro enviado com sucesso!', 'success');
      await loadNotifications();
    }
  } catch (e) {
    console.error('Erro nudge:', e);
  }
}

async function markAllNotificationsRead() {
  await fetch('/api/notifications/mark-read', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId: 'usr_2' })
  });
  await loadNotifications();
  showToast('Notificações marcadas como lidas.', 'info');
}

// =========================================================================
// TELA 07: GESTÃO DO PLANO DE CUIDADO (RF02)
// =========================================================================
function renderCarePlan() {
  const container = document.getElementById('carePlanFullGrid');
  if (!container) return;

  container.innerHTML = state.items.map(i => {
    let typeIcon = 'fa-pills';
    let typeColor = 'bg-blue-500/20 text-blue-300 border-blue-500/30';
    let typeLabel = 'Medicamento';

    if (i.tipo_item === 'medicao') {
      typeIcon = 'fa-heart-pulse';
      typeColor = 'bg-rose-500/20 text-rose-300 border-rose-500/30';
      typeLabel = 'Medição';
    } else if (i.tipo_item === 'consulta') {
      typeIcon = 'fa-calendar-check';
      typeColor = 'bg-teal-500/20 text-teal-300 border-teal-500/30';
      typeLabel = 'Consulta';
    } else if (i.tipo_item === 'exame') {
      typeIcon = 'fa-file-lines';
      typeColor = 'bg-purple-500/20 text-purple-300 border-purple-500/30';
      typeLabel = 'Exame';
    }

    return `
      <div class="bg-slate-900 rounded-3xl p-6 border border-slate-800 shadow-sm flex flex-col justify-between space-y-4">
        <div class="space-y-3">
          <div class="flex items-center justify-between">
            <span class="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-bold border ${typeColor}">
              <i class="fa-solid ${typeIcon}"></i>
              <span>${typeLabel}</span>
            </span>
            ${i.critico ? '<span class="text-xs font-extrabold text-rose-400 bg-rose-500/20 border border-rose-500/40 px-2 py-0.5 rounded-md">Crítico</span>' : ''}
          </div>

          <h3 class="text-lg font-black text-white">${i.descricao}</h3>
          
          <div class="text-xs text-slate-300 space-y-1 bg-slate-950 p-3 rounded-2xl border border-slate-800">
            <div><strong class="text-white">Dosagem:</strong> ${i.dosagem}</div>
            <div><strong class="text-white">Frequência:</strong> ${i.frequencia}</div>
            <div><strong class="text-white">Horários:</strong> ${(i.horarios || []).join(', ') || 'Sob demanda'}</div>
            ${i.instrucoes ? `<div><strong class="text-white">Orientações:</strong> ${i.instrucoes}</div>` : ''}
          </div>
        </div>

        <div class="pt-2 border-t border-slate-800 flex items-center justify-between">
          <span class="text-xs text-emerald-400 font-semibold"><i class="fa-solid fa-check-circle mr-1"></i>Ativo</span>
          <button onclick="deleteCarePlanItem('${i.id_item}')" title="Remover" class="text-xs text-slate-500 hover:text-rose-400 transition-colors">
            <i class="fa-solid fa-trash-can mr-1"></i>Excluir
          </button>
        </div>
      </div>
    `;
  }).join('');
}

function openNewItemModal() {
  document.getElementById('modalNewItem').classList.remove('hidden');
}

async function handleCreateItem(event) {
  event.preventDefault();
  const tipo = document.getElementById('newItemTipo').value;
  const desc = document.getElementById('newItemDescricao').value.trim();
  const dose = document.getElementById('newItemDosagem').value.trim();
  const freq = document.getElementById('newItemFrequencia').value.trim();
  const hora = document.getElementById('newItemHorario').value;
  const inst = document.getElementById('newItemInstrucoes').value.trim();
  const crit = document.getElementById('newItemCritico').checked;

  try {
    const res = await fetch('/api/items', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id_usuario: 'usr_1',
        tipo_item: tipo,
        descricao: desc,
        dosagem: dose,
        frequencia: freq,
        horarios: [hora],
        instrucoes: inst,
        critico: crit
      })
    });
    const json = await res.json();
    if (json.success) {
      closeModal('modalNewItem');
      showToast('Novo item cadastrado no plano!', 'success');
      document.getElementById('formNewItem').reset();
      await refreshDataSilently();
    }
  } catch (e) {
    console.error('Erro criar item:', e);
  }
}

async function deleteCarePlanItem(id) {
  if (!confirm('Deseja realmente remover este item do plano de tratamento?')) return;
  try {
    const res = await fetch(`/api/items/${id}`, { method: 'DELETE' });
    const json = await res.json();
    if (json.success) {
      showToast('Item removido com sucesso.', 'info');
      await refreshDataSilently();
    }
  } catch (e) {
    console.error('Erro deletar item:', e);
  }
}

// =========================================================================
// TELA 08: NOTIFICAÇÕES & OMISSÕES (RF03, RF04)
// =========================================================================
function renderNotificacoesScreen() {
  const justContainer = document.getElementById('notifJustificationsList');
  const remContainer = document.getElementById('notifRemindersList');

  if (justContainer) {
    const justs = (state.reportData && state.reportData.justificativas) || [];
    if (justs.length === 0) {
      justContainer.innerHTML = `<div class="text-xs text-slate-500 py-4 text-center">Nenhuma omissão registrada.</div>`;
    } else {
      justContainer.innerHTML = justs.map(j => `
        <div class="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-xs space-y-1">
          <div class="flex items-center justify-between">
            <strong class="text-white">${j.item}</strong>
            <span class="text-slate-400">${new Date(j.horario).toLocaleDateString('pt-BR')}</span>
          </div>
          <p class="text-amber-200">Motivo: "${j.motivo}"</p>
        </div>
      `).join('');
    }
  }

  if (remContainer) {
    remContainer.innerHTML = state.notifications.map(n => `
      <div class="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 text-xs space-y-1">
        <div class="flex items-center justify-between">
          <span class="font-bold text-white">${n.titulo}</span>
          <span class="text-[10px] text-slate-500">${new Date(n.horario).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</span>
        </div>
        <p class="text-slate-400">${n.mensagem}</p>
      </div>
    `).join('');
  }
}

// =========================================================================
// TELA 09: MEDIÇÕES DE SAÚDE
// =========================================================================
function renderMedicoesScreen() {
  const bpList = document.getElementById('fullMetricsBPList');
  const glucList = document.getElementById('fullMetricsGlucoseList');

  if (bpList) {
    bpList.innerHTML = state.metricsBP.slice(0, 15).map(m => `
      <div class="p-3 rounded-2xl border border-slate-800 bg-slate-950 flex items-center justify-between text-xs">
        <div>
          <div class="font-bold text-white text-sm">${m.valor.sistolica}/${m.valor.diastolica} mmHg</div>
          <div class="text-slate-400">${m.observacao || 'Normal'}</div>
        </div>
        <span class="text-slate-500">${new Date(m.data_hora).toLocaleDateString('pt-BR')}</span>
      </div>
    `).join('');
  }

  if (glucList) {
    glucList.innerHTML = state.metricsGlucose.slice(0, 15).map(m => `
      <div class="p-3 rounded-2xl border border-slate-800 bg-slate-950 flex items-center justify-between text-xs">
        <div>
          <div class="font-bold text-white text-sm">${m.valor.valor_mg_dl} mg/dL</div>
          <div class="text-slate-400">Coleta: ${m.valor.tipo || 'Jejum'}</div>
        </div>
        <span class="text-slate-500">${new Date(m.data_hora).toLocaleDateString('pt-BR')}</span>
      </div>
    `).join('');
  }
}

function openNewMetricModal() {
  document.getElementById('modalNewMetric').classList.remove('hidden');
}

function toggleMetricInputs() {
  const tipo = document.getElementById('metricTipoSelect').value;
  const bp = document.getElementById('inputsPressao');
  const gluc = document.getElementById('inputsGlicemia');

  if (tipo === 'pressao') {
    bp.classList.remove('hidden');
    gluc.classList.add('hidden');
  } else {
    bp.classList.add('hidden');
    gluc.classList.remove('hidden');
  }
}

async function handleCreateMetric(event) {
  event.preventDefault();
  const tipo = document.getElementById('metricTipoSelect').value;
  const obs = document.getElementById('metricObservacao').value.trim();

  let valorObj = {};
  if (tipo === 'pressao') {
    valorObj = {
      sistolica: Number(document.getElementById('inputSistolica').value),
      diastolica: Number(document.getElementById('inputDiastolica').value)
    };
  } else {
    const r = document.querySelector('input[name="glicTipo"]:checked');
    valorObj = {
      valor_mg_dl: Number(document.getElementById('inputGlicemiaValor').value),
      tipo: r ? r.value : 'jejum'
    };
  }

  try {
    const res = await fetch('/api/metrics', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id_usuario: 'usr_1', tipo, valor: valorObj, observacao: obs })
    });
    const json = await res.json();
    if (json.success) {
      closeModal('modalNewMetric');
      showToast('Medição de saúde salva com sucesso!', 'success');
      sounds.playSuccessChime();
      document.getElementById('formNewMetric').reset();
      await refreshDataSilently();
    }
  } catch (e) {
    console.error('Erro criar metric:', e);
  }
}

// =========================================================================
// TELA 10: PAINEL CLÍNICO & GERAÇÃO DE PDF 1-CLIQUE (CA03)
// =========================================================================
function renderMedicalReport() {
  if (!state.reportData) return;
  const data = state.reportData;

  document.getElementById('reportEmitDate').textContent = new Date().toLocaleDateString('pt-BR');
  document.getElementById('reportTotalSchedules').textContent = data.resumo.total_agendamentos;
  document.getElementById('reportAdherenceRate').textContent = `${data.resumo.taxa_adesao_percentual}%`;
  document.getElementById('reportConcludedCount').textContent = data.resumo.concluidos;
  document.getElementById('reportJustifiedCount').textContent = data.resumo.justificados;

  const tableBody = document.getElementById('reportItemTableBody');
  if (tableBody) {
    tableBody.innerHTML = data.itens.map(it => `
      <tr class="border-b border-slate-100 hover:bg-slate-50 transition-colors">
        <td class="p-3 font-bold text-slate-900">${it.descricao}</td>
        <td class="p-3 text-slate-500 uppercase text-xs font-semibold">${it.tipo}</td>
        <td class="p-3 text-center text-slate-700">${it.total}</td>
        <td class="p-3 text-center font-bold text-emerald-700">${it.concluidos}</td>
        <td class="p-3 text-center font-bold text-amber-700">${it.justificados}</td>
        <td class="p-3 text-right">
          <span class="font-extrabold ${it.adesao_percent >= 90 ? 'text-emerald-600' : 'text-amber-600'}">
            ${it.adesao_percent}%
          </span>
        </td>
      </tr>
    `).join('');
  }

  const justContainer = document.getElementById('reportJustificationsList');
  if (justContainer) {
    justContainer.innerHTML = data.justificativas.map(j => `
      <div class="p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs flex items-center justify-between">
        <div>
          <strong class="text-slate-900">${j.item}</strong>: "${j.motivo}"
        </div>
        <span class="text-slate-500">${new Date(j.horario).toLocaleDateString('pt-BR')}</span>
      </div>
    `).join('');
  }

  setTimeout(() => initCharts(), 100);
}

function initCharts() {
  if (!state.reportData || !window.Chart) return;
  const history = state.reportData.historico_medicoes;

  const ctxBP = document.getElementById('chartPressao');
  if (ctxBP) {
    if (state.charts.pressao) state.charts.pressao.destroy();
    const bpData = [...history.pressao].reverse().slice(-14);
    state.charts.pressao = new Chart(ctxBP, {
      type: 'line',
      data: {
        labels: bpData.map(m => new Date(m.data_hora).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })),
        datasets: [
          {
            label: 'Sistólica (Máx)',
            data: bpData.map(m => m.valor.sistolica),
            borderColor: '#EF4444',
            backgroundColor: 'rgba(239, 68, 68, 0.1)',
            borderWidth: 3,
            tension: 0.3,
            fill: true
          },
          {
            label: 'Diastólica (Mín)',
            data: bpData.map(m => m.valor.diastolica),
            borderColor: '#3B82F6',
            backgroundColor: 'rgba(59, 130, 246, 0.1)',
            borderWidth: 3,
            tension: 0.3,
            fill: true
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: { y: { min: 60, max: 180, title: { display: true, text: 'mmHg' } } }
      }
    });
  }

  const ctxGlic = document.getElementById('chartGlicemia');
  if (ctxGlic) {
    if (state.charts.glicemia) state.charts.glicemia.destroy();
    const glicData = [...history.glicemia].reverse().slice(-14);
    state.charts.glicemia = new Chart(ctxGlic, {
      type: 'bar',
      data: {
        labels: glicData.map(m => new Date(m.data_hora).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })),
        datasets: [
          {
            label: 'Glicemia em Jejum (mg/dL)',
            data: glicData.map(m => m.valor.valor_mg_dl),
            backgroundColor: glicData.map(m => m.valor.valor_mg_dl > 125 ? '#F59E0B' : '#10B981'),
            borderRadius: 6
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: { y: { min: 60, max: 180, title: { display: true, text: 'mg/dL' } } }
      }
    });
  }
}

// CRITÉRIO CA03: 1-CLIQUE PARA BAIXAR PDF
async function generateAdherencePDF() {
  const btn = document.getElementById('btnGeneratePDF');
  const orig = btn.innerHTML;
  btn.innerHTML = `<i class="fa-solid fa-spinner fa-spin text-2xl"></i> <span class="text-base font-extrabold">Compilando Relatório PDF...</span>`;
  btn.disabled = true;

  try {
    const reportElement = document.getElementById('medicalReportPrintableArea');
    const canvas = await html2canvas(reportElement, { scale: 2, useCORS: true, backgroundColor: '#ffffff' });
    const imgData = canvas.toDataURL('image/png');
    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

    pdf.addImage(imgData, 'PNG', 0, 5, pdfWidth, pdfHeight);
    pdf.save('Relatorio_CuidarMais_SeuAntenor_30Dias.pdf');

    sounds.playSuccessChime();
    showToast('📄 Relatório PDF gerado e baixado com sucesso! (Critério CA03)', 'success');
  } catch (err) {
    console.error('Erro PDF:', err);
    window.print();
  } finally {
    btn.innerHTML = orig;
    btn.disabled = false;
  }
}

// =========================================================================
// TELA 11: IA ASSISTENTE CUIDAR+
// =========================================================================
function renderAIInsightsScreen() {
  const container = document.getElementById('aiInsightsFullGrid');
  if (!container || !state.aiInsights) return;

  const insights = state.aiInsights.insights || [];
  container.innerHTML = insights.map(i => {
    let badge = 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40';
    let icon = 'fa-circle-check';

    if (i.status === 'alerta') {
      badge = 'bg-rose-500/20 text-rose-300 border-rose-500/40';
      icon = 'fa-triangle-exclamation';
    } else if (i.status === 'recomendacao') {
      badge = 'bg-purple-500/20 text-purple-300 border-purple-500/40';
      icon = 'fa-user-doctor';
    } else if (i.status === 'informativo') {
      badge = 'bg-blue-500/20 text-blue-300 border-blue-500/40';
      icon = 'fa-chart-pie';
    }

    return `
      <div class="bg-slate-900 rounded-3xl p-6 border border-slate-800 shadow-sm space-y-3">
        <div class="flex items-center justify-between">
          <span class="px-3 py-1 rounded-full text-xs font-bold border ${badge} flex items-center space-x-1.5">
            <i class="fa-solid ${icon}"></i>
            <span>${i.categoria}</span>
          </span>
          <span class="text-[10px] text-slate-500 font-semibold">Análise Preditiva Centelha</span>
        </div>
        <h3 class="text-lg font-black text-white">${i.titulo}</h3>
        <p class="text-sm text-slate-300 leading-relaxed">${i.descricao}</p>
      </div>
    `;
  }).join('');
}

// =========================================================================
// TELA 12: ADMIN - GESTÃO DE USUÁRIOS
// =========================================================================
async function loadAdminUsers() {
  try {
    const res = await fetch('/api/admin/users');
    const json = await res.json();
    if (json.success) {
      state.adminUsers = json.data;
      renderAdminUsersTable();
    }
  } catch (e) {
    console.error('Erro admin users:', e);
  }
}

function renderAdminUsersTable() {
  const tbody = document.getElementById('adminUsersTableBody');
  if (!tbody) return;

  tbody.innerHTML = state.adminUsers.map(u => {
    let roleBadge = 'bg-teal-500/20 text-teal-300 border-teal-500/30';
    if (u.tipo_usuario === 'cuidador') roleBadge = 'bg-blue-500/20 text-blue-300 border-blue-500/30';
    if (u.tipo_usuario === 'profissional') roleBadge = 'bg-purple-500/20 text-purple-300 border-purple-500/30';

    return `
      <tr class="hover:bg-slate-950/50 transition-colors">
        <td class="p-4">
          <div class="font-bold text-white">${u.nome}</div>
          <div class="text-[11px] text-slate-500">${u.email}</div>
        </td>
        <td class="p-4">
          <span class="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase border ${roleBadge}">
            ${u.tipo_usuario}
          </span>
        </td>
        <td class="p-4 text-slate-300">
          <div>${u.telefone || 'Não informado'}</div>
          <div class="text-[11px] text-slate-500">${u.cidade || 'Porto Velho - RO'}</div>
        </td>
        <td class="p-4 text-slate-300">
          <div>${u.condicoes ? u.condicoes.join(', ') : (u.registro_profissional || '-')}</div>
        </td>
        <td class="p-4 text-right">
          <button onclick="deleteAdminUser('${u.id_usuario}')" class="text-rose-400 hover:text-rose-300 text-xs font-bold">
            <i class="fa-solid fa-trash-can mr-1"></i>Excluir
          </button>
        </td>
      </tr>
    `;
  }).join('');
}

async function deleteAdminUser(id) {
  if (!confirm('Deseja excluir este usuário da base de dados?')) return;
  try {
    const res = await fetch(`/api/admin/users/${id}`, { method: 'DELETE' });
    const json = await res.json();
    if (json.success) {
      showToast('Usuário removido da base de dados.', 'info');
      await loadAdminUsers();
    }
  } catch (e) {
    console.error('Erro delete user:', e);
  }
}

// =========================================================================
// TELA 13: ADMIN - GESTÃO DE VÍNCULOS (RF05)
// =========================================================================
async function loadAdminVinculos() {
  try {
    const res = await fetch('/api/admin/vinculos');
    const json = await res.json();
    if (json.success) {
      state.adminVinculos = json.data;
      renderAdminVinculosTable();
    }
  } catch (e) {
    console.error('Erro admin vinculos:', e);
  }
}

function renderAdminVinculosTable() {
  const tbody = document.getElementById('adminVinculosTableBody');
  if (!tbody) return;

  tbody.innerHTML = state.adminVinculos.map(v => {
    const pac = state.users.find(u => u.id_usuario === v.id_paciente) || { nome: v.id_paciente };
    const cuid = state.users.find(u => u.id_usuario === v.id_cuidador) || { nome: v.id_cuidador };

    return `
      <tr class="hover:bg-slate-950/50 transition-colors">
        <td class="p-4 font-mono text-slate-500 text-[11px]">${v.id_vinculo}</td>
        <td class="p-4 font-bold text-white">${pac.nome}</td>
        <td class="p-4 text-slate-300">${cuid.nome}</td>
        <td class="p-4 text-slate-400">${v.parentesco}</td>
        <td class="p-4">
          <span class="px-2.5 py-1 rounded-full text-[10px] font-bold ${v.permissao_nivel === 'edicao_total' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-slate-800 text-slate-300'}">
            ${v.permissao_nivel}
          </span>
        </td>
        <td class="p-4 text-right">
          <button onclick="deleteAdminVinculo('${v.id_vinculo}')" class="text-rose-400 hover:text-rose-300 text-xs font-bold">
            Desativar
          </button>
        </td>
      </tr>
    `;
  }).join('');
}

function openNewVinculoModal() {
  const pacSelect = document.getElementById('vinculoPacienteSelect');
  const cuidSelect = document.getElementById('vinculoCuidadorSelect');

  if (pacSelect && cuidSelect) {
    pacSelect.innerHTML = state.users.map(u => `<option value="${u.id_usuario}">${u.nome} (${u.tipo_usuario})</option>`).join('');
    cuidSelect.innerHTML = state.users.map(u => `<option value="${u.id_usuario}">${u.nome} (${u.tipo_usuario})</option>`).join('');
  }

  document.getElementById('modalNewVinculo').classList.remove('hidden');
}

async function handleCreateVinculo(event) {
  event.preventDefault();
  const id_paciente = document.getElementById('vinculoPacienteSelect').value;
  const id_cuidador = document.getElementById('vinculoCuidadorSelect').value;
  const parentesco = document.getElementById('vinculoParentesco').value.trim();
  const permissao_nivel = document.getElementById('vinculoPermissao').value;

  try {
    const res = await fetch('/api/admin/vinculos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id_paciente, id_cuidador, parentesco, permissao_nivel })
    });
    const json = await res.json();
    if (json.success) {
      closeModal('modalNewVinculo');
      showToast('Novo vínculo registrado com sucesso!', 'success');
      await loadAdminVinculos();
    }
  } catch (e) {
    console.error('Erro criar vínculo:', e);
  }
}

async function deleteAdminVinculo(id) {
  if (!confirm('Deseja desativar este vínculo de cuidador?')) return;
  try {
    const res = await fetch(`/api/admin/vinculos/${id}`, { method: 'DELETE' });
    const json = await res.json();
    if (json.success) {
      showToast('Vínculo desativado.', 'info');
      await loadAdminVinculos();
    }
  } catch (e) {
    console.error('Erro delete vínculo:', e);
  }
}

// =========================================================================
// TELA 14: ADMIN - AUDITORIA & LGPD (RNF02)
// =========================================================================
async function loadAdminLgpdLogs() {
  try {
    const res = await fetch('/api/admin/lgpd-logs');
    const json = await res.json();
    if (json.success) {
      state.adminLgpdLogs = json.data;
      renderAdminLgpdTable();
    }
  } catch (e) {
    console.error('Erro lgpd logs:', e);
  }
}

function renderAdminLgpdTable() {
  const tbody = document.getElementById('adminLgpdTableBody');
  if (!tbody) return;

  tbody.innerHTML = state.adminLgpdLogs.map(l => `
    <tr class="hover:bg-slate-950/50 transition-colors">
      <td class="p-4 text-slate-400 font-mono text-[11px]">${new Date(l.data_hora).toLocaleString('pt-BR')}</td>
      <td class="p-4">
        <span class="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
          ${l.acao}
        </span>
      </td>
      <td class="p-4 font-mono text-slate-400 text-[11px]">${l.id_usuario}</td>
      <td class="p-4 text-slate-300">${l.detalhes}</td>
    </tr>
  `).join('');
}

// =========================================================================
// TELA 15: RESET DEMO DATA
// =========================================================================
async function resetDemoData() {
  if (!confirm('Deseja restaurar todos os dados originais da demonstração?')) return;
  try {
    await fetch('/api/system/reset-demo', { method: 'POST' });
    showToast('Dados originais restaurados com sucesso!', 'info');
    await loadUsers();
    await loadAllData();
    navigateTo('dashboard-paciente');
  } catch (e) {
    console.error('Erro reset:', e);
  }
}

// Helpers
function closeModal(id) {
  const modal = document.getElementById(id);
  if (modal) modal.classList.add('hidden');
}

function showToast(message, type = 'info') {
  const container = document.getElementById('toastContainer');
  if (!container) return;

  const toast = document.createElement('div');
  let bg = 'bg-slate-950 border border-slate-700 text-white';
  if (type === 'success') bg = 'bg-emerald-900 border border-emerald-500 text-white shadow-emerald-950/60';
  if (type === 'warning') bg = 'bg-amber-900 border border-amber-500 text-white shadow-amber-950/60';
  if (type === 'alert') bg = 'bg-rose-900 border border-rose-500 text-white shadow-rose-950/60';

  toast.className = `${bg} px-5 py-3.5 rounded-2xl shadow-2xl text-xs font-bold flex items-center space-x-3 pointer-events-auto toast-enter`;
  toast.innerHTML = `<span>${message}</span>`;

  container.appendChild(toast);
  setTimeout(() => toast.classList.add('toast-enter-active'), 10);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(-10px)';
    setTimeout(() => toast.remove(), 300);
  }, 4000);
}
