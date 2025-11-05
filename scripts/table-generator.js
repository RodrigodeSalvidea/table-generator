///

const symbols = []
const nonTerminalSymbols = []
const terminalSymbols = []
const EMPTY = ""




function makeRuleObjects(ruleString){

    const tokens = ruleString.trim(" ").split(/\s+/)
    if (tokens.length < 3 || tokens[1] !== '->'){
      return undefined
    }
    const leftSide = tokens[0]
    const rightSide = tokens.splice(2)
    const size = leftSide.length
    let index = 0
    function getRightSide(){ return rightSide } //Right Side is an array
    function getLeftSide(){ return leftSide } //Left side is a string
    function getIndex(){ return index}
    function setIndex(){ index++ }

    return {
        getLeftSide,
        getRightSide,
        getIndex,
        setIndex
    } 
}

function registerSymbols(ruleItems){
    ruleItems.forEach(rule => {
        if (!nonTerminalSymbols[rule.getLeftSide()]){
          nonTerminalSymbols[rule.getLeftSide()] = 1
          symbols.push(rule.getLeftSide())
        }

    })
    ruleItems.forEach(rule => {
        rule.getRightSide().forEach(symbol => {
            if (nonTerminalSymbols[symbol])
                return
            if (!terminalSymbols[symbol]){
              terminalSymbols[symbol] = 1
              symbols.push(symbol)
            }
        }
        )
    })
    return ruleItems
}
/*
input: map of nonterminal symbols to list of possible right hand sides

*/
function condenseRules( expansionRules ){
  const map = []
  expansionRules.forEach(rule =>{ 
    const leftSide = rule.getLeftSide()
    if (!map[leftSide]){
      map[leftSide] = []
    }
    map[leftSide].push(rule.getRightSide())
  })
  return map
}

function computeFirst(  expansionRules  ){
 const firsts = []
 symbols.forEach(symbol => {
  firsts[symbol] = new Set()
  if (terminalSymbols[symbol]){
    firsts[symbol].add(symbol)
  }
 })
 

 let firstSetsAreChanging = true
 const nts = Array.from(Object.keys(nonTerminalSymbols))
 while (firstSetsAreChanging){

   nts.forEach((leftSide, index) => {
    firstSetsAreChanging = false
    rightSides = expansionRules[leftSide]
    const rightFirsts = rightSides.map(sentence => firsts[sentence[0]])
    let setHasChanged = false
    for(rightFirst of rightFirsts){
      for (symbol of rightFirst){
      if (!firsts[leftSide].has(symbol)) {
        setHasChanged = true
      }
      firsts[leftSide].add(symbol)
    }
    }
    if (setHasChanged){
      firstSetsAreChanging = true
    }
   })
   
 }
 return firsts
}
/*
function computeFollow( expansionRules, first){
  const follow = []
  nonTerminalSymbols.keys().forEach(symbol => {
    follow[symbol] = new Set()

  })

  while ( setsAreChanging ){
    expansionRules.forEach(rule => {
      const A = rule.getLeftSide()
      const B = rule.getRightSides()
      const trailer = new Set(follow[A])

      for(let k = 0; k < B.length; k++){
        if (nonTerminalSymbols[B[i]]){
          follow[B[i]] = follow[B[i]].union(trailer)
        }
      }
    })
  }
}


*/
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








