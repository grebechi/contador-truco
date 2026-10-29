import { useState, useEffect } from 'react'
import './App.css'

type Lado = 'nos' | 'eles'

function App() {
  const [pontosNos, setPontosNos] = useState(0)
  const [pontosEles, setPontosEles] = useState(0)
  const [nomeNos, setNomeNos] = useState('Nós')
  const [nomeEles, setNomeEles] = useState('Eles')
  const [limitePontos, setLimitePontos] = useState(24)
  const [vitoriasNos, setVitoriasNos] = useState(0)
  const [vitoriasEles, setVitoriasEles] = useState(0)
  const [tempoDecorrido, setTempoDecorrido] = useState(0)
  const [timerAtivo, setTimerAtivo] = useState(true)
  const [menuAberto, setMenuAberto] = useState(false)
  const [historico, setHistorico] = useState<{ idVencedor: Lado, placar: string, duracao: string }[]>([])
  const [modalVitoria, setModalVitoria] = useState<{ idVencedor: Lado, ptsVencedor: number, ptsPerdedor: number, tempo: string } | null>(null)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [mostrarBtnFullscreen, setMostrarBtnFullscreen] = useState(true);

  useEffect(() => {
    let intervalo: ReturnType<typeof setInterval>;
    if (timerAtivo) {
      intervalo = setInterval(() => setTempoDecorrido(t => t + 1), 1000)
    }
    return () => clearInterval(intervalo)
  }, [timerAtivo])

  useEffect(() => {
  const lidarComMudancaFullscreen = () => {
    setIsFullscreen(!!document.fullscreenElement)
  }

  document.addEventListener('fullscreenchange', lidarComMudancaFullscreen)
  return () => document.removeEventListener('fullscreenchange', lidarComMudancaFullscreen)
}, [])

const alternarTelaCheia = () => {
  if (!document.fullscreenElement) {
    if (document.documentElement.requestFullscreen) {
      document.documentElement.requestFullscreen().catch((err) => {
        console.error('Erro ao ativar tela cheia:', err)
      })
    } else {
      alert('O modo tela cheia não é suportado neste navegador. Se estiver no iPhone, adicione o app à Tela Inicial para rodar em tela cheia!')
    }
  } else {
    if (document.exitFullscreen) {
      document.exitFullscreen().catch((err) => {
        console.error('Erro ao sair da tela cheia:', err)
      })
    }
  }
}

useEffect(() => {

  const isIPhone = /iPhone/i.test(navigator.userAgent);
  
  const isPWA = window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone;
  
  if ((isIPhone && !isPWA) || isPWA) {
    setMostrarBtnFullscreen(false);
  } else {

    const doc = document.documentElement as any;
    const suportaAPI = doc.requestFullscreen || doc.webkitRequestFullscreen || doc.msRequestFullscreen;
    setMostrarBtnFullscreen(!!suportaAPI);
  }
}, []);

useEffect(() => {
  let wakeLock: WakeLockSentinel | null = null;

  const solicitarTelaAtiva = async () => {
    try {
      if ('wakeLock' in navigator && document.visibilityState === 'visible') {
        wakeLock = await navigator.wakeLock.request('screen');
      }
    } catch (err) {
      console.log('Wake Lock negado ou não suportado no contexto atual:', err);
    }
  };

  solicitarTelaAtiva();

  const aoTocarTela = () => {
    if (!wakeLock) {
      solicitarTelaAtiva();
    }
  };

  const lidarComMudancaVisibilidade = () => {
    if (document.visibilityState === 'visible') {
      solicitarTelaAtiva();
    }
  };

  window.addEventListener('touchstart', aoTocarTela, { once: false });
  window.addEventListener('click', aoTocarTela, { once: false });
  document.addEventListener('visibilitychange', lidarComMudancaVisibilidade);

  return () => {
    if (wakeLock) {
      wakeLock.release().catch(() => {});
    }
    window.removeEventListener('touchstart', aoTocarTela);
    window.removeEventListener('click', aoTocarTela);
    document.removeEventListener('visibilitychange', lidarComMudancaVisibilidade);
  };
}, []);

  const formatarTempo = (segundos: number) => {
    const min = Math.floor(segundos / 60)
    const seg = segundos % 60
    return `${min.toString().padStart(2, '0')}:${seg.toString().padStart(2, '0')}`
  }

  const finalizarPartida = (idVencedor: Lado, ptsNos: number, ptsEles: number) => {
    const tempo = formatarTempo(tempoDecorrido)
    const maior = Math.max(ptsNos, ptsEles)
    const menor = Math.min(ptsNos, ptsEles)
    
    setTimerAtivo(false)
    
    idVencedor === 'nos' ? setVitoriasNos(vitoriasNos + 1) : setVitoriasEles(vitoriasEles + 1)
    
    setHistorico([...historico, { idVencedor, placar: `${maior} a ${menor}`, duracao: tempo }])
    
    setModalVitoria({
      idVencedor,
      ptsVencedor: maior,
      ptsPerdedor: menor,
      tempo
    })
  }

  const iniciarNovaPartida = () => {
    setModalVitoria(null)
    setPontosNos(0)
    setPontosEles(0)
    setTempoDecorrido(0)
    setTimerAtivo(true)
  }

  const excluirPartida = (index: number) => {
    if (window.confirm("Deseja excluir esta partida do histórico?")) {
      const partida = historico[index]
      
      if (partida.idVencedor === 'nos') {
        setVitoriasNos(prev => Math.max(0, prev - 1))
      } else {
        setVitoriasEles(prev => Math.max(0, prev - 1))
      }

      const novoHistorico = historico.filter((_, i) => i !== index)
      setHistorico(novoHistorico)
    }
  }

  const calcularFaltaEnvido = () => {
    const maior = Math.max(pontosNos, pontosEles)
    return maior < (limitePontos / 2) ? limitePontos : limitePontos - maior
  }

  const adicionarNos = (pontos: number) => {
    const novos = pontosNos + pontos
    novos >= limitePontos ? finalizarPartida('nos', novos, pontosEles) : setPontosNos(novos)
  }

  const adicionarEles = (pontos: number) => {
    const novos = pontosEles + pontos
    novos >= limitePontos ? finalizarPartida('eles', pontosNos, novos) : setPontosEles(novos)
  }

  const removerNos = (e: React.MouseEvent | React.TouchEvent) => {
    e.stopPropagation(); // Impede que o clique suba para a div pai (+1)
    if (pontosNos > 0) setPontosNos(prev => prev - 1);
  }

  const removerEles = (e: React.MouseEvent | React.TouchEvent) => {
    e.stopPropagation(); // Impede que o clique suba para a div pai (+1)
    if (pontosEles > 0) setPontosEles(prev => prev - 1);
  }
  const alguemNasBoas = Math.max(pontosNos, pontosEles) >= limitePontos / 2;

  return (
    <div className="container">
      <div className="aviso-rotacao">
        <div className="aviso-conteudo">
          <span className="icone-girar">🔄</span>
          <h2>Vire o celular!</h2>
          <p>O marcador funciona melhor com a tela deitada na mesa.</p>
        </div>
      </div>

      {modalVitoria && (
        <div className="modal-overlay">
          <div className="modal-vitoria">
            <h2>🏆 Fim de Jogo!</h2>
            <h1 className="destaque-vencedor">
              {modalVitoria.idVencedor === 'nos' ? nomeNos : nomeEles} Venceu!
            </h1>
            
            <p className="placar-partida">Placar: {modalVitoria.ptsVencedor} x {modalVitoria.ptsPerdedor}</p>
            <p className="tempo-partida">Duração: {modalVitoria.tempo}</p>

            <div className="divisor"></div>

            <h3>Placar Global</h3>
            <div className="placar-global">
              <div className={modalVitoria.idVencedor === 'nos' ? 'ganhador-global' : ''}>
                <span>{nomeNos}</span>
                <strong>{vitoriasNos}</strong>
              </div>
              <div className="vs">x</div>
              <div className={modalVitoria.idVencedor === 'eles' ? 'ganhador-global' : ''}>
                <span>{nomeEles}</span>
                <strong>{vitoriasEles}</strong>
              </div>
            </div>

            <button className="btn-nova-partida" onClick={iniciarNovaPartida}>
              Nova Partida
            </button>
          </div>
        </div>
      )}

      <button className={`btn-menu ${menuAberto ? 'escondido' : ''}`} onClick={() => setMenuAberto(true)}>☰</button>

      <div className={`overlay-sidebar ${menuAberto ? 'ativa' : ''}`} onClick={() => setMenuAberto(false)}></div>

      <aside className={`sidebar ${menuAberto ? 'aberta' : ''}`}>
        <button className="btn-fechar" style={{ background: 'transparent', border: 'none', color: 'white', fontSize: '20px', cursor: 'pointer', float: 'right' }} onClick={() => setMenuAberto(false)}>✖</button>
        <div className="sidebar-conteudo">
          <h3>Configurações</h3>
          <div className="seletor-limite" style={{ marginBottom: '20px' }}>
            <span className="label-limite">Meta: </span>
            <button className={limitePontos === 12 ? 'ativo' : ''} onClick={() => setLimitePontos(12)}>12</button>
            <button className={limitePontos === 15 ? 'ativo' : ''} onClick={() => setLimitePontos(15)}>15</button>
            <button className={limitePontos === 24 ? 'ativo' : ''} onClick={() => setLimitePontos(24)}>24</button>
            <button className={limitePontos === 30 ? 'ativo' : ''} onClick={() => setLimitePontos(30)}>30</button>
          </div>
          
          <div className="painel-timer" style={{ marginBottom: '20px', padding: '10px', background: 'rgba(0,0,0,0.3)', borderRadius: '8px' }}>
            <span className="relogio" style={{ fontSize: '24px', display: 'block', marginBottom: '10px' }}>⏱ {formatarTempo(tempoDecorrido)}</span>
            <div className="controles-timer" style={{ display: 'flex', gap: '10px' }}>
              <button onClick={() => setTimerAtivo(!timerAtivo)} style={{ padding: '5px 10px', cursor: 'pointer' }}>{timerAtivo ? '⏸ Pausar' : '▶ Retomar'}</button>
              <button onClick={() => setTempoDecorrido(0)} style={{ padding: '5px 10px', cursor: 'pointer' }}>🔄 Zerar</button>
            </div>
          </div>
          
          {historico.length > 0 && (
            <div className="historico">
              <h3>Histórico de Partidas</h3>
              <ul>
                {historico.map((partida, i) => {
                  const venceuNos = partida.idVencedor === 'nos'
                  const nomeExibicao = venceuNos ? nomeNos : nomeEles
                  
                  return (
                    <li key={i} className={venceuNos ? 'hist-nos' : 'hist-eles'}>
                      <div className="hist-info">
                        <strong>{nomeExibicao}</strong> ({partida.placar}) <br/>
                        <small>⏱ <em>{partida.duracao}</em></small>
                      </div>
                      <button 
                        className="btn-excluir-hist" 
                        onClick={() => excluirPartida(i)}
                        title="Excluir partida"
                      >
                        🗑️
                      </button>
                    </li>
                  )
                })}
              </ul>
              
              <div className="historico-global">
                <h4>Placar Global</h4>
                <p>
                  <span className="cor-nos">{nomeNos}: {vitoriasNos}</span>
                  <span className="divisor-global">|</span>
                  <span className="cor-eles">{nomeEles}: {vitoriasEles}</span>
                </p>
              </div>
            </div>
          )}

          <button className="btn-recarregar" onClick={() => window.location.reload()}>
            Recarregar Página
          </button>

          {mostrarBtnFullscreen && (
          <button className="btn-fullscreen" onClick={alternarTelaCheia}>
            {isFullscreen ? 'Sair da Tela Cheia' : '⛶ Tela Cheia'}
          </button>
          )}

          <div className="sidebar-footer">
            Feito por <a href="https://github.com/grebechi" target="_blank" rel="noopener noreferrer">Gabriel Rebechi</a>
          </div>
        </div>
      </aside>

      <main className="mesa-truco">
        <div className="time lado-nos">
          <div className="cabecalho-time">
            <span className="vitorias">🏆 {vitoriasNos}</span>
            <input type="text" value={nomeNos} onChange={(e) => setNomeNos(e.target.value)} className="input-nome" />
          </div>
          
          <div className="area-jogo">
            <div className="atalhos-rapidos">
              <button onClick={() => adicionarNos(2)}>+2</button>
              <button onClick={() => adicionarNos(3)}>+3</button>
              <button onClick={() => adicionarNos(4)}>+4</button>
              <button onClick={() => adicionarNos(calcularFaltaEnvido())} className="btn-fe" disabled={!alguemNasBoas}>FE</button>
              <button className="btn-remover" onClick={removerNos} disabled={pontosNos === 0}>-1 Ponto</button>
            </div>
            <div className="area-centro" onClick={() => adicionarNos(1)}>
              <h1 className="pontuacao">{pontosNos}</h1>
              <span className="dica-toque">Toque para +1</span>
            </div>
          </div>
          
        </div>

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
              <button onClick={() => adicionarEles(calcularFaltaEnvido())} className="btn-fe" disabled={!alguemNasBoas}>FE</button>
              <button className="btn-remover" onClick={removerEles} disabled={pontosEles === 0}>-1 Ponto</button>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default App