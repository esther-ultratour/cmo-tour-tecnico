/*
 * CONTEÚDO DOS POPUPS — tour técnico
 *
 * Este é o único arquivo que precisa ser editado quando as informações chegarem.
 * Cada categoria aceita:
 *   titulo    : título exibido ao lado do ícone
 *   html      : conteúdo (string HTML: <p>, <ul>, <img>, <table>...)
 *   render    : (opcional) function(container, categoria) — monta o conteúdo por código;
 *               quando existir, substitui o "html"
 *
 * Enquanto "html" estiver vazio, o popup mostra a mensagem de "em breve".
 */
(function (global) {
  'use strict';

  global.PopupTecnicoConteudo = {
    detalhes:                { titulo: 'Detalhes',                 html: '' },
    lampada:                 { titulo: 'Ponto de luminária',       html: '' },
    agua:                    { titulo: 'Água fria',                html: '' },
    gas:                     { titulo: 'Gás',                      html: '' },
    esgoto:                  { titulo: 'Esgoto',                   html: '' },
    estruturaViga:           { titulo: 'Viga',                     html: '' },
    estruturaPilar:          { titulo: 'Pilar',                    html: '' },
    forro:                   { titulo: 'Forro',                    html: '' },
    enchimentoHidroSanitario:{ titulo: 'Enchimento hidro-sanitário', html: '' },
    quadroEletrico:          { titulo: 'Quadro elétrico',          html: '' },
    redeFrigorigena:         { titulo: 'Dreno - rede frigorígena', html: '' }
  };
})(window);
