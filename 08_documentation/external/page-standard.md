# NEXA Studio — Standard for New GitHub Pages

## Regra permanente do projeto

Toda nova página publicada no GitHub Pages que **não tenha finalidade educacional** deve, por padrão:

1. utilizar referências visuais e estilos do **NEXA Studio**;
2. carregar a linguagem visual oficial (tipografia, grid, paleta e componentes reutilizáveis) quando aplicável;
3. utilizar o **logo oficial NEXA Studio** em `assets/brand/nexa-studio-logo.svg` como assinatura de marca;
4. incluir o **contador público de visitantes NEXA**;
5. manter consistência responsiva desktop/mobile;
6. preservar a identificação do projeto e seus créditos;
7. não aplicar esta regra a páginas explicitamente classificadas como **educacionais**.

## Logo oficial

O arquivo `assets/brand/nexa-studio-logo.svg` é a versão vetorial oficial do logo fornecido para o projeto. O SVG preserva exatamente a arte da imagem aprovada, com fundo transparente e escala independente de resolução.

Em fundos escuros, pode-se utilizar a mesma arte com `filter: invert(1)` apenas como adaptação de contraste de apresentação; o arquivo-fonte permanece inalterado.

Exemplo:

```html
<a class="nexa-logo-lockup" href="index.html" aria-label="NEXA Studio">
  <img class="nexa-logo nexa-logo--inverse" src="assets/brand/nexa-studio-logo.svg" alt="NEXA Studio">
  <span class="nexa-logo-wordmark">NEXA<span>®</span></span>
</a>
```

## Implementação recomendada

```html
<link rel="stylesheet" href="css/visual-consistency.css">
<link rel="stylesheet" href="css/graphic-enhancement.css">
<link rel="stylesheet" href="css/visitor-counter.css">
<script src="js/visitor-counter.js" defer></script>
```

Elemento do contador:

```html
<span class="nexa-visitor-counter">
  <i class="nexa-visitor-counter__dot"></i>
  VISITAS <span data-nexa-visitor-count>—</span>
</span>
```

O contador utiliza um serviço externo de contagem para permitir funcionamento em hospedagem estática GitHub Pages, sem exigir backend próprio. O projeto não deve inserir tokens ou credenciais no frontend.

## Escopo

Esta regra vale para novas páginas do ecossistema NEXA Studio publicadas no GitHub Pages. Páginas educacionais ficam fora do padrão por decisão explícita de finalidade.
