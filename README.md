# Marcador de Truco Digital

![Status](https://img.shields.io/badge/Status-Concluído-success)
![React](https://img.shields.io/badge/React-20232A?style=flat&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat&logo=typescript&logoColor=white)

Um placar digital moderno, rápido e responsivo para marcar pontos nas tuas partidas de Truco Gaúcho. Chega de usar feijões, palitos ou gastar papel! 

O grande diferencial deste projeto é a interface limpa e focada na usabilidade: **ele foi desenhado inicialmente para rodar em um iPad (ou tablets maiores) deitado no canto da mesa**, funcionando como um autêntico "tabuleiro digital" entre os jogadores. No entanto, o layout é **100% responsivo** e se adapta perfeitamente a qualquer celular.

---

## Principais Funcionalidades

- **Controle Rápido e Intuitivo:** Toque no centro da tela para somar `+1` ponto, ou use os botões de atalho para `+2`, `+3` e `+4` (ideal para quando gritam Truco, Retruco e Vale 4).

- **Falta Envido Automático (FE):** O botão "FE" calcula automaticamente os pontos necessários para fechar a partida com base no placar atual e no limite de pontos configurado. Ele só é ativado quando alguém está "nas boas".

- **Sistema de Remoção Animado:** Clicou errado? O botão `-1 Ponto` corrige a pontuação com uma animação de encolhimento e aviso visual em vermelho. Ele desativa automaticamente se o placar for zero.

- **Histórico e Placar Global:** Cada partida finalizada vai para um histórico (com os nomes dos times, placar final e duração da partida). Um placar global conta as vitórias totais de cada equipe.

- **Timer Integrado:** Saiba exatamente quanto tempo durou aquela partida disputada.

- **Tela Sempre Ativa:** Utiliza a *Wake Lock API* para impedir que a tela do dispositivo apague sozinha no meio do jogo.

- **Menu Lateral de Configurações:** Permite alterar a meta de pontos (12, 15, 24 ou 30), gerenciar o histórico (com opção de exclusão) e resetar completamente o app.

---

## Feito para telas grandes, mas roda em qualquer lugar

A disposição das informações foi pensada no formato "frente a frente" (Landscape). A ideia é abrir a aplicação no tablet, deitá-lo na mesa entre as duplas e jogar. 
Caso esteja usando um smartphone, o sistema sugere que você vire a tela na horizontal para ter a melhor experiência possível dos botões e atalhos.

---

## Como Rodar Localmente (Clone e Modifique!)

Este projeto é de código aberto. Sinta-se livre para clonar o repositório, estudar o código e personalizá-lo! Quer mudar as cores? Adicionar regras diferentes? Alterar as regras de pontuação? Fique à vontade!

### Pré-requisitos
- [Node.js](https://nodejs.org/) instalado.
- Gerenciador de pacotes (NPM, Yarn ou PNPM).
- Docker é opcional, mas facilita a sua vida!

### Guia de instalação

1. Clone o repositório:
```bash
git clone https://github.com/grebechi/contador-truco.git
```

2. Acesse a pasta do projeto:
```bash
cd contador-truco
```

3. Instale as dependências:
```bash
npm install
```

4. Rode o servidor de desenvolvimento:
```bash
npm run dev
```

5. (Opcional) Se preferir rodar o projeto dentro de um container do Docker, é só rodar o seguinte comando no terminal:
```bash
docker compose up --build
```

6. Abra o navegador no endereço indicado (geralmente http://localhost:5173).

### Teste o projeto agora mesmo

Se quiser testar o contador de pontos já em produção, pode acessar: https://truco-xi.vercel.app

