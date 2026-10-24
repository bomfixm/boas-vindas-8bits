# Prompt para continuar o projeto no Claude

Quero que você continue o meu projeto de uma tela de boas-vindas para a igreja, com nossos músicos representados como personagens de um jogo em pixel art. Responda em português e implemente as melhorias, em vez de entregar apenas um plano.

Repositório: https://github.com/bomfixm/boas-vindas-8bits
Site: https://bomfixm.github.io/boas-vindas-8bits/

## Leia o projeto antes de editar

A versão atual é um site estático em HTML, CSS e JavaScript, sem instalação ou compilação. `index.html`, `styles.css` e `app.js` controlam um player com reprodução, pausa, reinício, linha do tempo, repetição, capítulos por músico e modo telão. `assets/boas-vindas.mp4` é uma animação silenciosa de 32 segundos, 1280 × 720, 60 fps. Hoje a página reproduz esse vídeo; os personagens ainda não são animados em tempo real pelo navegador.

O arquivo `fontes-da-animacao.zip` contém artes dos personagens, folhas de sprites adicionais, camadas de instrumentos e os arquivos usados na composição da animação. Extraia e inspecione seu conteúdo antes de escolher a implementação. O renderizador de referência usa Python, Pillow, NumPy e FFmpeg. Há um README no pacote com sua estrutura.

## O que quero melhorar

Quero uma animação realmente fluida e convincente, preservando a identidade de cada pessoa. Uma versão anterior ficou aos trancos e foi rejeitada. Aumentar o FPS do arquivo não resolveu as poses inconsistentes. A versão atual usa camadas estáveis e movimentos contínuos, mas é uma base para melhorar os ciclos e as transições.

Priorize caminhar com apoio dos pés no chão, articulação natural, passagem suave entre andar/parar/tocar, mãos coerentes com cada instrumento e cabos acompanhando os movimentos. Use poses intermediárias ou articulação de partes quando necessário. Evite deslizar personagens inteiros como figuras imóveis, comprimir o corpo horizontalmente para simular viradas ou deformar rostos. Não use simples dissolvências como substituto de movimento.

Se for adequado, implemente a cena em Canvas 2D com `requestAnimationFrame`, tempo em segundos e movimentos independentes da taxa de atualização. Mantenha o vídeo existente disponível enquanto a nova cena não estiver validada. Preserve a simplicidade do site, os controles e a compatibilidade com GitHub Pages; não adicione backend, login ou dependências grandes sem necessidade.

## Direção visual obrigatória

Referência: linguagem de personagens de Dan the Man, com proporções de cabeça grande, contornos escuros, paleta limitada e pixels bem visíveis. O objetivo é criar nossos personagens, e não copiar os personagens do jogo. A folha do Sonic foi apenas uma referência para organizar sprites; não quero Sonic na animação.

Mantenha a escala lógica dos pixels consistente. Mais quadros de movimento não significam mais detalhe na arte. Não transforme os instrumentos em fotografias, não aplique desfoque ou suavização às bordas e não altere rosto, roupa, tamanho ou cores entre quadros. A bateria pode conservar o detalhamento maior que já foi aprovado. Use escala inteira e `imageSmoothingEnabled = false` quando aplicável.

## Personagens e ações

1. **Guitarrista:** cabelo castanho curto e bagunçado, óculos, bigode fino e pequeno cavanhaque; roupa social escura, gravata vinho e guitarra elétrica branca. Entra andando com a guitarra presa pela correia, para e toca. A guitarra permanece com ele durante o deslocamento. As direções desejadas incluem frente e ambos os lados.
2. **Baterista:** um pouco gordinho, cabelo escuro curto, bigode fino, roupa social preta e tênis brancos. Entra carregando a bateria inteira acima da cabeça, arremessa o conjunto no chão de forma cômica, espera o impacto, senta e toca. Bateria vinho, pratos dourados e ferragens escuras. Não pode ficar carregando a bateria enquanto toca. Para uma futura saída, levanta, pega o conjunto acima da cabeça, vira e leva embora.
3. **Cantora:** cabelo escuro longo e cacheado, camiseta preta, jeans claros largos, tênis brancos e colar prateado. **Não usa óculos.** Entra com microfone na mão e fio acompanhando o deslocamento; para e canta. O cabo precisa continuar conectado ao microfone, com folga coerente no chão.
4. **Tecladista e vocalista:** cabelo castanho cacheado na altura dos ombros, regata cinza, calça e sapatos pretos, colar e relógio. Pele em tom bege claro natural, com calor moderado; não muito branca e nem alaranjada. **Não usa óculos.** Entra arrastando o teclado pelo chão, com o suporte em X e microfone no pedestal, posiciona o conjunto e depois toca e canta. Preserve a mesma geometria do equipamento durante toda a sequência.

As chegadas acontecem **uma por vez**, nesta ordem. Quem já chegou continua tocando. Ao final, os quatro ficam juntos, com a mensagem “Sejam bem-vindos!” e “Que bom ter você aqui”. A composição deve funcionar como uma tela de TV/jogo retrô e também em um projetor. Não invente nome de igreja, nomes dos músicos, logotipo ou trilha sonora.

## Verificação e entrega

Teste reprodução, pausa, reinício, repetição, capítulos/linha do tempo, modo telão, tela pequena, teclado e carregamento dos arquivos no caminho de um repositório do GitHub Pages. Respeite preferência por movimento reduzido. Verifique a sequência inteira; contar FPS não basta. Confirme que os pés não patinam, que ninguém muda de aparência e que os instrumentos não pulam de posição.

Faça alterações no repositório indicado, preserve os arquivos originais úteis e explique em poucas palavras o que mudou, o que você testou e o que ainda precisa de ajuste. Se algum material essencial estiver faltando, diga exatamente qual. Fora isso, tome decisões práticas e avance até entregar uma versão funcional.
