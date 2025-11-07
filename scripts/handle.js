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
  if (index >= rule.get().length){
    throw new Error(`Attempted to getNext on a handle with a length of ${rule.getRightSide().length} from index ${handle.getIndex()}`)
  }
  return makeHandle(rule, endSymbol, index)

}
function expandHandle( handle ){
  
}


return {
  makeHandle,
  getNext

}

})()