const SetFactory = (() => {
  function makeSet(){
    const set = {}
    const handles = []
    let processed =  false

    set.markProcessed = () => { processed = true }
    set.isProcessed = () => processed
    set.add = (handle) => { 
      if (handles.every(h => !Handle.equals(h, handle))){
        handles.push(handle) 
      }
    }
    set.getHandles = () => Array.from(handles)
    set.assignHandles = (a) => {
      a.forEach(item => handles.push(item))
      return set
    }
    set.debug = () => {
      console.log("[") 
      handles.forEach(h => {console.log(`${h}`)})
      console.log("]")
    }

    set.goTo = (symbol) => {
      const g = makeSet()
      g.assignHandles(Handle.closure(  handles.filter(item => item.hasNext() && item.getCurrentSymbol() === symbol).map(item => Handle.getNext(item)) ))
      return g
    }
    set.getEdges = () => {
      const found = []
      return handles.filter(item => item.hasNext()).map(item => item.getCurrentSymbol()).filter(symbol => {
        if (found[symbol]){
          return false
	}
	found[symbol] = true
	return true
      })
    }
    set.closure = () => {
      return Handle.closure(handles)
    }
    set.equals = (s) =>  {
      const sh = s.getHandles()
      return handles.every(a => sh.some(b => Handle.equals(a, b))) && sh.every(b => handles.some(a => Handle.equals(a,b)))
    }
    Object.freeze(set)
    return set
 
  }
 
  return { makeSet }
})()






const CC = (() => {
    const actionTable = []
    const gotoTable = []
    const cc = []
    function debug(){
      console.log("CC:  [")
      cc.forEach(cci => cci.debug())
      console.log("]")

    }
    function compute(entry){
      const cc0 = SetFactory.makeSet()
      cc0.assignHandles(Handle.closure([entry]))
      cc.push(cc0)
      gotoTable[0] = []
      for (let i = 0; i < cc.length; i++){
	if (cc[i].isProcessed()){
	  continue
	}
	cc[i].markProcessed()
        const edges = cc[i].getEdges()
	edges.forEach(symbol => {
	  let goToIndex = undefined
	  const temp = cc[i].goTo(symbol)
          if (cc.every(set => {const e = set.equals(temp); return !e})){
            cc.push(temp)
	    gotoTable[cc.length - 1] = []
            goToIndex = cc.length - 1
	    gotoTable[i][symbol] = goToIndex
            return
	  }
          goToIndex = cc.findIndex(e => e.equals(temp))
	  gotoTable[i][symbol] = goToIndex
	})
      }
      
      for(let i = 0; i < cc.length; i++){
        const edges = cc[i].getEdges()
	actionTable[i] = []
	edges.forEach(symbol => {
            actionTable[i][symbol] = {
              action: "shift",
	      state: gotoTable[i][symbol]
	    }
	})
	cc[i].getHandles().forEach( item => {
          if (!item.hasNext()){
            actionTable[i][item.getEnd()] = {
              action: "reduce",
	      rule: item.getRule()
	    }
	  }
	})
      }

     
    }
   function getActionTable(){ return actionTable }
   function getGotoTable(){ return gotoTable }
   function getStates(){ return cc }
   return {compute, debug, getActionTable, getGotoTable, getStates} 
	      
		  
})()
