const Rules = (function Rules(){
let rulesMap = undefined
let rulesList = undefined
const nonTerminalSymbols = []
const terminalSymbols = []




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


    return {
        getLeftSide,
        getRightSide,
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
function getMap(){
    if (rulesMap){
        return rulesMap
    }
    rulesMap = condenseRules()
    return rulesMap
}
function getFirsts(){
    if (firsts){
        return firsts
    }
    firsts = computeFirst()
    return firsts
}


return{ 
    makeRuleObjects,
    registerSymbols,
    getMap,
    getFirsts
}
})()