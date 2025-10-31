///

const symbols = []
const nonTerminalSymbols = []
const TerminalSymbols = []




function makeRuleObject(ruleString){

    const tokens = ruleString.split(/\s+/)

    const rightSide = tokens[0]
    const leftSide = tokens.splice(3)
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







