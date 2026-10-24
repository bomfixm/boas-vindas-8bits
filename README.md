# Boas-vindas em 8 bits

Pequeno site com a animação dos quatro músicos chegando em sequência. Feito em HTML, CSS e JavaScript, sem dependências de instalação ou compilação.

## Usar

Abra `index.html` no navegador ou sirva a pasta com um servidor de arquivos estáticos. A animação tem 32 segundos, 1280 × 720, 60 fps e não contém áudio.

- Reproduzir, pausar, recomeçar e escolher um ponto na linha do tempo.
- Saltar diretamente para a chegada de cada músico.
- Ativar ou desativar a repetição.
- Usar o modo telão, inclusive para projetar a recepção na igreja.
- Baixar o vídeo original.

Atalhos: espaço para reproduzir/pausar, R para recomeçar, F para tela cheia e setas para avançar/voltar cinco segundos. O início automático é desativado quando o navegador indica preferência por movimento reduzido.

## Publicar no GitHub Pages

Em um repositório com GitHub Pages disponível, acesse **Settings → Pages**, selecione **Deploy from a branch**, escolha `main` e a pasta `/ (root)` e salve. Todos os caminhos são relativos, permitindo servir o projeto em um subdiretório.

## Arquivos

`index.html`, `styles.css` e `app.js` compõem a página. `assets/boas-vindas.mp4` é o vídeo e `assets/cena.png` é a capa. A animação foi criada a partir das referências dos músicos fornecidas pelo dono do projeto.
