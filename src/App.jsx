import { useEffect, useState } from 'react'
import axios from 'axios'

function App() {
  const [transacoes, setTransacoes] = useState([]);
  const [salario, setSalario] = useState(0); // Estado para o salário mensal
  
  // Estado para o formulário de cadastro
  const [form, setForm] = useState({ 
    titulo: '', 
    valor: '', 
    tipo: 'ENTRADA', 
    categoria: '', 
    data: new Date().toISOString().split('T')[0] 
  });

  const buscarTransacoes = async () => {
    try {
      const resposta = await axios.get('http://localhost:8080/transacoes');
      setTransacoes(resposta.data);
    } catch (error) {
      console.error("Erro ao buscar dados do Java: ", error);
    }
  };

  useEffect(() => {
    buscarTransacoes();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Gera a data de hoje automaticamente
    const dataAtual = new Date().toISOString().split('T')[0];
    
    const dadosParaEnviar = {
      ...form,
      data: dataAtual
    };

    try {
      await axios.post('http://localhost:8080/transacoes', dadosParaEnviar);
      setForm({ titulo: '', valor: '', tipo: 'ENTRADA', categoria: '' });
      buscarTransacoes();
    } catch (error) {
      alert("Erro ao salvar!");
    }
  };

  //Lógica de cálculos
  // Usa expressão regular (RegEx) para aceitar SAIDA ou SAÍDA, ignorando maiúsculas/minúsculas
  const totalGastos = transacoes
    .filter(t => /SA[IÍ]DA/i.test(t.tipo)) 
    .reduce((acc, t) => acc + (Number(t.valor) || 0), 0);

  const totalEntradas = transacoes
    .filter(t => t.tipo?.toUpperCase().includes('ENTRADA'))
    .reduce((acc, t) => acc + (Number(t.valor) || 0), 0) + (Number(salario) || 0);

  const quantoSobrou = totalEntradas - totalGastos;
  //console.log("Transações recebidas:", transacoes);

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-8 font-sans text-gray-900">
      <div className="max-w-4xl mx-auto">
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-extrabold text-blue-800">Assistente Financeiro 💰</h1>
          <button 
            onClick={buscarTransacoes}
            className="bg-white hover:bg-gray-200 text-gray-700 font-semibold py-2 px-4 border border-gray-300 rounded shadow-sm transition"
          >
            🔄 Atualizar
          </button>
        </header>

        {/* --- Seção de Resumo e Salário --- */}
        <section className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-blue-50 p-4 rounded-xl border border-blue-200 shadow-sm">
            <label className="block text-xs font-bold text-blue-800 mb-1 uppercase">Salário Mensal</label>
            <input 
              type="number" 
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none font-bold"
              placeholder="R$ 0,00"
              value={salario}
              onChange={(e) => setSalario(e.target.value)}
            />
          </div>

          <div className="bg-white p-4 rounded-xl shadow-sm border-b-4 border-green-500">
            <p className="text-xs text-gray-500 font-bold uppercase">Entradas (+)</p>
            <h3 className="text-xl font-bold text-green-600 font-mono">R$ {totalEntradas.toFixed(2)}</h3>
          </div>

          <div className="bg-white p-4 rounded-xl shadow-sm border-b-4 border-red-500">
            <p className="text-xs text-gray-500 font-bold uppercase">Gastos (-)</p>
            <h3 className="text-xl font-bold text-red-600 font-mono">R$ {totalGastos.toFixed(2)}</h3>
          </div>

          <div className={`p-4 rounded-xl shadow-md text-white transition-colors duration-500 ${quantoSobrou >= 0 ? 'bg-blue-600' : 'bg-red-600'}`}>
            <p className="text-xs font-bold uppercase opacity-80">Saldo Final</p>
            <h3 className="text-xl font-bold font-mono">R$ {quantoSobrou.toFixed(2)}</h3>
          </div>
        </section>

        {/* Formulário de Cadastro */}
        <section className="bg-white p-6 rounded-xl shadow-lg mb-8 border border-gray-200">
          <h2 className="text-xl font-bold mb-4 border-b pb-2 text-gray-700">Nova Transação</h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input 
              type="text" placeholder="Título (ex: Aluguel)" 
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              value={form.titulo} onChange={e => setForm({...form, titulo: e.target.value})} required 
            />
            <input 
              type="number" placeholder="Valor (R$)" 
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              value={form.valor} onChange={e => setForm({...form, valor: e.target.value})} required 
            />
            <select 
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white"
              value={form.tipo} onChange={e => setForm({...form, tipo: e.target.value})}
            >
              <option value="ENTRADA">📈 Entrada</option>
              <option value="SAIDA">📉 Saída</option>
            </select>
            <input 
              type="text" placeholder="Categoria (ex: Lazer)" 
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              value={form.categoria} onChange={e => setForm({...form, categoria: e.target.value})} required 
            />
            <button 
              type="submit" 
              className="md:col-span-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition-all transform active:scale-95 shadow-md"
            >
              Salvar Transação
            </button>
          </form>
        </section>

        {/* Lista de Transações */}
        <section className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-gray-50 text-gray-600 uppercase text-xs">
                <tr>
                  <th className="p-4 font-bold">Data</th>
                  <th className="p-4 font-bold">Descrição</th>
                  <th className="p-4 font-bold text-center">Tipo</th>
                  <th className="p-4 font-bold text-right">Valor</th>
                </tr>
              </thead>
              <thead className="bg-gray-50 text-gray-600 uppercase text-sm">
              </thead>
              <tbody className="divide-y divide-gray-100">
                {transacoes.length === 0 ? (
                  <tr>
                    <td colSpan="3" className="p-8 text-center text-gray-400 italic">
                      Nenhuma transação encontrada. O motor Java está ligado?
                    </td>
                  </tr>
                ) : (
                  transacoes.map((t) => (
                    <tr key={t.id} className="hover:bg-gray-50 transition-colors">
                      {/* 1ª Coluna: Data */}
                      <td className="p-4 text-xs text-gray-400 font-mono">
                        {t.data ? new Date(t.data).toLocaleDateString('pt-BR') : '--/--/--'}
                      </td>
  
                      {/* 2ª Coluna: Descrição */}
                      <td className="p-4">
                        <p className={`font-bold ${t.tipo?.toUpperCase() === 'ENTRADA' ? 'text-black-600' : 'text-gray-800'}`}>
                          {t.tipo?.toUpperCase() === 'ENTRADA' ? ' ' : ''}{t.titulo}
                        </p>
                        <p className="text-xs text-gray-400">{t.categoria}</p>
                      </td>

                      {/* 3ª Coluna: Tipo */}
                      <td className="p-4 text-center">
                        <span className={`px-2 py-1 rounded-full text-[10px] font-black ${t.tipo?.toUpperCase() === 'ENTRADA' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                          {/* Se o tipo for SAIDA, ele escreve SAÍDA com acento na tela */}
                          {t.tipo?.toUpperCase() === 'SAIDA' ? 'SAÍDA' : t.tipo?.toUpperCase()}
                        </span>
                      </td>

                      {/* 4ª Coluna: Valor (ESTE VAI PARA A DIREITA) */}
                      <td className={`p-4 text-right font-mono font-bold ${t.tipo?.toUpperCase() === 'ENTRADA' ? 'text-green-600' : 'text-red-600'}`}>
                        {t.tipo?.toUpperCase() === 'ENTRADA' ? '+' : '-'} R$ {(Number(t.valor) || 0).toFixed(2)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
}

export default App;