const Rules = (() => {
  const map = []
  let rulesList = undefined
  const nonTerminalSymbols = []
  const terminalSymbols = []
  const symbols = []
  const firsts = []
  const follows = []
  let goal = undefined
  let goalCandidates = []
  let i = -1
function makeRuleObject(ruleString){
    const tokens = ruleString.trim(" ").split(/\s+/)
    if (tokens.length < 2 || tokens[1] !== '->'){
	    throw new Error(`Rule String ${ruleString} is not a valid ruleString`)
    }
    const leftSide = tokens[0]
    const rightSide = tokens.splice(2)
    const size = leftSide.length
    const id = ++i  

    if (rightSide.length === 0){
	    rightSide.push(EPSILON)
    }
    function getRightSide(){ return rightSide } //Right Side is an array
    function getLeftSide(){ return leftSide } //Left side is a string
    function getId(){return id} 
    function toString(){
      return ruleString
    }
    return {
        getLeftSide,
        getRightSide,
        getId,
        toString
    } 
}

function initializeRules(rulesString){
   const ruleStrings = rulesString.trim().split(/\n+/)
   const existsInLeft = []
   const existsInRight = []
   rulesList = ruleStrings.map(rule => makeRuleObject(rule)).filter(rule => rule)
   rulesList.forEach(rule => {
        if (!nonTerminalSymbols[rule.getLeftSide()]){
          nonTerminalSymbols[rule.getLeftSide()] = 1
          symbols.push(rule.getLeftSide())
	  existsInLeft[rule.getLeftSide()] = true
        }

    })
    rulesList.forEach(rule => {
        rule.getRightSide().forEach(symbol => {
	    existsInRight[symbol] = true
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

 




  goalCandidates = symbols.filter(s => existsInLeft[s] && !existsInRight[s])
  

  
  nts.forEach(symbol => {
	  follows[symbol] = new Set()
  })
    follows[goalCandidates[0]].add(EOF)
let followSetsAreChanging = true
while (followSetsAreChanging){
	let setsChanged = false
rulesList.forEach(rule => {
	  let trailer = new Set(follows[rule.getLeftSide()])
	  let beta = rule.getRightSide()
	  
	  let i = beta.length - 1
	
	  while (i >= 0){
		  if (!nonTerminalSymbols[beta[i]]){
			  i--
			  continue
		  }
		  for (	symbol of trailer){
			follows[beta[i]].has(symbol) ? setsChanged = true : 0
			follows[beta[i]].add(symbol)
		  }
		  if (firsts[beta[i]].has(EPSILON)){
			  trailer = trailer.union(firsts[beta[i]])
			  trailer.delete(EPSILON)
		  } else {
			  trailer = new Set(firsts[beta[i]])
		  }
		  i--
	  }
		

  
})
	followSetsAreChanging = setsChanged
}

nts.forEach(symbol => {
	if (firsts[symbol].has(EPSILON)){
		firsts[symbol].delete(EPSILON)
		firsts[symbol] = firsts[symbol].union(follows[symbol])
	}
})
}
function getGoal(){
  if (goalCandidates.length > 1){
    throw new Error('There is more than one goal symbol')
  }
  if (goalCandidates.length == 0){
    goal = null
  }
  return goalCandidates[0]
}
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
function getNonTerminals() { return Object.keys(nonTerminalSymbols) }
function getTerminals() {
  const terminals =  Object.keys(terminalSymbols).filter(s => s !== EPSILON)
  terminals.push(EOF)
  return terminals
}
function getAllRules(){ return rulesList }

return{ 
    initializeRules,
    getExpansionRules,
    isTerminal,
    getFirst,
    getAllRules,
    getGoal,
    getNonTerminals,
    getTerminals
}
})()
