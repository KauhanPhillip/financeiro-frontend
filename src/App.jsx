import { useEffect, useState } from 'react'
import axios from 'axios'

// ─── Injetar fontes e estilos globais ───────────────────────────────────────
const GlobalStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=JetBrains+Mono:wght@400;500;700&family=DM+Sans:wght@300;400;500&display=swap');

    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    :root {
      --transition: 0.35s cubic-bezier(0.4, 0, 0.2, 1);
    }

    /* ── DARK THEME ── */
    .theme-dark {
      --bg-base:      #080c14;
      --bg-surface:   #0d1420;
      --bg-card:      #111827;
      --bg-card-hover:#141e2e;
      --bg-input:     #0d1828;
      --border:       rgba(99,130,255,0.12);
      --border-hover: rgba(99,130,255,0.35);
      --accent:       #4f8eff;
      --accent-glow:  rgba(79,142,255,0.25);
      --accent2:      #00e5c9;
      --green:        #00d68f;
      --green-bg:     rgba(0,214,143,0.08);
      --red:          #ff4d6d;
      --red-bg:       rgba(255,77,109,0.08);
      --text-primary: #f0f4ff;
      --text-secondary:#8a9bc4;
      --text-muted:   #4a5a7a;
      --grid-color:   rgba(99,130,255,0.04);
      --shadow:       0 8px 40px rgba(0,0,0,0.6);
      --shadow-sm:    0 2px 12px rgba(0,0,0,0.4);
      --tag-entrada-bg: rgba(0,214,143,0.1);
      --tag-entrada-text:#00d68f;
      --tag-saida-bg:  rgba(255,77,109,0.1);
      --tag-saida-text:#ff4d6d;
    }

    /* ── LIGHT THEME ── */
    .theme-light {
      --bg-base:      #f0f3fa;
      --bg-surface:   #e8ecf6;
      --bg-card:      #ffffff;
      --bg-card-hover:#f7f9ff;
      --bg-input:     #f4f6fb;
      --border:       rgba(60,90,180,0.1);
      --border-hover: rgba(60,90,180,0.3);
      --accent:       #2563eb;
      --accent-glow:  rgba(37,99,235,0.15);
      --accent2:      #0891b2;
      --green:        #059669;
      --green-bg:     rgba(5,150,105,0.07);
      --red:          #dc2626;
      --red-bg:       rgba(220,38,38,0.07);
      --text-primary: #0f172a;
      --text-secondary:#475569;
      --text-muted:   #94a3b8;
      --grid-color:   rgba(60,90,180,0.04);
      --shadow:       0 8px 40px rgba(60,80,160,0.12);
      --shadow-sm:    0 2px 12px rgba(60,80,160,0.08);
      --tag-entrada-bg: rgba(5,150,105,0.1);
      --tag-entrada-text:#059669;
      --tag-saida-bg:  rgba(220,38,38,0.1);
      --tag-saida-text:#dc2626;
    }

    body { background: var(--bg-base); transition: background var(--transition); }

    /* ── SCROLLBAR ── */
    ::-webkit-scrollbar { width: 5px; height: 5px; }
    ::-webkit-scrollbar-track { background: transparent; }
    ::-webkit-scrollbar-thumb { background: var(--border-hover); border-radius: 99px; }

    /* ── BASE ── */
    .app-root {
      min-height: 100vh;
      background: var(--bg-base);
      font-family: 'DM Sans', sans-serif;
      color: var(--text-primary);
      position: relative;
      overflow-x: hidden;
      transition: background var(--transition), color var(--transition);
    }

    /* Grid de fundo */
    .bg-grid {
      position: fixed; inset: 0; z-index: 0; pointer-events: none;
      background-image:
        linear-gradient(var(--grid-color) 1px, transparent 1px),
        linear-gradient(90deg, var(--grid-color) 1px, transparent 1px);
      background-size: 48px 48px;
      transition: background-image var(--transition);
    }

    /* Glow de fundo */
    .bg-glow {
      position: fixed; inset: 0; z-index: 0; pointer-events: none;
      background: radial-gradient(ellipse 60% 40% at 70% 10%, var(--accent-glow), transparent 70%);
      transition: background var(--transition);
    }

    .content-wrap {
      position: relative; z-index: 1;
      max-width: 1100px; margin: 0 auto;
      padding: 28px 20px 60px;
    }

    /* ── HEADER ── */
    .header {
      display: flex; align-items: center; justify-content: space-between;
      margin-bottom: 36px;
    }
    .header-left { display: flex; align-items: center; gap: 14px; }
    .logo-icon {
      width: 42px; height: 42px; border-radius: 12px;
      background: linear-gradient(135deg, var(--accent), var(--accent2));
      display: flex; align-items: center; justify-content: center;
      font-size: 18px; box-shadow: 0 0 20px var(--accent-glow);
      flex-shrink: 0;
    }
    .logo-title {
      font-family: 'Syne', sans-serif;
      font-size: 22px; font-weight: 800; letter-spacing: -0.5px;
      color: var(--text-primary);
    }
    .logo-sub {
      font-size: 11px; font-weight: 500; color: var(--text-muted);
      letter-spacing: 0.08em; text-transform: uppercase; margin-top: 1px;
    }
    .header-right { display: flex; align-items: center; gap: 10px; }

    /* ── THEME TOGGLE ── */
    .theme-toggle {
      position: relative; width: 56px; height: 28px;
      background: var(--bg-card); border: 1px solid var(--border);
      border-radius: 99px; cursor: pointer;
      transition: all var(--transition);
      display: flex; align-items: center;
    }
    .theme-toggle:hover { border-color: var(--border-hover); }
    .theme-toggle-thumb {
      position: absolute; left: 3px;
      width: 22px; height: 22px; border-radius: 50%;
      background: linear-gradient(135deg, var(--accent), var(--accent2));
      transition: transform var(--transition), box-shadow var(--transition);
      display: flex; align-items: center; justify-content: center;
      font-size: 11px; box-shadow: 0 0 8px var(--accent-glow);
    }
    .theme-dark .theme-toggle-thumb  { transform: translateX(0); }
    .theme-light .theme-toggle-thumb { transform: translateX(28px); }
    .toggle-label {
      font-size: 10px; font-weight: 700; letter-spacing: 0.06em;
      color: var(--text-muted); text-transform: uppercase;
    }

    /* ── BTN REFRESH ── */
    .btn-refresh {
      display: flex; align-items: center; gap: 7px;
      background: var(--bg-card); border: 1px solid var(--border);
      color: var(--text-secondary); font-size: 13px; font-weight: 500;
      font-family: 'DM Sans', sans-serif;
      padding: 7px 14px; border-radius: 10px; cursor: pointer;
      transition: all var(--transition);
    }
    .btn-refresh:hover {
      border-color: var(--border-hover); color: var(--accent);
      background: var(--bg-card-hover); box-shadow: 0 0 12px var(--accent-glow);
    }
    .btn-refresh svg { transition: transform 0.5s ease; }
    .btn-refresh:hover svg { transform: rotate(180deg); }

    /* ── STAT CARDS ── */
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 14px; margin-bottom: 24px;
    }
    @media (max-width: 768px) { .stats-grid { grid-template-columns: repeat(2, 1fr); } }

    .stat-card {
      background: var(--bg-card);
      border: 1px solid var(--border);
      border-radius: 16px; padding: 18px 20px;
      transition: all var(--transition);
      position: relative; overflow: hidden;
    }
    .stat-card::before {
      content: ''; position: absolute; inset: 0;
      background: linear-gradient(135deg, var(--accent-glow) 0%, transparent 60%);
      opacity: 0; transition: opacity var(--transition);
      pointer-events: none;
    }
    .stat-card:hover::before { opacity: 1; }
    .stat-card:hover { border-color: var(--border-hover); box-shadow: var(--shadow-sm); }

    .stat-card.salary-card { grid-column: 1; cursor: text; }
    .stat-card.salary-card:focus-within {
      border-color: var(--accent);
      box-shadow: 0 0 0 3px var(--accent-glow);
    }
    .stat-card-label {
      font-size: 10px; font-weight: 700; letter-spacing: 0.1em;
      text-transform: uppercase; color: var(--text-muted); margin-bottom: 10px;
      display: flex; align-items: center; gap: 5px;
    }
    .stat-card-label .dot {
      width: 6px; height: 6px; border-radius: 50%;
    }
    .dot-blue  { background: var(--accent); box-shadow: 0 0 6px var(--accent); }
    .dot-green { background: var(--green);  box-shadow: 0 0 6px var(--green); }
    .dot-red   { background: var(--red);    box-shadow: 0 0 6px var(--red); }
    .dot-white { background: var(--text-primary); }

    .stat-value {
      font-family: 'JetBrains Mono', monospace;
      font-size: 22px; font-weight: 700; color: var(--text-primary);
    }
    .stat-value.green  { color: var(--green); }
    .stat-value.red    { color: var(--red); }
    .stat-value.accent { color: var(--accent); }

    /* Input de salário dentro do card */
    .salary-input {
      font-family: 'JetBrains Mono', monospace;
      font-size: 18px; font-weight: 700;
      background: transparent; border: none; outline: none;
      color: var(--text-primary); width: 100%;
      caret-color: var(--accent);
      cursor: text; pointer-events: all; user-select: text;
      -webkit-user-select: text;
      display: block;
    }
    .salary-input::placeholder { color: var(--text-muted); font-weight: 400; }
    .salary-input:focus { outline: none; }

    /* Saldo card especial */
    .balance-card {
      background: linear-gradient(135deg, var(--accent) 0%, var(--accent2) 100%);
      border-color: transparent !important;
      box-shadow: 0 4px 24px var(--accent-glow);
    }
    .balance-card .stat-card-label { color: rgba(255,255,255,0.7); }
    .balance-card .stat-value { color: #fff; }
    .balance-card.negative {
      background: linear-gradient(135deg, #c0392b 0%, #ff4d6d 100%);
      box-shadow: 0 4px 24px rgba(255,77,109,0.3);
    }

    /* ── FORM SECTION ── */
    .section-card {
      background: var(--bg-card);
      border: 1px solid var(--border);
      border-radius: 20px; padding: 28px;
      margin-bottom: 24px;
      transition: border-color var(--transition), box-shadow var(--transition);
    }
    .section-card:hover { border-color: var(--border-hover); }

    .section-title {
      font-family: 'Syne', sans-serif;
      font-size: 15px; font-weight: 700; letter-spacing: -0.2px;
      color: var(--text-primary); margin-bottom: 20px;
      display: flex; align-items: center; gap: 10px;
    }
    .section-title-line {
      flex: 1; height: 1px; background: var(--border);
    }
    .section-badge {
      font-size: 10px; font-weight: 700; letter-spacing: 0.08em;
      text-transform: uppercase; color: var(--accent);
      background: var(--accent-glow); padding: 3px 8px; border-radius: 99px;
    }

    /* Form grid */
    .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
    @media (max-width: 600px) { .form-grid { grid-template-columns: 1fr; } }

    .form-group { display: flex; flex-direction: column; gap: 6px; }
    .form-label {
      font-size: 11px; font-weight: 600; letter-spacing: 0.06em;
      text-transform: uppercase; color: var(--text-muted);
    }
    .form-input {
      background: var(--bg-input); border: 1px solid var(--border);
      border-radius: 10px; padding: 11px 14px;
      font-family: 'DM Sans', sans-serif; font-size: 14px;
      color: var(--text-primary); outline: none;
      transition: all var(--transition);
      -webkit-appearance: none;
    }
    .form-input::placeholder { color: var(--text-muted); }
    .form-input:focus {
      border-color: var(--accent);
      box-shadow: 0 0 0 3px var(--accent-glow);
    }
    .form-input option { background: var(--bg-card); }

    /* Tipo radio pills */
    .tipo-group { display: flex; gap: 8px; }
    .tipo-pill {
      flex: 1; padding: 10px; border-radius: 10px; border: 1px solid var(--border);
      background: var(--bg-input); cursor: pointer;
      font-size: 13px; font-weight: 600; text-align: center;
      transition: all var(--transition); color: var(--text-secondary);
      font-family: 'DM Sans', sans-serif;
    }
    .tipo-pill.active-entrada {
      background: var(--green-bg); border-color: var(--green); color: var(--green);
      box-shadow: 0 0 12px rgba(0,214,143,0.15);
    }
    .tipo-pill.active-saida {
      background: var(--red-bg); border-color: var(--red); color: var(--red);
      box-shadow: 0 0 12px rgba(255,77,109,0.15);
    }
    .tipo-pill:hover:not(.active-entrada):not(.active-saida) {
      border-color: var(--border-hover); color: var(--text-primary);
    }

    .btn-submit {
      grid-column: 1 / -1;
      background: linear-gradient(135deg, var(--accent), var(--accent2));
      color: #fff; border: none; border-radius: 12px;
      padding: 14px; font-size: 14px; font-weight: 700;
      font-family: 'Syne', sans-serif; letter-spacing: 0.04em;
      cursor: pointer; transition: all var(--transition);
      box-shadow: 0 4px 20px var(--accent-glow);
      display: flex; align-items: center; justify-content: center; gap: 8px;
    }
    .btn-submit:hover { opacity: 0.92; transform: translateY(-1px); box-shadow: 0 6px 28px var(--accent-glow); }
    .btn-submit:active { transform: scale(0.98); }

    /* ── TABLE ── */
    .table-wrap { overflow-x: auto; }
    table { width: 100%; border-collapse: collapse; }
    thead tr {
      border-bottom: 1px solid var(--border);
    }
    th {
      padding: 10px 16px; text-align: left;
      font-size: 10px; font-weight: 700; letter-spacing: 0.1em;
      text-transform: uppercase; color: var(--text-muted);
    }
    th:last-child { text-align: right; }

    tbody tr {
      border-bottom: 1px solid var(--border);
      transition: background var(--transition);
    }
    tbody tr:last-child { border-bottom: none; }
    tbody tr:hover { background: var(--bg-card-hover); }

    td { padding: 14px 16px; }

    .td-date {
      font-family: 'JetBrains Mono', monospace;
      font-size: 11px; color: var(--text-muted); white-space: nowrap;
    }
    .td-title { font-size: 14px; font-weight: 600; color: var(--text-primary); }
    .td-cat {
      font-size: 11px; color: var(--text-muted); margin-top: 2px;
      font-weight: 500;
    }
    .td-tipo { text-align: center; }
    .tipo-tag {
      display: inline-block;
      padding: 3px 10px; border-radius: 99px;
      font-size: 10px; font-weight: 800; letter-spacing: 0.08em;
      text-transform: uppercase;
    }
    .tipo-tag.entrada { background: var(--tag-entrada-bg); color: var(--tag-entrada-text); }
    .tipo-tag.saida   { background: var(--tag-saida-bg);   color: var(--tag-saida-text); }

    .td-valor {
      text-align: right;
      font-family: 'JetBrains Mono', monospace;
      font-size: 14px; font-weight: 700; white-space: nowrap;
    }
    .td-valor.entrada { color: var(--green); }
    .td-valor.saida   { color: var(--red); }

    /* Empty state */
    .empty-state {
      padding: 56px 24px; text-align: center;
      color: var(--text-muted); font-style: italic; font-size: 14px;
    }

    /* Separator label para tabela */
    .table-header-row {
      display: flex; align-items: center; justify-content: space-between;
      margin-bottom: 0; padding: 0 0 16px;
    }
    .count-badge {
      font-size: 11px; font-weight: 700; color: var(--text-muted);
      background: var(--bg-input); border: 1px solid var(--border);
      padding: 3px 10px; border-radius: 99px;
    }

    /* Animação de entrada nos cards */
    @keyframes fadeUp {
      from { opacity: 0; transform: translateY(16px); }
      to   { opacity: 1; transform: translateY(0); }
    }
    .animate-in { animation: fadeUp 0.45s ease both; }
    .delay-1 { animation-delay: 0.05s; }
    .delay-2 { animation-delay: 0.10s; }
    .delay-3 { animation-delay: 0.15s; }
    .delay-4 { animation-delay: 0.20s; }
    .delay-5 { animation-delay: 0.28s; }
    .delay-6 { animation-delay: 0.36s; }

    /* Pulse no dot de status */
    @keyframes pulse { 0%,100%{opacity:1}50%{opacity:0.4} }
    .live-dot {
      width: 7px; height: 7px; border-radius: 50%;
      background: var(--green); display: inline-block; margin-right: 5px;
      animation: pulse 2s ease-in-out infinite;
    }
  `}</style>
)

//Ícone de Atualizar
const IconRefresh = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/>
    <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/>
  </svg>
)

//Componente Principal
function App() {
  const [transacoes, setTransacoes] = useState([])
  const [salario, setSalario] = useState('')
  const [darkMode, setDarkMode] = useState(true)
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    titulo: '', valor: '', tipo: 'ENTRADA', categoria: '',
    data: new Date().toISOString().split('T')[0]
  })

  const buscarTransacoes = async () => {
    setLoading(true)
    try {
      const resposta = await axios.get('http://localhost:8080/transacoes')
      setTransacoes(resposta.data)
    } catch (error) {
      console.error('Erro ao buscar transações:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { buscarTransacoes() }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    const dataAtual = new Date().toISOString().split('T')[0]
    try {
      await axios.post('http://localhost:8080/transacoes', { ...form, data: dataAtual })
      setForm({ titulo: '', valor: '', tipo: 'ENTRADA', categoria: '', data: dataAtual })
      buscarTransacoes()
    } catch {
      alert('Erro ao salvar a transação.')
    }
  }

  // ── Cálculos
  const totalGastos = transacoes
    .filter(t => /SA[IÍ]DA/i.test(t.tipo))
    .reduce((acc, t) => acc + (Number(t.valor) || 0), 0)

  const totalEntradas = transacoes
    .filter(t => t.tipo?.toUpperCase().includes('ENTRADA'))
    .reduce((acc, t) => acc + (Number(t.valor) || 0), 0) + (Number(salario) || 0)

  const saldo = totalEntradas - totalGastos
  const isNegative = saldo < 0

  const fmt = (v) => v.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

  return (
    <>
      <GlobalStyles />
      <div className={`app-root ${darkMode ? 'theme-dark' : 'theme-light'}`}>
        <div className="bg-grid" />
        <div className="bg-glow" />

        <div className="content-wrap">

          {/*HEADER*/}
          <header className="header animate-in">
            <div className="header-left">
              <div className="logo-icon">💎</div>
              <div>
                <div className="logo-title">Finance</div>
                <div className="logo-sub">
                  <span className="live-dot" />
                  Painel Financeiro
                </div>
              </div>
            </div>

            <div className="header-right">
              <span className="toggle-label">{darkMode ? '🌙' : '☀️'}</span>
              <div className="theme-toggle" onClick={() => setDarkMode(!darkMode)} title="Alternar tema">
                <div className="theme-toggle-thumb">{darkMode ? '🌙' : '☀️'}</div>
              </div>
              <button className="btn-refresh" onClick={buscarTransacoes} disabled={loading}>
                <IconRefresh />
                {loading ? 'Buscando…' : 'Atualizar'}
              </button>
            </div>
          </header>

          {/*STAT CARDS*/}
          <section className="stats-grid">
            {/* Salário */}
            <div className="stat-card salary-card animate-in delay-1">
              <div className="stat-card-label">
                <span className="dot dot-blue" /> Salário Mensal
              </div>
              <input
                type="number"
                className="salary-input"
                placeholder="0,00"
                value={salario}
                onChange={e => setSalario(e.target.value)}
              />
            </div>

            {/* Entradas */}
            <div className="stat-card animate-in delay-2">
              <div className="stat-card-label">
                <span className="dot dot-green" /> Entradas
              </div>
              <div className="stat-value green">R$ {fmt(totalEntradas)}</div>
            </div>

            {/* Gastos */}
            <div className="stat-card animate-in delay-3">
              <div className="stat-card-label">
                <span className="dot dot-red" /> Gastos
              </div>
              <div className="stat-value red">R$ {fmt(totalGastos)}</div>
            </div>

            {/* Saldo */}
            <div className={`stat-card balance-card animate-in delay-4 ${isNegative ? 'negative' : ''}`}>
              <div className="stat-card-label">
                <span className="dot dot-white" /> Saldo Final
              </div>
              <div className="stat-value">
                {isNegative ? '−' : '+'} R$ {fmt(Math.abs(saldo))}
              </div>
            </div>
          </section>

          {/*FORMULÁRIO*/}
          <section className="section-card animate-in delay-5">
            <div className="section-title">
              Nova Transação
              <div className="section-title-line" />
              <span className="section-badge">Cadastro</span>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="form-grid">
                <div className="form-group">
                  <label className="form-label">Título</label>
                  <input
                    type="text" placeholder="ex: Aluguel, Salário…"
                    className="form-input"
                    value={form.titulo}
                    onChange={e => setForm({ ...form, titulo: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Valor (R$)</label>
                  <input
                    type="number" placeholder="0,00"
                    className="form-input"
                    value={form.valor}
                    onChange={e => setForm({ ...form, valor: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Tipo</label>
                  <div className="tipo-group">
                    <button
                      type="button"
                      className={`tipo-pill ${form.tipo === 'ENTRADA' ? 'active-entrada' : ''}`}
                      onClick={() => setForm({ ...form, tipo: 'ENTRADA' })}
                    >📈 Entrada</button>
                    <button
                      type="button"
                      className={`tipo-pill ${form.tipo === 'SAIDA' ? 'active-saida' : ''}`}
                      onClick={() => setForm({ ...form, tipo: 'SAIDA' })}
                    >📉 Saída</button>
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Categoria</label>
                  <input
                    type="text" placeholder="ex: Lazer, Moradia…"
                    className="form-input"
                    value={form.categoria}
                    onChange={e => setForm({ ...form, categoria: e.target.value })}
                    required
                  />
                </div>

                <button type="submit" className="btn-submit">
                  <span>＋</span> Registrar Transação
                </button>
              </div>
            </form>
          </section>

          {/*TABELA*/}
          <section className="section-card animate-in delay-6" style={{ padding: '24px 0 0' }}>
            <div style={{ padding: '0 24px 16px' }}>
              <div className="section-title">
                Extrato
                <div className="section-title-line" />
                <span className="count-badge">{transacoes.length} registros</span>
              </div>
            </div>

            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Data</th>
                    <th>Descrição</th>
                    <th style={{ textAlign: 'center' }}>Tipo</th>
                    <th style={{ textAlign: 'right' }}>Valor</th>
                  </tr>
                </thead>
                <tbody>
                  {transacoes.length === 0 ? (
                    <tr>
                      <td colSpan="4" className="empty-state">
                        Nenhuma transação encontrada — o servidor Java está rodando?
                      </td>
                    </tr>
                  ) : (
                    transacoes.map(t => {
                      const isEntrada = t.tipo?.toUpperCase() === 'ENTRADA'
                      return (
                        <tr key={t.id}>
                          <td>
                            <span className="td-date">
                              {t.data ? new Date(t.data).toLocaleDateString('pt-BR') : '--/--/--'}
                            </span>
                          </td>
                          <td>
                            <div className="td-title">{t.titulo}</div>
                            {t.categoria && <div className="td-cat">{t.categoria}</div>}
                          </td>
                          <td className="td-tipo">
                            <span className={`tipo-tag ${isEntrada ? 'entrada' : 'saida'}`}>
                              {isEntrada ? 'Entrada' : 'Saída'}
                            </span>
                          </td>
                          <td className={`td-valor ${isEntrada ? 'entrada' : 'saida'}`}>
                            {isEntrada ? '+' : '−'} R$ {fmt(Number(t.valor) || 0)}
                          </td>
                        </tr>
                      )
                    })
                  )}
                </tbody>
              </table>
            </div>
          </section>

        </div>
      </div>
    </>
  )
}

export default App