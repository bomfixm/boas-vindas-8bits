# Boas-vindas em 8 bits

Pequeno site com a cena dos quatro músicos chegando em sequência: guitarrista, baterista, cantora e tecladista. Feito em HTML, CSS e JavaScript, sem dependências de instalação ou compilação.

## Usar

Abra `index.html` no navegador ou sirva a pasta com um servidor de arquivos estáticos. A cena tem 38 segundos, não tem áudio e é desenhada em tempo real num canvas de 320 × 180 pixels, ampliado sem borrar. Em telas de 1280 × 720, 1920 × 1080 e 3840 × 2160 cada pixel da arte vira um bloco exato.

- Reproduzir, pausar, recomeçar e escolher um ponto na linha do tempo.
- Saltar diretamente para a chegada de cada músico.
- Ativar ou desativar a repetição.
- Usar o modo telão, inclusive para projetar a recepção na igreja. Enquanto a cena roda, o navegador é avisado para não apagar a tela, quando ele permite.
- Baixar o vídeo em 1920 × 1080 para passar direto na TV.

Atalhos: espaço para reproduzir/pausar, R para recomeçar, F para o modo telão e setas para avançar/voltar cinco segundos. O início automático é desativado quando o navegador indica preferência por movimento reduzido. Nesse caso aparece a banda completa, parada.

A versão anterior do site, com o vídeo antigo, continua em `anterior/`.

## Publicar no GitHub Pages

Em um repositório com GitHub Pages disponível, acesse **Settings → Pages**, selecione **Deploy from a branch**, escolha `main` e a pasta `/ (root)` e salve. Todos os caminhos são relativos, permitindo servir o projeto em um subdiretório.

## Arquivos

- `index.html`, `styles.css` e `app.js` compõem a página.
- `assets/cena/` tem o cenário (`palco.png`), os desenhos dos músicos (`sprites.png`) e as trilhas da cena (`dados.js`). Esses três arquivos são gerados por `pixel-art/fonte/exportar_site.py` a partir da cena aprovada. Não edite à mão.
- `assets/boas-vindas-8bits-1080p.mp4` é a mesma cena em vídeo.
- `anterior/`, `assets/boas-vindas.mp4` e `assets/cena.png` são a versão anterior.

A animação foi criada a partir das referências dos músicos fornecidas pelo dono do projeto.
