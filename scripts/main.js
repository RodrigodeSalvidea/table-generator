
const rulesArea = document.querySelector('#cfg-rules')
const submitButton = document.querySelector('#submit-grammar-button')
const statesDisplay = document.querySelector('#states-table')
const actionDisplay = document.querySelector('#action-table')
const gotoDisplay = document.querySelector('#goto-table')
const rulesTable = document.querySelector('#rules-table')
const declarations = document.querySelector('#declarations')
const formatOutputButton = document.querySelector('#format-output-button')
const copyCodeButton = document.querySelector('#copy-code-button')
const terminalSymbolsList = document.querySelector('#terminal-symbols-list')
const nonTerminalSymbolsList = document.querySelector('#non-terminal-symbols-list')
const submitRules =  (() => {
  const  rulesString = rulesArea.value
  if (rulesString.trim() === '')
	return
  Rules.initializeRules(rulesString)
  const entry = Handle.makeHandle(Rules.getExpansionRules(Rules.getGoal())[0], EOF, 0)
  CC.compute(entry) 
  let i = -1
  CC.getStates().forEach(state => {
    const ul = document.createElement('ul')
    const labelCell = document.createElement('td')
    const contentCell = document.createElement('td')
    const row = document.createElement('tr')
    
    state.getHandles().forEach(item => {
      const li = document.createElement('li')
      li.textContent = item.toString()
      ul.append(li)
    })
    contentCell.append(ul)
    labelCell.textContent = String(++i)
    row.append(labelCell)
    row.append(contentCell)
    statesDisplay.append(row)
  })
  const at = CC.getActionTable()
  const gt = CC.getGotoTable()

  const terminals = Rules.getTerminals()
  const head = document.createElement('tr')
  head.appendChild(document.createElement('th'))
  terminals.forEach(symbol => {
    const cell = document.createElement('th')
    cell.textContent = symbol
    head.appendChild(cell)
  })
  actionDisplay.appendChild(head)
  
  for (let i = 0; i < at.length; i++){
    const row = document.createElement('tr')
    const labelCell = document.createElement('td')
    labelCell.textContent = String(i)
    row.appendChild(labelCell)
    terminals.forEach(symbol => {
      const cell = document.createElement('td')
      if (at[i][symbol] === undefined){
	row.appendChild(cell)
	return
      }
      cell.textContent = ` ${at[i][symbol].action}  ${at[i][symbol].action === "shift" ? at[i][symbol].state : at[i][symbol].rule.getId() }`
      row.appendChild(cell)
    })
    actionDisplay.appendChild(row)
  }
  const nonTerminals = Rules.getNonTerminals()
  const gotoHead = document.createElement('tr')
  gotoHead.appendChild(document.createElement('td'))
  nonTerminals.forEach(nt => {
    const cell = document.createElement('th')
    cell.textContent = nt
    gotoHead.appendChild(cell)
  })
  const gotoHeadElement = document.createElement('thead')
  gotoHeadElement.appendChild(gotoHead) 
  gotoDisplay.appendChild(gotoHeadElement)
  for (let i = 0; i < at.length; i++){
    const row = document.createElement('tr')
    const labelCell = document.createElement('td')
    labelCell.textContent = String(i)
    row.appendChild(labelCell)
    nonTerminals.forEach(nt => {
      const cell = document.createElement('td')
      cell.textContent = gt[i][nt]
      row.appendChild(cell)
    })
    gotoDisplay.appendChild(row)
  
  }
  
  Rules.getAllRules().forEach(rule => {
    const labelCell = document.createElement('td')
    const contentCell = document.createElement('td')
    const row = document.createElement('tr')

    labelCell.textContent = String(rule.getId())
    contentCell.textContent = rule.toString()
    row.appendChild(labelCell)
    row.appendChild(contentCell)
    rulesTable.appendChild(row)

  })
  document.querySelectorAll('table').forEach(table => table.style.display="table")
  document.querySelector('main').style.display = "grid"
  terminals.forEach(symbol => {
	  const li = document.createElement('li')
	  li.textContent = symbol
	  terminalSymbolsList.appendChild(li)
  })
  nonTerminals.forEach(symbol => {
	  const li = document.createElement('li')
	  li.textContent = symbol
	  nonTerminalSymbolsList.appendChild(li)
  })
  

 formatOutputButton.addEventListener('click', formatOutput)
 submitButton.removeEventListener('click', submitRules)
})
const writeCodeToClipBoard = () => {
	navigator.clipboard.writeText(declarations.innerText)
	//.catch(() => console.log('error copying to clipboard'))
}
submitButton.addEventListener('click', submitRules)

  const  formatOutput = () =>{
    const numStates = CC.getStates().length
  


    const actionTypeDecl = `typedef unsigned int Action;`
    const parserStateDecl = 'typedef unsigned int ParserState;'
    const reduceDecl = '#define REDUCE 0x00000000'
    const shiftDecl =  '#define SHIFT  0x80000000' 
    const acceptDecl = '#define  ACCEPT 0x40000000'
    const undefinedDecl = `#define UNDEFINED 0xffffffff`
    const ruleTableDecl = `int ruleSizes[${Rules.getAllRules().length}] = ${Formatter.formatRuleSizes(Rules)};`
    const actionTableDecl = `Action actionTable[${numStates}][${Rules.getTerminals().length}] = ${Formatter.formatActionTable(CC, Rules)};` 
    const gotoTableDecl = `ParserState gotoTable[${numStates}][${Rules.getNonTerminals().length}] = ${Formatter.formatGotoTable(CC, Rules)};`
    const nonTerminalsDecl = `${Formatter.formatNonTerminals(Rules)};`
    

  
    Array.from([
      reduceDecl,
      shiftDecl,
      acceptDecl,
      undefinedDecl,
      nonTerminalsDecl,
      actionTypeDecl, 
      parserStateDecl,
      ruleTableDecl,
      actionTableDecl,
      gotoTableDecl
    ]).forEach( decl =>{ 
      const line = document.createElement('span')
      line.textContent = decl
      declarations.appendChild(document.createElement('br'))
      declarations.appendChild(line)
    })
    formatOutputButton.removeEventListener('click',formatOutput)
    document.querySelector('.generated-code-block').style.display = "block";
    copyCodeButton.addEventListener('click', writeCodeToClipBoard)
  }
 


