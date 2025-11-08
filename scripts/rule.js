const Rules = (() => {
  const map = []
  let rulesList = undefined
  const nonTerminalSymbols = []
  const terminalSymbols = []
  const symbols = []
  const firsts = []

function makeRuleObject(ruleString){
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


    return {
        getLeftSide,
        getRightSide,
    } 
}

function initializeRules(rulesString){
   const ruleStrings = rulesString.split(/\n+/)
   rulesList = ruleStrings.map(rule => makeRuleObject(rule)).filter(rule => rule)
   rulesList.forEach(rule => {
        if (!nonTerminalSymbols[rule.getLeftSide()]){
          nonTerminalSymbols[rule.getLeftSide()] = 1
          symbols.push(rule.getLeftSide())
        }

    })
    rulesList.forEach(rule => {
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
   rulesList.forEach(rule =>{ 
    const leftSide = rule.getLeftSide()
    if (!map[leftSide]){
      map[leftSide] = []
    }
    map[leftSide].push(rule)
  })


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
    rightSides = map[leftSide].map(rule => rule.getRightSide())
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


}


/*
input: map of nonterminal symbols to list of possible right hand sides

*/

function getExpansionRules( symbol ){
    if (terminalSymbols[symbol])
        throw new Error("Tried to expand a terminal symbol")
    if (!nonTerminalSymbols[symbol])
        throw new Error("Tried To expand a symbol that is non registered")
    return map[symbol]
}

function getFirst(symbol){
    if (!terminalSymbols && !nonTerminalSymbols[symbol]){
        throw new Error(`symbol ${symbol} is not a registered symbol`)
    }
    return firsts[symbol]
}
function isTerminal(symbol){
    if (terminalSymbols[symbol]){
        return true
    }
    if (nonTerminalSymbols[symbol]){
        return false
    }
    throw new Error(`symbol ${symbol} is not registered as a symbol`)
}
function getAllRules(){ return rulesList }

return{ 
    initializeRules,
    getExpansionRules,
    isTerminal,
    getFirst,
    getAllRules
}
})()
