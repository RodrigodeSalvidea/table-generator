
const rulesArea = document.querySelector('#cfg-rules')
const submitButton = document.querySelector('#submit-grammar-button')
const statesDisplay = document.querySelector('#states-table')
const actionDisplay = document.querySelector('#action-table')
const gotoDisplay = document.querySelector('#goto-table')

submitButton.addEventListener('click', () => {
  const  rulesString = rulesArea.value
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
  head.appendChild(document.createElement('td'))
  terminals.forEach(symbol => {
    const cell = document.createElement('td')
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
      cell.textContent = `[ ${at[i][symbol].action} , ${at[i][symbol].action === "shift" ? at[i][symbol].state : at[i][symbol].rule.getId() }]`
      row.appendChild(cell)
    })
    actionDisplay.appendChild(row)
  }
  const nonTerminals = Rules.getNonTerminals()
  const gotoHead = document.createElement('tr')
  gotoHead.appendChild(document.createElement('td'))
  nonTerminals.forEach(nt => {
    const cell = document.createElement('td')
    cell.textContent = nt
    gotoHead.appendChild(cell)
  })
  gotoDisplay.appendChild(gotoHead)
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
})
