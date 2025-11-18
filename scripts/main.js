
const rulesArea = document.querySelector('#cfg-rules')
const submitButton = document.querySelector('#submit-grammar-button')
const statesDisplay = document.querySelector('#states-table')


submitButton.addEventListener('click', () => {
  const  rulesString = rulesArea.value
  Rules.initializeRules(rulesString)
  const entry = Handle.makeHandle(Rules.getExpansionRules(Rules.getGoal())[0], EOF, 0)
  let cc0 = Handle.closure([entry])
  cc0.forEach(item => console.log(`${item}`))
  cc0 = Handle.closure(cc0)
  cc0.forEach(item => console.log(`${item}`))
  

})
