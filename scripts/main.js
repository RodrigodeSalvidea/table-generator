
const rulesArea = document.querySelector('#cfg-rules')
const submitButton = document.querySelector('#submit-grammar-button')
const statesDisplay = document.querySelector('#states-table')


submitButton.addEventListener('click', () => {
  const  rulesString = rulesArea.value
  Rules.initializeRules(rulesString)
  const entry = Handle.makeHandle(Rules.getExpansionRules(Rules.getGoal())[0], EOF, 0)
  CC.findCompleteCC( entry )
  const gotoTable = CC.getGotoTable()   
  const actionTable = CC.getActionTable()
  
  const collections = CC.getCollections()

  
  console.log({actionTable, gotoTable, collections})
  for(let i = 0; i < collections.length; i++){
    const collectionTableRow = document.createElement('tr')
    const stateDisplay = document.createElement('ul')
    const collectionTableLabel = document.createElement('td')
    const collectionTableContent = document.createElement('td')
    collectionTableContent.append(stateDisplay)
    collectionTableLabel.textContent = i.toString()

    collections[i].collection.forEach(item => {
      const lrItem = document.createElement('li')
      lrItem.textContent = item.toString()
      stateDisplay.appendChild(lrItem)
      
    })   
    collectionTableRow.append(collectionTableLabel)
    collectionTableRow.append(collectionTableContent)
    statesDisplay.append(collectionTableRow)


    
    
    

  }
})