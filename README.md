# cmo-func-tour-tecnico

Popup informativo para o **tour técnico** (3DVista). Ao clicar em um ícone (gás, água, esgoto...), abre um popup com as informações daquela categoria. Responsivo (desktop e mobile), com tema claro e escuro.

## Estrutura

```
popup-tecnico.js      # lógica, estilo e funções do popup
conteudo-popup.js     # conteúdo de cada categoria (editar aqui)
teste.html            # página para testar fora do 3DVista
assets/
  icones/             # ícone de cada categoria (canto superior esquerdo do popup)
  botao-close/        # botão de fechar (normal, hover, pressed)
  img-popup/          # faixa lateral de textura (tema claro e escuro)
  pop-up-1.png, pop-up-2.png   # modelos de referência
```

## 1. Função do Main Viewer (carregamento)

Executar **uma vez**, no Main Viewer do tour (ex.: ação ao iniciar o tour). Carrega o conteúdo e o popup, nesta ordem.

```js
(function () {
  var BASE = 'https://URL-DA-PASTA-POPUPS/'; // pasta onde estão os arquivos, com "/" no final

  function carregar(src, cb) {
    var s = document.createElement('script');
    s.src = BASE + src;
    s.onload = cb;
    document.head.appendChild(s);
  }

  carregar('conteudo-popup.js', function () {
    carregar('popup-tecnico.js', function () {
      PopupTecnico.config.caminhoAssets = BASE + 'assets/';
    });
  });
})();
```

> Troque `BASE` pela URL pública da pasta `popups/` no S3.

## 2. Funções por categoria (hotspots)

Cada ícone do tour chama a função da sua categoria na ação de clique ("Executar JavaScript").

| Ícone / categoria | Função |
|---|---|
| Detalhes (uso geral) | `PopupTecnico.detalhes();` |
| Lâmpada (ponto de luminária) | `PopupTecnico.lampada();` |
| Água fria | `PopupTecnico.agua();` |
| Gás | `PopupTecnico.gas();` |
| Esgoto | `PopupTecnico.esgoto();` |
| Estrutura – viga | `PopupTecnico.estruturaViga();` |
| Estrutura – pilar | `PopupTecnico.estruturaPilar();` |
| Forro | `PopupTecnico.forro();` |
| Enchimento hidro-sanitário | `PopupTecnico.enchimentoHidroSanitario();` |
| Quadro elétrico | `PopupTecnico.quadroEletrico();` |
| Rede frigorígena (dreno) | `PopupTecnico.redeFrigorigena();` |

Todas aceitam o tema como argumento opcional: `PopupTecnico.gas('escuro');` (padrão: `'claro'`).

## 3. Funções gerais

```js
PopupTecnico.abrir('gas');            // abre por nome da categoria (categoria inexistente abre "detalhes")
PopupTecnico.abrir('gas', 'escuro');  // com tema
PopupTecnico.fechar();                // fecha o popup
```

O popup também fecha ao clicar fora dele, no botão de fechar ou com a tecla Esc.

## 4. Configuração

```js
PopupTecnico.config.caminhoAssets = 'https://.../assets/'; // padrão: pasta assets/ ao lado do script
PopupTecnico.config.temaPadrao = 'claro';                  // 'claro' | 'escuro'
PopupTecnico.config.textoVazio = 'Informações em breve.';  // texto quando a categoria não tem conteúdo
```

## 5. Adicionando o conteúdo

Editar apenas o `conteudo-popup.js`:

```js
gas: {
  titulo: 'Gás',
  html: '<p>Tubulação de cobre...</p><ul><li>...</li></ul>'
}
```

Para montar o conteúdo por código, usar `render` no lugar de `html`:

```js
gas: {
  titulo: 'Gás',
  render: function (container, categoria) { container.textContent = '...'; }
}
```

## Cores

| Tema | Fundo | Texto |
|---|---|---|
| Claro | `#F9F7F7` | `#0F2739` |
| Escuro | `#0F2739` | `#F9F7F7` |
