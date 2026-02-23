---
slug: acessibilidade-front-end-componentes-downshift
title: "Acessibilidade não é feature: como construir componentes que funcionam pra todo mundo"
author: Thiago Sciotta
author_title: Principal Engineer
author_url: https://github.com/thiagog3
author_image_url: https://avatars.githubusercontent.com/u/1863045?v=4
tags: [acessibilidade, a11y, react, frontend, design-system, downshift]
image: https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=1200
enableComments: true
---

A maioria dos componentes interativos que você usa no React são inacessíveis. Selects customizados, autocompletes, comboboxes — bonitos no Figma, quebrados no leitor de tela. E o pior: quem desenvolve geralmente nem sabe.

Quando construímos o design system da **Pipefy**, decidimos que acessibilidade não seria um "nice to have". Seria a fundação. E a biblioteca que nos ajudou a garantir isso foi o [Downshift](https://github.com/downshift-js/downshift).

<!--truncate-->

## O problema real

Pega um select customizado qualquer. Provavelmente ele:

- Não anuncia as opções pro leitor de tela
- Não funciona com navegação por teclado
- Não tem os roles ARIA corretos
- Não gerencia foco adequadamente
- Não comunica estado (aberto/fechado, selecionado/não selecionado)

Agora multiplica isso por todos os componentes interativos de um design system. Select, combobox, autocomplete, multiselect com tags, dropdown menu. Cada um com suas regras ARIA específicas, cada um com interações de teclado que precisam funcionar.

Implementar tudo isso na mão é possível, mas é **extremamente difícil de acertar**. A especificação [WAI-ARIA](https://www.w3.org/TR/wai-aria-practices/) para um combobox, por exemplo, tem dezenas de requisitos de comportamento.

## A abordagem errada

O instinto natural é construir o componente visual primeiro e "adicionar acessibilidade depois". Isso nunca funciona. Acessibilidade não é uma camada que você pinta por cima — é a estrutura do componente.

```jsx
// ❌ A abordagem "depois eu arrumo"
function CustomSelect({ options, onChange }) {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(null);

  return (
    <div className="select-wrapper" onClick={() => setOpen(!open)}>
      <div className="select-trigger">
        {selected?.label || 'Selecione...'}
      </div>
      {open && (
        <div className="select-dropdown">
          {options.map(opt => (
            <div
              key={opt.value}
              className="select-option"
              onClick={() => {
                setSelected(opt);
                onChange(opt);
                setOpen(false);
              }}
            >
              {opt.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
```

Esse componente é uma `div` que finge ser um select. Pra um usuário de leitor de tela, é invisível. Pra quem navega por teclado, é intocável. Pra quem depende de tecnologia assistiva, simplesmente **não existe**.

## Downshift: acessibilidade como primitivo

O [Downshift](https://github.com/downshift-js/downshift) resolve isso invertendo a lógica. Em vez de te dar um componente pronto (que você vai querer customizar até quebrar), ele te dá **primitivos** — hooks que encapsulam toda a lógica de estado, navegação por teclado e atributos ARIA.

Você controla 100% do visual. O Downshift controla a acessibilidade.

### useSelect — um select acessível de verdade

```jsx
import { useSelect } from 'downshift';

function AccessibleSelect({ items, onChange }) {
  const {
    isOpen,
    selectedItem,
    getToggleButtonProps,
    getMenuProps,
    getItemProps,
    highlightedIndex,
  } = useSelect({
    items,
    onSelectedItemChange: ({ selectedItem }) => onChange(selectedItem),
  });

  return (
    <div>
      <button
        type="button"
        {...getToggleButtonProps()}
        className="select-trigger"
      >
        {selectedItem?.label || 'Selecione...'}
      </button>
      <ul {...getMenuProps()} className="select-menu">
        {isOpen &&
          items.map((item, index) => (
            <li
              key={item.value}
              {...getItemProps({ item, index })}
              className={`select-item ${
                highlightedIndex === index ? 'highlighted' : ''
              } ${selectedItem === item ? 'selected' : ''}`}
            >
              {item.label}
            </li>
          ))}
      </ul>
    </div>
  );
}
```

O que o `getToggleButtonProps()` retorna por baixo dos panos:

```js
{
  role: 'combobox',
  'aria-expanded': isOpen,
  'aria-haspopup': 'listbox',
  'aria-labelledby': labelId,
  'aria-activedescendant': highlightedItemId,
  tabIndex: 0,
  onKeyDown: handleKeyDown,  // Arrow keys, Enter, Escape, Home, End
  onClick: handleClick,
  // ... mais atributos
}
```

Toda a complexidade ARIA está encapsulada. Navegação por teclado funciona. Leitor de tela anuncia corretamente. E você não escreveu uma linha de ARIA manualmente.

### useCombobox — autocomplete com acessibilidade

```jsx
import { useCombobox } from 'downshift';

function AccessibleAutocomplete({ items }) {
  const [inputItems, setInputItems] = useState(items);

  const {
    isOpen,
    getInputProps,
    getMenuProps,
    getItemProps,
    highlightedIndex,
    selectedItem,
  } = useCombobox({
    items: inputItems,
    onInputValueChange: ({ inputValue }) => {
      setInputItems(
        items.filter(item =>
          item.label.toLowerCase().includes(inputValue.toLowerCase())
        )
      );
    },
  });

  return (
    <div>
      <input
        {...getInputProps()}
        placeholder="Buscar..."
        className="combobox-input"
      />
      <ul {...getMenuProps()} className="combobox-menu">
        {isOpen &&
          inputItems.map((item, index) => (
            <li
              key={item.value}
              {...getItemProps({ item, index })}
              className={highlightedIndex === index ? 'highlighted' : ''}
            >
              {item.label}
            </li>
          ))}
      </ul>
    </div>
  );
}
```

O `useCombobox` segue o padrão [ARIA 1.2 combobox](https://www.w3.org/WAI/ARIA/apg/patterns/combobox/) à risca:

- **Arrow Down/Up** navega pelas opções
- **Enter** seleciona
- **Escape** fecha o menu
- **Home/End** vai pro primeiro/último item
- O input anuncia quantos resultados existem
- `aria-activedescendant` acompanha o item destacado em tempo real

## A experiência na Pipefy

No design system da Pipefy, usamos Downshift como base para todos os componentes de seleção. A decisão foi simples: não fazia sentido reinventar a roda de acessibilidade quando uma biblioteca já implementava a spec WAI-ARIA completa.

O que construímos em cima:

1. **Select simples** — `useSelect` com visual customizado
2. **Autocomplete/Combobox** — `useCombobox` com busca e highlight
3. **Multiselect com tags** — `useCombobox` + `useMultipleSelection` (hoje `useTagGroup`)
4. **Selects assíncronos** — Busca no backend com debounce, mantendo toda a acessibilidade

O ponto crucial: **todos esses componentes compartilham o mesmo padrão de interação**. Quem sabe usar um, sabe usar todos — com teclado, com leitor de tela, com qualquer tecnologia assistiva.

### Multiselect acessível com tags

```jsx
import { useCombobox, useMultipleSelection } from 'downshift';

function MultiSelect({ items, onChange }) {
  const [inputValue, setInputValue] = useState('');

  const {
    getSelectedItemProps,
    getDropdownProps,
    selectedItems,
    removeSelectedItem,
  } = useMultipleSelection({
    onSelectedItemsChange: ({ selectedItems }) => onChange(selectedItems),
  });

  const filteredItems = items.filter(
    item =>
      !selectedItems.includes(item) &&
      item.label.toLowerCase().includes(inputValue.toLowerCase())
  );

  const {
    isOpen,
    getInputProps,
    getMenuProps,
    getItemProps,
    highlightedIndex,
  } = useCombobox({
    items: filteredItems,
    inputValue,
    selectedItem: null,
    onInputValueChange: ({ inputValue }) => setInputValue(inputValue),
    onSelectedItemChange: ({ selectedItem }) => {
      if (selectedItem) {
        // useMultipleSelection cuida da lista
        setInputValue('');
      }
    },
    stateReducer: (state, actionAndChanges) => {
      const { type, changes } = actionAndChanges;
      switch (type) {
        case useCombobox.stateChangeTypes.InputKeyDownEnter:
        case useCombobox.stateChangeTypes.ItemClick:
          return { ...changes, isOpen: true, inputValue: '' };
        default:
          return changes;
      }
    },
  });

  return (
    <div>
      <div className="tags-container">
        {selectedItems.map((item, index) => (
          <span
            key={item.value}
            className="tag"
            {...getSelectedItemProps({ selectedItem: item, index })}
          >
            {item.label}
            <button onClick={() => removeSelectedItem(item)}>✕</button>
          </span>
        ))}
        <input
          {...getInputProps(getDropdownProps())}
          placeholder={selectedItems.length ? '' : 'Selecione...'}
        />
      </div>
      <ul {...getMenuProps()}>
        {isOpen &&
          filteredItems.map((item, index) => (
            <li
              key={item.value}
              {...getItemProps({ item, index })}
              className={highlightedIndex === index ? 'highlighted' : ''}
            >
              {item.label}
            </li>
          ))}
      </ul>
    </div>
  );
}
```

Cada tag é focável e removível por teclado. O leitor de tela anuncia "item selecionado, pressione Delete para remover". Tudo isso vem dos props que o Downshift gera — zero esforço manual.

## Por que "headless" é o caminho certo

O Downshift popularizou o conceito de **headless UI** — componentes que encapsulam lógica e acessibilidade, mas não ditam visual. Isso é importante porque:

**1. Acessibilidade é difícil de implementar corretamente**

A spec WAI-ARIA para combobox tem ~40 requisitos de comportamento. Gerenciamento de foco, anúncios para screen readers, navegação por teclado, edge cases com composição de texto... Encapsular tudo isso numa biblioteca testada é a decisão correta.

**2. Visual muda, comportamento não**

Seu designer vai mudar o visual do select 15 vezes. A navegação por teclado não muda. Separar as duas coisas evita regressões de acessibilidade em cada redesign.

**3. Consistência entre componentes**

Quando todos os componentes interativos usam a mesma base, o padrão de interação é consistente. Usuários de tecnologia assistiva aprendem uma vez e navegam tudo.

## Checklist: componente interativo acessível

Antes de considerar qualquer componente interativo "pronto", valide:

```
☐ Funciona apenas com teclado (Tab, Arrow, Enter, Escape)
☐ Tem roles ARIA corretos (listbox, option, combobox, etc)
☐ Anuncia estado para leitor de tela (aberto/fechado, n resultados)
☐ aria-activedescendant acompanha o foco virtual
☐ aria-expanded reflete o estado do menu
☐ aria-label ou aria-labelledby identifica o componente
☐ Focus trap funciona corretamente
☐ Contraste de cores atende WCAG 2.1 AA (4.5:1 texto, 3:1 UI)
☐ Touch target mínimo de 44x44px em mobile
☐ Funciona com zoom de 200% sem perda de conteúdo
```

## O custo de ignorar acessibilidade

Segundo a OMS, **16% da população mundial** vive com alguma deficiência. No Brasil, são **18,6 milhões de pessoas** (IBGE 2023). Isso sem contar deficiências temporárias (braço quebrado), situacionais (sol no rosto dificultando a leitura), ou o envelhecimento natural.

Quando você constrói um componente inacessível, está dizendo pra essas pessoas: "isso não foi feito pra você". Em 2026, isso é inaceitável — técnica e eticamente.

Além disso, acessibilidade é **lei** em muitos países. A LGPD e o Estatuto da Pessoa com Deficiência no Brasil, o ADA nos EUA, o EAA na Europa. Empresas estão sendo processadas por sites inacessíveis.

## Conclusão

Acessibilidade não é algo que você "adiciona" a um componente. É algo que você **constrói desde o início**. Bibliotecas como o Downshift provam que é possível ter 100% de controle visual sem sacrificar acessibilidade.

Na Pipefy, essa decisão definiu a qualidade do design system inteiro. Cada select, cada autocomplete, cada multiselect — todos acessíveis por padrão, todos seguindo WAI-ARIA, todos testáveis com tecnologia assistiva.

Se você está construindo um design system ou qualquer componente interativo: **comece pela acessibilidade**. Use primitivos headless. Teste com teclado. Teste com leitor de tela. Faça disso um requisito, não um desejo.

Porque acessibilidade não é feature. É fundação.

---

**Links úteis:**

- [Downshift](https://github.com/downshift-js/downshift) — Primitivos headless para React
- [WAI-ARIA Practices](https://www.w3.org/WAI/ARIA/apg/) — Padrões de design acessível
- [WCAG 2.1](https://www.w3.org/TR/WCAG21/) — Diretrizes de acessibilidade
- [axe DevTools](https://www.deque.com/axe/) — Auditoria de acessibilidade automática
