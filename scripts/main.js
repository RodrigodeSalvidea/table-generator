
const rulesArea = document.querySelector('#cfg-rules')
const submitButton = document.querySelector('#submit-grammar-button')

submitButton.addEventListener('click', () => {
  const  rulesString = rulesArea.value
  Rules.initializeRules(rulesString)
  const entry = Handle.makeHandle(Rules.getExpansionRules(Rules.getGoal())[0], EOF, 0)
  console.log(entry.toString())
  Handle.findCanonicalCollection(entry).forEach(item => console.log(item.toString()))
  
   
})



