import React, { useEffect, useState } from "react";

export default function App() {
  const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
  const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_KEY;

  const EDGE_FUNCTION_URL = `${SUPABASE_URL}/functions/v1/quick-function`;

  const [dados, setDados] = useState([]);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState(null);

  async function carregarDados() {
    setCarregando(true);
    setErro(null);

    try {
      const resposta = await fetch(EDGE_FUNCTION_URL, {
        method: "GET",
        headers: {
          apikey: SUPABASE_KEY,
          Authorization: `Bearer ${SUPABASE_KEY}`,
          "Content-Type": "application/json",
        },
      });

      if (!resposta.ok) throw new Error(`Erro HTTP: ${resposta.status}`);

      const json = await resposta.json();
      console.log("✅ Dados recebidos:", json);

      // Garante que é um array
      setDados(Array.isArray(json) ? json : []);
    } catch (err) {
      console.error("❌ Erro ao buscar dados:", err);
      setErro("Não foi possível carregar os dados da API.");
    } finally {
      setCarregando(false);
    }
  }

  useEffect(() => {
    carregarDados();
  }, []);

  
  function formatarData(isoString) {
    const data = new Date(isoString);
    return data.toLocaleString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  return (
    <div className="container">
      <header>
        <h1>🌿 Horta Inteligente</h1>Q
      </header>

      <main>
        <section className="botoes">
          <button onClick={carregarDados} disabled={carregando}>
            {carregando ? "Carregando..." : "🔄 Atualizar"}
          </button>
        </section>

        {erro && <p className="erro">{erro}</p>}

        <section className="tabela-section">
          <h2>📋 Leituras Recentes</h2>
          <div className="tabela-container">
            <table>
              <thead>
                <tr>
                  <th>Horário</th>
                  <th>Temperatura (°C)</th>
                  <th>Umidade (%)</th>
                  <th>Solo</th>
                </tr>
              </thead>
              <tbody>
                {dados.length > 0 ? (
                  dados
                    .slice(-10)
                    .reverse()
                    .map((item, i) => (
                      <tr key={i}>
                        <td>{formatarData(item.captured_at)}</td>
                        <td>{item.temperature ?? "--"}</td>
                        <td>{item.humidity ?? "--"}</td>
                        <td>{item.moisture ?? "--"}</td>
                      </tr>
                    ))
                ) : (
                  <tr>
                    <td colSpan="4">Sem dados disponíveis</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </main>

      <footer>
        <p>
          Desenvolvido com <span style={{ color: "red", fontSize: "30px" }}>ODIO</span> e React
        </p>
      </footer>
    </div>
  );
}
