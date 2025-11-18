
const rulesArea = document.querySelector('#cfg-rules')
const submitButton = document.querySelector('#submit-grammar-button')
const statesDisplay = document.querySelector('#states-table')


submitButton.addEventListener('click', () => {
  const  rulesString = rulesArea.value
  Rules.initializeRules(rulesString)
  const entry = Handle.makeHandle(Rules.getExpansionRules(Rules.getGoal())[0], EOF, 0)
  CC.compute(entry) 
  CC.debug()
})
