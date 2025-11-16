const CC = (() => {
    const collections = []
    const setMap = [] // [rule][endSymbol][index]
    const actionTable = []
    const gotoTable = []
    let i = 0
    
    function findSubset(handles){
      const derivedSet = [] //let derivedSet hold a)the handles passed as arguments and b)their unique expansions
      const derivedSetMap = [] 
      let allFound = true
      handles.forEach(handle => {
	const collection = Handle.findCanonicalCollection(handle)

	collection.forEach(h => {
	  if (derivedSetMap[h.getRule().getId()] === undefined) {
	    derivedSetMap[h.getRule().getId()] = []
	  }
	  if (derivedSetMap[h.getRule().getId()][h.getEnd()] === undefined){
	    derivedSetMap[h.getRule().getId()][h.getEnd()] = []
	  }
	  if (derivedSetMap[h.getRule().getId()][h.getEnd()][h.getIndex()] !== undefined){
	  return 
	  }
	  derivedSetMap[h.getRule().getId()][h.getEnd()][h.getIndex()] = 1
	  derivedSet.push(h)

	  if (setMap[h.getRule().getId()] === undefined || setMap[h.getRule().getId()][h.getEnd()] === undefined || setMap[h.getRule().getId()][h.getEnd()][h.getIndex()] === undefined){
	    allFound = false 
	  }
	
	})
      })

      
     const currentGroup = GroupFactory.makeGroup().setIndex(collections.length)
     let minIndex = collections.length 
     derivedSet.forEach(h => {
	if (setMap[h.getRule().getId() === undefined){
	  setMap[h.getRule().getId()] = []
	}
	if (setMap[h.getRule().getId()][h.getEnd()] === undefined){
	  setMap[h.getRule().getId()][h.getEnd()] = []
	}
	if (setMap[h.getRule().getId()][h.getEnd()][h.getIndex()] !== undefined){
	   let node = setMap[h.getRule().getId()][h.getEnd()][h.getIndex()]  
	   minIndex = Math.min(node.getIndex, minIndex)
	   while(node.hasNext() && node.getIndex() !== collections.length){
	     node = node.getNext()
	   }
	   if (node.getIndex() !== collections.length){
	     node.setNext(currentGroup) 
	   }
	}else{
          setMap[h.getRule().getId()][h.getEnd()][h.getIndex()] = currentGroup
	}
      })
      
       
       
    }
    
    
    
     
   
    return {
      findCompleteCC,
      getActionTable,
      getGotoTable,
      getCollections
    }
})()
//class responsibilities: create and handle canonical collection objects. 
//class should ensure that redundant ccs are not made. Redundant handle objects could exist
//handle objects are defined by a rule, an index and an endsymbol, none of which should be redundant
//handleMap will map each handle to an index in collections in this way
