const Handle = (() => {
function makeHandle(rule, endSymbol, index){
  if (rule.getRightSide()[0] === EPSILON)
	index = 1
  
  function getRule(){
    return rule
  }
  function getEnd(){
    return endSymbol
  }
  function hasNext(){
    return index < rule.getRightSide().length
  }
  function getIndex(){
    return index
  }
  function getCurrentSymbol(){
    if (rule.getRightSide()[index] !== undefined)
      return rule.getRightSide()[index]
    throw new Error("Attempted to get current symbol on a handle where the current symbol is undefined")
  }
  function toString(){
    const rightSide = Array.from(rule.getRightSide())
    rightSide.splice(index, 0, "•") 
    return `[${rule.getLeftSide()} ::= ${rightSide.join(" ")}, ${endSymbol}]`
  }
  return {
    getRule, 
    getEnd, 
    hasNext,
    getIndex,
    getCurrentSymbol,
    toString
  }
}
function  getNext(handle){
  const rule = handle.getRule()
  const index = handle.getIndex() + 1
  const endSymbol = handle.getEnd() 
  if (index ===  rule.getRightSide().length + 1){
    throw new Error(`Attempted to getNext on a handle with a length of ${rule.getRightSide().length} from index ${index - 1}`)
  }
  return makeHandle(rule, endSymbol, index)

}
function expandHandle( handle ){
  const rule = handle.getRule()
  const endSymbol = handle.getEnd()
  const symbol = handle.getCurrentSymbol()
  if (Rules.isTerminal(symbol)){
    return []
  }
  const expansionRules = Rules.getExpansionRules(symbol)
  const cc = []
  if (handle.getIndex() === handle.getRule().getRightSide().length - 1){
    expansionRules.forEach(rule => {
      cc.push(makeHandle(rule, endSymbol, 0))
    })
  } else{
    const first = Rules.getFirst( handle.getRule().getRightSide()[handle.getIndex() + 1] )
    first.forEach(s => {
      expansionRules.forEach(rule => {
        cc.push(makeHandle(rule, s, 0))
      })
    })

  }
   return cc
}

function equals(handle1, handle2){
  return (handle1.getRule() === handle2.getRule() && 
  handle1.getIndex() === handle2.getIndex() && 
  handle1.getEnd() === handle2.getEnd()) 
}
/*
function closure(handle){
  const s = []
  let setIsChanging = true
  
  s.push(handle)
  while (setIsChanging){ 
    let n = []
    s.forEach(h => {
    if (!h.hasNext()){
      return
    }
    const expansions = expandHandle(h)
    expansions.forEach(e => {
      if (s.every(item => !equals(item, e)) && n.every(item => !equals(item,e))){
        n.push(e) 
      }
    })
    })
  
    if (n.length === 0){
      setIsChanging = false
    }
    n.forEach(expandedHandle => {
      s.push(expandedHandle) 
    })
  }	
  return s
}*/
function closure(s){
  s = Array.from(s)
 
  let sIsChanging = true 
  while (sIsChanging){
    let n = []
    s.forEach(item => {
      if (!item.hasNext()){
	return
      }
      const expansions = expandHandle(item)
      expansions.forEach(e => {
	if (s.every(item => !equals(item, e)) && n.every(item => !equals(item, e))){
	  n.push(e)
	}
      })
    })

    if (n.length === 0){
      sIsChanging = false
    }
    n.forEach(expansion => {
      s.push(expansion)
    })
   }
  
 return s
}
return {
  makeHandle,
  getNext,
  equals,
  expandHandle,
  closure

}

})()
