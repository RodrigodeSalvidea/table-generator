const Handle = (() => {
function makeHandle(rule, endSymbol, index){
  function getRule(){
    return rule
  }
  function getEnd(){
    return endSymbol
  }
  function hasNext(){
    return rule.getRightSide().length <= index + 1
  }
  function getIndex(){
    return index
  }
  function getCurrentSymbol(){
    return rule.getRightSide()[index]
  }
  return {
    getRule, 
    getEnd, 
    hasNext,
    getIndex,
    getCurrentSymbol
  }
}
function  getNext(handle){
  const rule = handle.getRule()
  const index = handle.getIndex() + 1
  const endSymbol = handle.getEnd() 
  function getRule(){
    return rule
  }
  function getEnd(){
    return endSymbol
  }
  function getIndex(){
    return index
  }
  function hasNext(){
    return rule.getRightSide().length <= index + 1
  }
  function getCurrentSymbol(){
    return rule.getRightSide()[index]
  }
  return {
    getRule,
    getEnd,
    getIndex,
    hasNext,
    getCurrentSymbol
  }
  

}
function expandHandle( handle ){
  const handles = []
  for(rule of rules){
    Rules.getExpansions
  }
}


return {
  makeHandle,
  getNext

}

})()