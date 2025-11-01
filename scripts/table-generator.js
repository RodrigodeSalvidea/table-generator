///

const symbols = []
const nonTerminalSymbols = []
const terminalSymbols = []
const EMPTY = ""




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
  
  return {
	  getLeftSide,
	  getRightSides
  }
}

function computeFirst(  expansionRules  ){

const first = []
terminalSymbols.forEach(symbol => {
  first[symbol] = new Set()
  first[symbol].add(symbol)
})
nonTerminalSymbols.forEach(symbol => {
  first[symbol]= new Set()
})

let setsAreChanging = true
while (setsAreChanging){
  let setsChanged = false
  expansionRules.forEach(rule => {
    const A = rule.getLeftSide()
    const B = rule.getRightSide()
    let rhs = new Set()
    const firstCopy = new Set(first[A])
    rhs = rhs.union(B[0])
    rhs.delete(EMPTY)

    for(let i = 1; i < B.length; i++){
      rhs = rhs.union(first[ B[i] ])
      rhs.delete(EMPTY)
    }
    if (first[B[B.length - 1]].has(EMPTY)){
      rhs.add(EMPTY)
    }
    first[A] = first[A].union(rhs)

    if(!(Array.from(firstCopy).every(item => first[A].has(item)) && Array.from(first[A]).every(item => firstCopy.has(item)))){
      setsChanged = true
    }
    
  })
  setsAreChanging = setsChanged
}
  return first

}

function computeFollow( expansionRules, first){
  const follow = []
  nonTerminalSymbols.forEach(symbol => {
    follow[symbol] = new Set()

  })
}







