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
/*
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
  console.log(terminalSymbols)
  console.log(nonTerminalSymbols)
  console.log(symbols)
 
  

})








