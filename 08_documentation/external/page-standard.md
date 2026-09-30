# NEXA Studio — Standard for New GitHub Pages

## Regra permanente do projeto

Toda nova página publicada no GitHub Pages que **não tenha finalidade educacional** deve, por padrão:

1. utilizar referências visuais e estilos do **NEXA Studio**;
2. carregar a linguagem visual oficial (tipografia, grid, paleta e componentes reutilizáveis) quando aplicável;
3. incluir o **contador público de visitantes NEXA**;
4. manter consistência responsiva desktop/mobile;
5. preservar a identificação do projeto e seus créditos;
6. não aplicar esta regra a páginas explicitamente classificadas como **educacionais**.

## Implementação recomendada

```html
<link rel="stylesheet" href="css/visual-consistency.css">
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
