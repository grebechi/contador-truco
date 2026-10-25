import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [pontosNos, setPontosNos] = useState(0)
  const [pontosEles, setPontosEles] = useState(0)
  const [nomeNos, setNomeNos] = useState('Nós')
  const [nomeEles, setNomeEles] = useState('Eles')
  const [limitePontos, setLimitePontos] = useState(24) // Truco gaúcho geralmente é 24
  const [vitoriasNos, setVitoriasNos] = useState(0)
  const [vitoriasEles, setVitoriasEles] = useState(0)
  const [tempoDecorrido, setTempoDecorrido] = useState(0)
  const [timerAtivo, setTimerAtivo] = useState(true)
  const [historico, setHistorico] = useState<{ vencedor: string, placar: string, duracao: string }[]>([])
  const [menuAberto, setMenuAberto] = useState(false)

  useEffect(() => {
    let intervalo: ReturnType<typeof setInterval>;
    if (timerAtivo) {
      intervalo = setInterval(() => setTempoDecorrido(t => t + 1), 1000)
    }
    return () => clearInterval(intervalo)
  }, [timerAtivo])

  const formatarTempo = (segundos: number) => {
    const min = Math.floor(segundos / 60)
    const seg = segundos % 60
    return `${min.toString().padStart(2, '0')}:${seg.toString().padStart(2, '0')}`
  }

  const finalizarPartida = (vencedor: string, ptsNos: number, ptsEles: number) => {
    const tempo = formatarTempo(tempoDecorrido)
    const maior = Math.max(ptsNos, ptsEles)
    const menor = Math.min(ptsNos, ptsEles)
    
    alert(`🎉 Fim de jogo! ${vencedor} venceu por ${maior} a ${menor} em ${tempo}!`)
    
    vencedor === nomeNos ? setVitoriasNos(vitoriasNos + 1) : setVitoriasEles(vitoriasEles + 1)
    setHistorico([...historico, { vencedor, placar: `${maior} a ${menor}`, duracao: tempo }])
    
    setPontosNos(0)
    setPontosEles(0)
    setTempoDecorrido(0)
    setTimerAtivo(true)
  }

  
  const calcularFaltaEnvido = () => {
    const maiorPontuacao = Math.max(pontosNos, pontosEles)
    const metadeDoJogo = limitePontos / 2
    
    if (maiorPontuacao < metadeDoJogo) {
      return limitePontos
    } else {
      return limitePontos - maiorPontuacao
    }
  }

  const adicionarNos = (pontos: number) => {
    const novos = pontosNos + pontos
    novos >= limitePontos ? finalizarPartida(nomeNos, novos, pontosEles) : setPontosNos(novos)
  }

  const adicionarEles = (pontos: number) => {
    const novos = pontosEles + pontos
    novos >= limitePontos ? finalizarPartida(nomeEles, pontosNos, novos) : setPontosEles(novos)
  }

  const removerNos = () => pontosNos > 0 && setPontosNos(pontosNos - 1)
  const removerEles = () => pontosEles > 0 && setPontosEles(pontosEles - 1)

  return (
    <div className="container">
      <div className="aviso-rotacao">
        <div className="aviso-conteudo">
          <span className="icone-girar">🔄</span>
          <h2>Vire o celular!</h2>
          <p>O marcador funciona melhor com a tela deitada na mesa.</p>
        </div>
      </div>

      <button className="btn-menu" onClick={() => setMenuAberto(true)}>☰</button>

      <aside className={`sidebar ${menuAberto ? 'aberto' : ''}`}>
        <button className="btn-fechar" onClick={() => setMenuAberto(false)}>✖</button>
        <div className="sidebar-conteudo">
          <h3>Configurações</h3>
          <div className="seletor-limite">
            <span className="label-limite">Meta:</span>
            <button className={limitePontos === 12 ? 'ativo' : ''} onClick={() => setLimitePontos(12)}>12</button>
            <button className={limitePontos === 15 ? 'ativo' : ''} onClick={() => setLimitePontos(15)}>15</button>
            <button className={limitePontos === 24 ? 'ativo' : ''} onClick={() => setLimitePontos(24)}>24</button>
            <button className={limitePontos === 30 ? 'ativo' : ''} onClick={() => setLimitePontos(30)}>30</button>
          </div>
          <div className="painel-timer">
            <span className="relogio">⏱ {formatarTempo(tempoDecorrido)}</span>
            <div className="controles-timer">
              <button onClick={() => setTimerAtivo(!timerAtivo)}>{timerAtivo ? '⏸ Pausar' : '▶ Retomar'}</button>
              <button onClick={() => setTempoDecorrido(0)}>🔄 Zerar</button>
            </div>
          </div>
          {historico.length > 0 && (
            <div className="historico">
              <h3>Histórico de Partidas</h3>
              <ul>
                {historico.map((partida, i) => (
                  <li key={i}>
                    <strong>{partida.vencedor}</strong> ({partida.placar}) <br/>
                    <small>⏱ <em>{partida.duracao}</em></small>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </aside>

      <main className="mesa-truco">
        
        {/* LADO ESQUERDO: NÓS */}
        <div className="time lado-nos">
          <div className="cabecalho-time">
            <span className="vitorias">🏆 {vitoriasNos}</span>
            <input type="text" value={nomeNos} onChange={(e) => setNomeNos(e.target.value)} className="input-nome" />
          </div>
          
          <div className="area-jogo">
            {/* Barra de atalhos rápidos na borda */}
            <div className="atalhos-rapidos">
              <button onClick={() => adicionarNos(2)}>+2</button>
              <button onClick={() => adicionarNos(3)}>+3</button>
              <button onClick={() => adicionarNos(4)}>+4</button>
              <button onClick={() => adicionarNos(calcularFaltaEnvido())} className="btn-fe">FE</button>
            </div>

            {/* O centro inteiro continua sendo um botão gigante de +1 */}
            <div className="area-centro" onClick={() => adicionarNos(1)}>
              <h1 className="pontuacao">{pontosNos}</h1>
              <span className="dica-toque">Toque para +1</span>
            </div>
          </div>
          
          <button className="btn-remover" onClick={removerNos}>- 1 Ponto</button>
        </div>

        {/* LADO DIREITO: ELES */}
        <div className="time lado-eles">
          <div className="cabecalho-time">
            <input type="text" value={nomeEles} onChange={(e) => setNomeEles(e.target.value)} className="input-nome" />
            <span className="vitorias">🏆 {vitoriasEles}</span>
          </div>
          
          <div className="area-jogo">
            <div className="area-centro" onClick={() => adicionarEles(1)}>
              <h1 className="pontuacao">{pontosEles}</h1>
              <span className="dica-toque">Toque para +1</span>
            </div>
            
            <div className="atalhos-rapidos">
              <button onClick={() => adicionarEles(2)}>+2</button>
              <button onClick={() => adicionarEles(3)}>+3</button>
              <button onClick={() => adicionarEles(4)}>+4</button>
              <button onClick={() => adicionarEles(calcularFaltaEnvido())} className="btn-fe">FE</button>
            </div>
          </div>

          <button className="btn-remover" onClick={removerEles}>- 1 Ponto</button>
        </div>

      </main>
    </div>
  )
}

export default App