import { useEffect, useState } from 'react'
import axios from 'axios'

function App() {
  alert("O React carregou!");
  const [transacoes, setTransacoes] = useState([]);
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
    try {
      await axios.post('http://localhost:8080/transacoes', form);
      setForm({ titulo: '', valor: '', tipo: 'ENTRADA', categoria: '', data: new Date().toISOString().split('T')[0] });
      buscarTransacoes();
    } catch (error) {
      alert("Erro ao salvar! Verifique o console.");
    }
  };

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

        {/* Formulário de Cadastro */}
        <section className="bg-white p-6 rounded-xl shadow-lg mb-8">
          <h2 className="text-xl font-bold mb-4 border-b pb-2">Nova Transação</h2>
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
              type="text" placeholder="Categoria (ex: Moradia)" 
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
        <section className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-gray-50 text-gray-600 uppercase text-sm">
                <tr>
                  <th className="p-4 font-bold">Descrição</th>
                  <th className="p-4 font-bold text-center">Tipo</th>
                  <th className="p-4 font-bold text-right">Valor</th>
                </tr>
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
                    <tr key={t.id} className="hover:bg-blue-50 transition-colors">
                      <td className="p-4">
                        <p className="font-semibold text-gray-800">{t.titulo}</p>
                        <p className="text-xs text-gray-500">{t.categoria}</p>
                      </td>
                      <td className="p-4 text-center">
                        <span className={`px-2 py-1 rounded-full text-xs font-bold ${t.tipo === 'ENTRADA' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                          {t.tipo}
                        </span>
                      </td>
                      <td className={`p-4 text-right font-mono font-bold ${t.tipo === 'ENTRADA' ? 'text-green-600' : 'text-red-600'}`}>
                        {t.tipo === 'ENTRADA' ? '+' : '-'} R$ {(Number(t.valor) || 0).toFixed(2)}
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