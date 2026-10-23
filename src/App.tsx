import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [pontosNos, setPontosNos] = useState(0)
  const [pontosEles, setPontosEles] = useState(0)
  const [nomeNos, setNomeNos] = useState('Nós')
  const [nomeEles, setNomeEles] = useState('Eles')
  const [limitePontos, setLimitePontos] = useState(12)
  const [vitoriasNos, setVitoriasNos] = useState(0)
  const [vitoriasEles, setVitoriasEles] = useState(0)
  const [tempoDecorrido, setTempoDecorrido] = useState(0)
  const [timerAtivo, setTimerAtivo] = useState(true)
  const [historico, setHistorico] = useState<{ vencedor: string, placar: string, duracao: string }[]>([])
  
  // NOVO ESTADO: Controle do Menu Hambúrguer
  const [menuAberto, setMenuAberto] = useState(false)

  useEffect(() => {
    let intervalo: ReturnType<typeof setInterval>;
    if (timerAtivo) {
      intervalo = setInterval(() => setTempoDecorrido(t => t + 1), 1000)
    }
    return () => clearInterval(intervalo)
  }, [timerAtivo])

  const formatarTempo = (segundosTotais: number) => {
    const min = Math.floor(segundosTotais / 60)
    const seg = segundosTotais % 60
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

  const adicionarNos = () => (pontosNos + 1 >= limitePontos ? finalizarPartida(nomeNos, pontosNos + 1, pontosEles) : setPontosNos(pontosNos + 1))
  const removerNos = () => pontosNos > 0 && setPontosNos(pontosNos - 1)
  const adicionarEles = () => (pontosEles + 1 >= limitePontos ? finalizarPartida(nomeEles, pontosNos, pontosEles + 1) : setPontosEles(pontosEles + 1))
  const removerEles = () => pontosEles > 0 && setPontosEles(pontosEles - 1)

  return (
    <div className="container">
      {/* Botão Hambúrguer flutuante */}
      <button className="btn-menu" onClick={() => setMenuAberto(true)}>☰</button>

      {/* Menu Lateral (Sidebar) */}
      <aside className={`sidebar ${menuAberto ? 'aberto' : ''}`}>
        <button className="btn-fechar" onClick={() => setMenuAberto(false)}>✖</button>
        
        <div className="sidebar-conteudo">
          <h3>Configurações</h3>
          <div className="seletor-limite">
            <span className="label-limite">Meta:</span>
            <button className={limitePontos === 12 ? 'ativo' : ''} onClick={() => setLimitePontos(12)}>12</button>
            <button className={limitePontos === 15 ? 'ativo' : ''} onClick={() => setLimitePontos(15)}>15</button>
            <button className={limitePontos === 24 ? 'ativo' : ''} onClick={() => setLimitePontos(24)}>24</button>
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
              <h3>Histórico</h3>
              <ul>
                {historico.map((partida, i) => (
                  <li key={i}><strong>{partida.vencedor}</strong> ({partida.placar}) - <em>{partida.duracao}</em></li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </aside>

      {/* A MESA DE JOGO */}
      <main className="mesa-truco">
        
        {/* LADO ESQUERDO: NÓS */}
        <div className="time lado-nos">
          <div className="cabecalho-time">
            <span className="vitorias">🏆 {vitoriasNos}</span>
            <input type="text" value={nomeNos} onChange={(e) => setNomeNos(e.target.value)} className="input-nome" />
          </div>
          
          {/* As áreas de clique (Hitboxes) ficam "atrás" do número */}
          <div className="hitboxes">
            <div className="hit-menos" onClick={removerNos}></div>
            <div className="hit-mais" onClick={adicionarNos}></div>
          </div>
          <h1 className="pontuacao">{pontosNos}</h1>
        </div>

        {/* LADO DIREITO: ELES */}
        <div className="time lado-eles">
          <div className="cabecalho-time">
            <input type="text" value={nomeEles} onChange={(e) => setNomeEles(e.target.value)} className="input-nome" />
            <span className="vitorias">🏆 {vitoriasEles}</span>
          </div>
          
          <div className="hitboxes">
            <div className="hit-menos" onClick={removerEles}></div>
            <div className="hit-mais" onClick={adicionarEles}></div>
          </div>
          <h1 className="pontuacao">{pontosEles}</h1>
        </div>

      </main>
    </div>
  )
}

export default App