const rulesArea = document.querySelector('#cfg-rules');
const submitButton = document.querySelector('#submit-grammar-button');
const statesDisplay = document.querySelector('#states-table');
const actionDisplay = document.querySelector('#action-table');
const gotoDisplay = document.querySelector('#goto-table');
const rulesTable = document.querySelector('#rules-table');
const declarations = document.querySelector('#declarations');
const formatOutputButton = document.querySelector('#format-output-button');
const copyCodeButton = document.querySelector('#copy-code-button');
const terminalSymbolsList = document.querySelector('#terminal-symbols-list');
const nonTerminalSymbolsList = document.querySelector('#non-terminal-symbols-list');
const conflictDialog = document.querySelector('#conflicts-dialog');
const viewConflictsButton = document.querySelector('#view-conflicts-button');
const rerenderActionTableButton = document.querySelector('#rerender-action-table-button');

let headerFileText = undefined;
let sourceFileText = undefined;

const worker = new Worker('./scripts/worker.js');
worker.onerror = event => {
  console.error('Worker error details:');
  console.error(event.message);
};
worker.onmessage = m => {
  const messageData = m.data;
  switch (messageData.message) {
    case 'init':
      fillStatesTable(messageData.cc.states);
      fillActionTable(messageData.cc, messageData.rules);
      fillGotoTable(messageData.cc, messageData.rules);
      fillRulesTable(messageData.rules.rules);

      document.querySelectorAll('table').forEach(table => (table.style.display = 'table'));
      document.querySelector('main').style.display = 'grid';

      fillSymbolsList(messageData.rules);

      if (messageData.conflicts.length > 0) {
        registerConflicts(messageData.cc, messageData.conflicts);
        viewConflictsButton.addEventListener('click', () => conflictDialog.showModal());
        viewConflictsButton.classList.toggle('inactive', false);
      }
      formatOutputButton.addEventListener('click', formatOutput);
      formatOutputButton.classList.toggle('inactive', false);
      break;

    case 'format':
      messageData.displayText.forEach(decl => {
        const line = document.createElement('span');
        line.textContent = decl;
        declarations.appendChild(document.createElement('br'));
        declarations.appendChild(line);
      });
      formatOutputButton.removeEventListener('click', formatOutput);
      document.querySelector('.generated-code-block').style.display = 'block';
      copyCodeButton.addEventListener('click', downloadCode);
      copyCodeButton.classList.toggle('inactive', false);
      formatOutputButton.classList.toggle('inactive', true);
      formatOutputButton.removeEventListener('click', formatOutput);
      headerFileText = messageData.headerFileText;
      sourceFileText = messageData.sourceFileText;
      codeIsGenerated = true;
      break;

    case 'query':
      fillActionTable(messageData.cc, messageData.rules);
  }
  /*
  formatOutputButton.addEventListener('click', formatOutput);
  submitButton.removeEventListener('click', submitRules);
  submitButton.classList.toggle('inactive', true);
  if (ConflictRecorder.getConflicts().length > 0) {
    registerConflicts(CC.exportData(), ConflictRecorder.exportData());
    viewConflictsButton.addEventListener('click', () => conflictDialog.showModal());
    viewConflictsButton.classList.toggle('inactive', false);
  }

  formatOutputButton.classList.toggle('inactive', false);
*/
};

const registerConflicts = (cc, conflicts) => {
  const doneButton = document.createElement('button');
  doneButton.textContent = 'Done';
  doneButton.addEventListener('click', () => conflictDialog.close());
  conflicts.forEach(conflict => {
    const section = document.createElement('div');
    section.classList = 'conflict-box';
    const candidateActions = conflict.actions;
    const headerText = `State ${conflict.state} symbol ${conflict.symbol}`;
    const header = document.createElement('h2');
    header.textContent = headerText;
    const optionsBar = document.createElement('div');
    candidateActions.forEach(action => {
      const optionBox = document.createElement('div');
      optionBox.classList = 'action-option-box';
      const optionHeader = document.createElement('h3');
      optionHeader.textContent = `${action.action} ${action.rule === undefined ? action.state : action.rule}`;
      const button = document.createElement('button');
      button.textContent = 'apply';
      const state = conflict.state;
      const symbol = conflict.symbol;
      button.addEventListener('click', () => {
        worker.postMessage({ message: 'choose', state, symbol, action }); //

        formatOutputButton.addEventListener('click', formatOutput);
        formatOutputButton.classList.toggle('inactive', false);

        rerenderActionTableButton.addEventListener('click', rerenderActionTable);
        rerenderActionTableButton.classList.toggle('inactive', false);

        copyCodeButton.removeEventListener('click', downloadCode);
        copyCodeButton.classList.toggle('inactive', true);
      });
      optionBox.appendChild(optionHeader);
      optionBox.appendChild(button);
      optionsBar.appendChild(optionBox);
    });
    section.appendChild(header);
    section.appendChild(optionsBar);
    conflictDialog.appendChild(section);
  });
  conflictDialog.appendChild(doneButton);
};

function fillStatesTable(states) {
  let i = -1;
  states.forEach(state => {
    const ul = document.createElement('ul');
    const labelCell = document.createElement('td');
    const contentCell = document.createElement('td');
    const row = document.createElement('tr');

    state.forEach(item => {
      const li = document.createElement('li');
      li.textContent = item;
      ul.append(li);
    });
    contentCell.append(ul);
    labelCell.textContent = String(++i);
    row.append(labelCell);
    row.append(contentCell);
    statesDisplay.append(row);
  });
}

function fillSymbolsList(rules) {
  const terminals = rules.terminals;
  const nonTerminals = rules.nonTerminals;
  terminals.forEach(symbol => {
    const li = document.createElement('li');
    li.textContent = symbol;
    terminalSymbolsList.appendChild(li);
  });
  nonTerminals.forEach(symbol => {
    const li = document.createElement('li');
    li.textContent = symbol;
    nonTerminalSymbolsList.appendChild(li);
  });
}

function fillActionTable(cc, rules) {
  const at = cc.actionTable;
  const gt = cc.gotoTable;

  const terminals = rules.terminals;
  const head = document.createElement('tr');
  head.appendChild(document.createElement('th'));
  terminals.forEach(symbol => {
    const cell = document.createElement('th');
    cell.textContent = symbol;
    head.appendChild(cell);
  });
  actionDisplay.appendChild(head);

  for (let i = 0; i < at.length; i++) {
    const row = document.createElement('tr');
    const labelCell = document.createElement('td');
    labelCell.textContent = String(i);
    row.appendChild(labelCell);
    terminals.forEach(symbol => {
      const cell = document.createElement('td');
      if (at[i][symbol] === undefined) {
        row.appendChild(cell);
        return;
      }
      cell.textContent = ` ${at[i][symbol].action}  ${at[i][symbol].action === 'shift' ? at[i][symbol].state : at[i][symbol].rule}`;
      row.appendChild(cell);
    });
    actionDisplay.appendChild(row);
  }

  rerenderActionTableButton.classList.toggle('inactive', true);
}
function fillGotoTable(cc, rules) {
  const at = cc.actionTable;
  const gt = cc.gotoTable;

  const nonTerminals = rules.nonTerminals;
  const gotoHead = document.createElement('tr');
  gotoHead.appendChild(document.createElement('td'));
  nonTerminals.forEach(nt => {
    const cell = document.createElement('th');
    cell.textContent = nt;
    gotoHead.appendChild(cell);
  });
  const gotoHeadElement = document.createElement('thead');
  gotoHeadElement.appendChild(gotoHead);
  gotoDisplay.appendChild(gotoHeadElement);
  for (let i = 0; i < at.length; i++) {
    const row = document.createElement('tr');
    const labelCell = document.createElement('td');
    labelCell.textContent = String(i);
    row.appendChild(labelCell);
    nonTerminals.forEach(nt => {
      const cell = document.createElement('td');
      cell.textContent = gt[i][nt];
      row.appendChild(cell);
    });
    gotoDisplay.appendChild(row);
  }
}
function fillRulesTable(rules) {
  let id = -1;
  rules.forEach(rule => {
    const labelCell = document.createElement('td');
    const contentCell = document.createElement('td');
    const row = document.createElement('tr');

    labelCell.textContent = String(id++);
    contentCell.textContent = rule;
    row.appendChild(labelCell);
    row.appendChild(contentCell);
    rulesTable.appendChild(row);
  });
}
function clearRulesTable() {
  rulesTable.innerHTML = '<caption>Rules</caption>';
}
function clearSymbolsList() {
  terminalSymbolsList.innerHTML = '';
  nonTerminalSymbolsList.innerHTML = '';
}
function clearActionTable() {
  actionDisplay.innerHTML = '<caption>Action Table</caption>';
}
function clearGotoTable() {
  gotoTable.innerHTML = '<caption>Goto Table</caption>';
}
function clearStatesTable() {
  statesTable.innerHTML = '<caption>States and their representative LR(1) Items </caption>';
}

const submitRules = () => {
  const rulesString = rulesArea.value;
  if (rulesString.trim() === '') return;
  worker.postMessage({
    message: 'init',
    rulesString: rulesString,
  });

  submitButton.removeEventListener('click', submitRules);
  submitButton.classList.toggle('inactive', true);
  /*
  formatOutputButton.addEventListener('click', formatOutput);
  if (ConflictRecorder.getConflicts().length > 0) {
    registerConflicts(CC.exportData(), ConflictRecorder.exportData());
    viewConflictsButton.addEventListener('click', () => conflictDialog.showModal());
    viewConflictsButton.classList.toggle('inactive', false);
  }

  formatOutputButton.classList.toggle('inactive', false);
  */
};

const rerenderActionTable = () => {
  clearActionTable();
  worker.postMessage({ message: 'query' });
};

const writeCodeToClipBoard = () => {
  navigator.clipboard.writeText(declarations.innerText);
  //.catch(() => console.log('error copying to clipboard'))
};

const downloadCode = () => {
  const srcBlob = new Blob([sourceFileText]);
  const srcUrl = URL.createObjectURL(srcBlob);
  const srcA = document.createElement('a');
  srcA.style.display = 'none';
  srcA.href = srcUrl;
  srcA.download = 'parser-tables.c';
  document.body.appendChild(srcA);
  srcA.click();
  document.body.removeChild(srcA);
  URL.revokeObjectURL(srcUrl);

  const headBlob = new Blob([headerFileText]);
  const headUrl = URL.createObjectURL(headBlob);
  const headA = document.createElement('a');
  headA.style.display = 'none';
  headA.href = headUrl;
  headA.download = 'parser-tables.h';
  document.body.appendChild(headA);
  headA.click();
  document.body.removeChild(headA);
  URL.revokeObjectURL(headUrl);
};
submitButton.addEventListener('click', submitRules);

const formatOutput = () => {
  document.querySelector('#declarations').textContent = '';
  worker.postMessage({ message: 'format' });
  /* const numStates = CC.getStates().length;
  const fileName = 'parser-tables';

  const actionTypeDecl = `typedef unsigned int Action;`;
  const parserStateDecl = 'typedef unsigned int ParserState;';
  const reduceDecl = '#define REDUCE 0x20000000';
  const shiftDecl = '#define SHIFT  0x80000000';
  const acceptDecl = '#define  ACCEPT 0x40000000';
  const undefinedDecl = `#define UNDEFINED 0xffffffff`;
  const ruleSizeTableDecl = `int ruleSizes[ NUM_RULES ] = ${Formatter.formatRuleSizes(Rules)};`;
  const ruleReductionTableDecl = `NonTerminal reductions[ NUM_RULES ] = ${Formatter.formatRuleReductions(Rules)};`;
  const actionTableDecl = `Action actionTable[ NUM_STATES ][ NUM_TERMINALS ] = ${Formatter.formatActionTable(CC, Rules)};`;
  const gotoTableDecl = `ParserState gotoTable[ NUM_STATES ][ NUM_NONTERMINALS] = ${Formatter.formatGotoTable(CC, Rules)};`;
  const nonTerminalsDecl = `${Formatter.formatNonTerminals(Rules)};${'\n'}typedef enum e_Terminal Terminal;`;
  const terminalsDecl = `${Formatter.formatTerminalSymbols(Rules)};${'\n'}typedef enum e_NonTerminal NonTerminal;`;
  const sizesDecl = Formatter.formatSizeMacros(CC, Rules);
  const tokenNames = Formatter.formatTokenNameTable(Rules);

  const externsDecl = Formatter.formatExterns();
  const srcLabel = Formatter.formatSourceFileName(fileName);
  const headerLabel = Formatter.formatHeaderFileName(fileName);

  headerFileText = Array.from([
    reduceDecl,
    shiftDecl,
    acceptDecl,
    undefinedDecl,
    terminalsDecl,
    nonTerminalsDecl,
    actionTypeDecl,
    parserStateDecl,
    sizesDecl,
    externsDecl,
  ]).join('\n');

  sourceFileText = Array.from([
    tokenNames,
    ruleSizeTableDecl,
    ruleReductionTableDecl,
    actionTableDecl,
    gotoTableDecl,
  ]).join('\n');

  Array.from([
    headerLabel,
    reduceDecl,
    shiftDecl,
    acceptDecl,
    undefinedDecl,
    terminalsDecl,
    nonTerminalsDecl,
    actionTypeDecl,
    parserStateDecl,
    sizesDecl,
    externsDecl,
    srcLabel,
    tokenNames,
    ruleSizeTableDecl,
    ruleReductionTableDecl,
    actionTableDecl,
    gotoTableDecl,
  ]).forEach(decl => {
    const line = document.createElement('span');
    line.textContent = decl;
    declarations.appendChild(document.createElement('br'));
    declarations.appendChild(line);
  });
  */
  //formatOutputButton.removeEventListener('click',formatOutput)
  document.querySelector('.generated-code-block').style.display = 'block';
  copyCodeButton.addEventListener('click', downloadCode);
  copyCodeButton.classList.toggle('inactive', false);
  formatOutputButton.classList.toggle('inactive', true);
  formatOutputButton.removeEventListener('click', formatOutput);
};
