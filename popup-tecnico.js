/*
 * POPUP TÉCNICO — injeção para o 3DVista
 *
 * Carregar (nesta ordem) no tour:  conteudo-popup.js  e  popup-tecnico.js
 *
 * Uso nas ações dos hotspots (JavaScript):
 *   PopupTecnico.gas();                 // uma função por categoria
 *   PopupTecnico.abrir('gas');          // equivalente, pelo nome da categoria
 *   PopupTecnico.abrir('gas', 'escuro');// tema escuro (padrão: 'claro')
 *   PopupTecnico.fechar();
 *
 * Categorias: detalhes, lampada, agua, gas, esgoto, estruturaViga, estruturaPilar,
 *             forro, enchimentoHidroSanitario, quadroEletrico, redeFrigorigena
 *
 * Caminho dos assets: por padrão a pasta "assets/" ao lado deste script.
 * Para mudar:  PopupTecnico.config.caminhoAssets = 'https://.../assets/';
 */
(function (global) {
  'use strict';

  var scriptAtual = document.currentScript;

  // Ícone por categoria (arquivos em assets/icones/)
  var ICONES = {
    detalhes: 'detalhes-normal.png',
    lampada: 'lampada-normal.png',
    agua: 'agua-normal.png',
    gas: 'gas-normal.png',
    esgoto: 'esgoto-normal.png',
    estruturaViga: 'estrutura-normal.png',
    estruturaPilar: 'estrutura-normal.png',
    forro: 'forro-normal.png',
    enchimentoHidroSanitario: 'esgoto-normal.png',
    quadroEletrico: 'energia-eletrica-normal.png',
    redeFrigorigena: 'frigorígena-normal.png'
  };

  // Cores definidas: claro = F9F7F7 / 0F2739, escuro = inverso
  var TEMAS = {
    claro:  { fundo: '#F9F7F7', texto: '#0F2739', faixa: 'img-popup/popup1.png' },
    escuro: { fundo: '#0F2739', texto: '#F9F7F7', faixa: 'img-popup/popup2.png' }
  };

  var config = {
    caminhoAssets: caminhoPadrao(),
    temaPadrao: 'claro',
    textoVazio: 'Informações em breve.'
  };

  var els = null;        // { overlay, painel, icone, titulo, corpo, fechar }
  var focoAnterior = null;

  function caminhoPadrao() {
    if (scriptAtual && scriptAtual.src) {
      return scriptAtual.src.replace(/[^\/]*(\?.*)?$/, '') + 'assets/';
    }
    return 'assets/';
  }

  function url(relativo) {
    return encodeURI(config.caminhoAssets + relativo);
  }

  function css() {
    var b = function (n) { return 'url("' + url('botao-close/close-' + n + '-dia.png') + '")'; };
    return [
      '.pt-overlay{position:fixed;inset:0;z-index:2147483000;display:none;align-items:center;justify-content:center;',
      '  padding:24px;background:rgba(0,0,0,.45);box-sizing:border-box;touch-action:none}',
      '.pt-overlay.pt-aberto{display:flex}',
      '.pt-painel{position:relative;box-sizing:border-box;width:min(839px,100%);aspect-ratio:839/585;max-height:100%;',
      '  background:var(--pt-fundo);color:var(--pt-texto);display:flex;',
      '  box-shadow:0 6px 14px rgba(0,0,0,.35);font-family:inherit;touch-action:auto}',
      '.pt-conteudo{flex:1 1 auto;min-width:0;display:flex;flex-direction:column;padding:32px 36px 28px 40px}',
      '.pt-cabecalho{display:flex;align-items:center;gap:16px;margin-bottom:20px;padding-right:56px}',
      '.pt-icone{width:62px;height:62px;flex:none}',
      '.pt-titulo{margin:0;font-size:28px;line-height:1.15;font-weight:700;color:var(--pt-texto)}',
      '.pt-corpo{flex:1 1 auto;overflow:auto;-webkit-overflow-scrolling:touch;font-size:17px;line-height:1.5;color:var(--pt-texto)}',
      '.pt-corpo img{max-width:100%;height:auto}',
      '.pt-vazio{opacity:.6;font-style:italic}',
      '.pt-faixa{flex:none;width:42px;background:var(--pt-faixa) center/cover repeat-y}',
      '.pt-fechar{position:absolute;top:-10px;right:-8px;width:75px;height:75px;padding:0;border:0;cursor:pointer;',
      '  background:' + b('normal') + ' center/contain no-repeat;-webkit-tap-highlight-color:transparent}',
      '.pt-fechar:hover{background-image:' + b('hover') + '}',
      '.pt-fechar:active{background-image:' + b('pressed') + '}',
      '.pt-fechar:focus-visible{outline:2px solid var(--pt-texto);outline-offset:2px}',
      /* tablet / celular */
      '@media (max-width:768px){',
      '  .pt-overlay{padding:16px 16px 16px 12px}',
      '  .pt-painel{aspect-ratio:auto;width:100%;height:auto;max-height:86%;min-height:50%}',
      '  .pt-conteudo{padding:20px 16px 18px 20px}',
      '  .pt-cabecalho{gap:12px;margin-bottom:14px;padding-right:44px}',
      '  .pt-icone{width:48px;height:48px}',
      '  .pt-titulo{font-size:21px}',
      '  .pt-corpo{font-size:15px}',
      '  .pt-faixa{width:24px}',
      '  .pt-fechar{width:52px;height:52px;top:-8px;right:-6px}',
      '}',
      /* celular em paisagem (pouca altura) */
      '@media (max-height:480px) and (orientation:landscape){',
      '  .pt-overlay{padding:10px}',
      '  .pt-painel{max-height:100%;min-height:0;width:min(839px,92%)}',
      '  .pt-conteudo{padding:14px 16px 12px 20px}',
      '  .pt-icone{width:40px;height:40px}',
      '  .pt-titulo{font-size:18px}',
      '}'
    ].join('\n');
  }

  function montar() {
    if (els) return;

    var estilo = document.createElement('style');
    estilo.id = 'pt-estilo';
    estilo.textContent = css();
    document.head.appendChild(estilo);

    var overlay = document.createElement('div');
    overlay.className = 'pt-overlay';
    overlay.innerHTML =
      '<div class="pt-painel" role="dialog" aria-modal="true" aria-labelledby="pt-titulo">' +
        '<div class="pt-conteudo">' +
          '<div class="pt-cabecalho">' +
            '<img class="pt-icone" alt="">' +
            '<h2 class="pt-titulo" id="pt-titulo"></h2>' +
          '</div>' +
          '<div class="pt-corpo"></div>' +
        '</div>' +
        '<div class="pt-faixa"></div>' +
        '<button type="button" class="pt-fechar" aria-label="Fechar"></button>' +
      '</div>';
    document.body.appendChild(overlay);

    els = {
      overlay: overlay,
      painel: overlay.querySelector('.pt-painel'),
      icone: overlay.querySelector('.pt-icone'),
      titulo: overlay.querySelector('.pt-titulo'),
      corpo: overlay.querySelector('.pt-corpo'),
      fechar: overlay.querySelector('.pt-fechar')
    };

    // clique fora fecha; eventos não vazam para o tour (arrastar/zoom do panorama)
    overlay.addEventListener('click', function (e) { if (e.target === overlay) fechar(); });
    ['mousedown', 'mouseup', 'touchstart', 'touchend', 'wheel', 'pointerdown', 'pointerup'].forEach(function (ev) {
      overlay.addEventListener(ev, function (e) { e.stopPropagation(); }, { passive: true });
    });
    els.fechar.addEventListener('click', fechar);
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && els.overlay.classList.contains('pt-aberto')) fechar();
    });
  }

  function preencher(categoria) {
    var dados = (global.PopupTecnicoConteudo || {})[categoria] || {};
    els.titulo.textContent = dados.titulo || '';
    els.corpo.innerHTML = '';
    els.corpo.scrollTop = 0;

    if (typeof dados.render === 'function') {
      dados.render(els.corpo, categoria);
    } else if (dados.html) {
      els.corpo.innerHTML = dados.html;
    } else {
      var p = document.createElement('p');
      p.className = 'pt-vazio';
      p.textContent = config.textoVazio;
      els.corpo.appendChild(p);
    }
  }

  function abrir(categoria, tema) {
    if (!ICONES[categoria]) {
      categoria = 'detalhes'; // uso geral quando não houver categoria específica
    }
    montar();

    var t = TEMAS[tema] || TEMAS[config.temaPadrao] || TEMAS.claro;
    els.painel.style.setProperty('--pt-fundo', t.fundo);
    els.painel.style.setProperty('--pt-texto', t.texto);
    els.painel.style.setProperty('--pt-faixa', 'url("' + url(t.faixa) + '")');
    els.icone.src = url('icones/' + ICONES[categoria]);

    preencher(categoria);

    focoAnterior = document.activeElement;
    els.overlay.classList.add('pt-aberto');
    els.fechar.focus({ preventScroll: true });
  }

  function fechar() {
    if (!els) return;
    els.overlay.classList.remove('pt-aberto');
    if (focoAnterior && focoAnterior.focus) {
      try { focoAnterior.focus({ preventScroll: true }); } catch (e) { /* ignora */ }
    }
  }

  var api = { config: config, abrir: abrir, fechar: fechar };
  Object.keys(ICONES).forEach(function (cat) {
    api[cat] = function (tema) { abrir(cat, tema); };
  });

  global.PopupTecnico = api;
})(window);
