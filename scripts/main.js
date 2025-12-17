
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
const conflictDialog = document.querySelector('#conflicts-dialog')
const viewConflictsButton = document.querySelector('#view-conflicts-button')
const rerenderActionTableButton = document.querySelector('#rerender-action-table-button')




const registerConflicts = (cc) => {
		
	const conflicts = ConflictRecorder.getConflicts()
	const doneButton = document.createElement('button')
	doneButton.textContent = "Done"
	doneButton.addEventListener('click', () => conflictDialog.close())
	conflicts.forEach(conflict => {
		const section = document.createElement('div')
		section.classList = 'conflict-box'
		const candidateActions = conflict.getActions()
		const headerText = `State ${conflict.getState()} symbol ${conflict.getSymbol()}`
		const header = document.createElement('h2')
		header.textContent = headerText
		const optionsBar = document.createElement('div')
		candidateActions.forEach( action => {
			const optionBox = document.createElement('div')
			optionBox.classList = 'action-option-box'
			const optionHeader = document.createElement('h3')
			optionHeader.textContent = `${ action.action } ${action.rule === undefined ? action.state : action.rule.getId()}`
			const button = document.createElement('button')
			button.textContent = 'apply'
			const state = conflict.getState()
			const symbol = conflict.getSymbol()
			button.addEventListener('click', () => {
				cc.changeAction(state, symbol, action)				
				rerenderActionTableButton.addEventListener('click', rerenderActionTable)
				rerenderActionTableButton.classList.toggle('inactive', false)
				formatOutputButton.removeEventListener('click', formatOutput)
				formatOutputButton.addEventListener('click', formatOutput)
				formatOutputButton.classList.toggle('inactive', false)
			})
			optionBox.appendChild(optionHeader)
			optionBox.appendChild(button)
			optionsBar.appendChild(optionBox)
		})
		section.appendChild(header)
		section.appendChild(optionsBar)
		conflictDialog.appendChild(section)
	})
	conflictDialog.appendChild(doneButton)
}


function fillStatesTable(cc){
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
}

function fillSymbolsList(rules){
const terminals = rules.getTerminals()
const nonTerminals = rules.getNonTerminals()
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
  


}


function fillActionTable(cc, rules){
  const at = cc.getActionTable()
  const gt = cc.getGotoTable()

  const terminals = rules.getTerminals()
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

  rerenderActionTableButton.classList.toggle('inactive', true)
}
function fillGotoTable(cc, rules){
  const at = cc.getActionTable()
  const gt = cc.getGotoTable()

  const nonTerminals = rules.getNonTerminals()
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
}
function fillRulesTable(rules){
rules.getAllRules().forEach(rule => {
    const labelCell = document.createElement('td')
    const contentCell = document.createElement('td')
    const row = document.createElement('tr')

    labelCell.textContent = String(rule.getId())
    contentCell.textContent = rule.toString()
    row.appendChild(labelCell)
    row.appendChild(contentCell)
    rulesTable.appendChild(row)

  })
}
function clearRulesTable(){
  rulesTable.innerHTML = '<caption>Rules</caption>'
}
function clearSymbolsList(){
  terminalSymbolsList.innerHTML = ''
  nonTerminalSymbolsList.innerHTML = ''
}
function clearActionTable(){
  actionDisplay.innerHTML = '<caption>Action Table</caption>'
}
function clearGotoTable(){
  gotoTable.innerHTML = '<caption>Goto Table</caption>'
}
function clearStatesTable(){
  statesTable.innerHTML = '<caption>States and their representative LR(1) Items </caption>'

}
const submitRules =  (() => {
  const  rulesString = rulesArea.value
  if (rulesString.trim() === '')
	return
  Rules.initializeRules(rulesString)
  const entry = Handle.makeHandle(Rules.getExpansionRules(Rules.getGoal())[0], EOF, 0)
  CC.compute(entry) 

  fillStatesTable(CC)
  fillActionTable(CC, Rules) 
  fillGotoTable(CC, Rules)
  fillRulesTable(Rules)

  document.querySelectorAll('table').forEach(table => table.style.display="table")
  document.querySelector('main').style.display = "grid"
   
  fillSymbolsList(Rules)
	
  formatOutputButton.addEventListener('click', formatOutput  )
  submitButton.removeEventListener('click', submitRules)
  submitButton.classList.toggle('inactive', true)
  if (ConflictRecorder.getConflicts().length > 0 ){
	  registerConflicts(CC) 
  	  viewConflictsButton.addEventListener('click', () => conflictDialog.showModal())
  	  viewConflictsButton.classList.toggle('inactive', false)
  }
  
  formatOutputButton.classList.toggle('inactive', false)
  
})

const rerenderActionTable = (() => {
	clearActionTable()
	fillActionTable(CC, Rules)
})

const writeCodeToClipBoard = () => {
	navigator.clipboard.writeText(declarations.innerText)
	//.catch(() => console.log('error copying to clipboard'))
}
const downloadCode = (() => {
	const blob = new Blob([declarations.innerText])
	const url = URL.createObjectURL(blob)
	const a = document.createElement('a')
	a.style.display = 'none'
	a.href = url
	a.download = 'parser-tables'
	document.body.appendChild(a)
	a.click()
	document.body.removeChild(a)
	URL.revokeObjectURL(url);
})
submitButton.addEventListener('click', submitRules)

  const  formatOutput = () =>{
    document.querySelector('#declarations').textContent = ''
    const numStates = CC.getStates().length
  


    const actionTypeDecl = `typedef unsigned int Action;`
    const parserStateDecl = 'typedef unsigned int ParserState;'
    const reduceDecl = '#define REDUCE 0x00000000'
    const shiftDecl =  '#define SHIFT  0x80000000' 
    const acceptDecl = '#define  ACCEPT 0x40000000'
    const undefinedDecl = `#define UNDEFINED 0xffffffff`
    const ruleSizeTableDecl = `int ruleSizes[${Rules.getAllRules().length}] = ${Formatter.formatRuleSizes(Rules)};`
    const ruleReductionTableDecl = `enum NonTerminal[${Rules.getAllRules().length}] = ${Formatter.formatRuleReductions(Rules)};`
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
      ruleSizeTableDecl,
      ruleReductionTableDecl,
      actionTableDecl,
      gotoTableDecl
    ]).forEach( decl =>{ 
      const line = document.createElement('span')
      line.textContent = decl
      declarations.appendChild(document.createElement('br'))
      declarations.appendChild(line)
    })
    //formatOutputButton.removeEventListener('click',formatOutput)
    document.querySelector('.generated-code-block').style.display = "block";
    copyCodeButton.addEventListener('click', downloadCode)
    copyCodeButton.classList.toggle('inactive', false)
    formatOutputButton.classList.toggle('inactive', true)
    formatOutputButton.removeEventListener('click', formatOutput)
  }
 


