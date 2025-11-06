
const rulesArea = document.querySelector('#cfg-rules')
const submitButton = document.querySelector('#submit-grammar-button')

submitButton.addEventListener('click', () => {
  const  rulesString = rulesArea.value
  const  ruleStrings = rulesString.split(/\n+/)
  const  rulesList = ruleStrings.map(rule => makeRuleObjects(rule)).filter(rule => rule)
  rulesList.forEach(rule => {
    console.log(`${rule.getLeftSide()} ::= ${rule.getRightSide()}`)
  })
  registerSymbols(rulesList)
  const rulesMap = condenseRules(rulesList)
  const firsts = computeFirst(rulesMap)
  console.log(terminalSymbols)
  console.log(nonTerminalSymbols)
  console.log(symbols)
 
  

})



