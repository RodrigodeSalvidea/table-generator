///

const symbols = []
const nonTerminalSymbols = []
const terminalSymbols = []




function makeRuleObjects(ruleString){

    const tokens = ruleString.split(/\s+/)

    const leftSide = tokens[0]
    const rightSide = tokens.splice(3)
    const size = leftSide.length
    let index = 0
    function getRightSide(){ return rightSide }

    function getLeftSide(){ return leftSide }
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
        if (nonTerminalSymbols[rule.getRightSide()]){
          nonTerminalSymbols[rule.getRightSide()] = 1
          symbols.push(rule.getRightSide())
        }

    })
    ruleItems.forEach(rule => {
        rule.getLeftSide().forEach(symbol => {
            if (!nonTerminalSymbols[symbol])
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

function condenseRules( expansionRules ){
  const rightHandSides = []
  const leftHandSide = expansionRules[0].getLeftSide() 
  expansionRules.forEach(rule => {
    rightHandSides.push(rule.getLeftSide())
  })
  function getLeftSides(){ return leftHandSides }
  function getRightSide(){ return rightHandSide }
  
   
}

function computeFirst(  expansionRules ){
 const sets = []
 symbols.forEach(symbol => {sets[symbol] = []})
 let setsAreChanging = false

 while (setsAreChanging){
   
 }
}





