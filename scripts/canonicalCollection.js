const CC = (() => {
    const collections = []
    const handleMap = [] // [rule][endSymbol][index]
    const actionTable = []
    const gotoTable = []
    let i = 0
    
    function getCollection(handle){
        if (handleMap[handle.getRule()] === undefined){
            handleMap[handle.getRule()] = []
        }
        if (handleMap[handle.getRule()][handle.getEnd()] === undefined){
            handleMap[handle.getRule()][handle.getEnd()] = []
        }
        if (handleMap[handle.getRule()][handle.getEnd()][handle.getIndex()] !== undefined ){
            return Array.from(handleMap[handle.getRule()][handle.getEnd()][handle.getIndex()])
        }

        const collection = []
        let allDescendantsAreNew = true
        let rep = undefined
        const cci = Handle.findCanonicalCollection(handle)
        cci.forEach(h => {
            collection.push(h)
            if (handleMap[h.getRule()] === undefined){
                handleMap[h.getRule()] = []
            }
            if (handleMap[h.getRule()][h.getEnd()] === undefined ){
                handleMap[h.getRule()][h.getEnd()] = []
            }
            if (handleMap[h.getRule()][h.getEnd()][h.getIndex()]){
                allDescendantsAreNew = false
                rep = h
            }
            handleMap[h.getRule()][h.getEnd()][h.getIndex()]
        })
        
        let obj
        if (allDescendantsAreNew){
            obj = {
                index: i++,
                collection: collection
            }
        }else{
            obj = {
                index: handleMap[h.getRule()][h.getEnd()][h.getIndex()].index,
                collection: collection
            }
        }
        cci.forEach(h => {
            handleMap[h.getRule()][h.getEnd()][h.getIndex()] = obj
        })
        collections[obj.index] = obj
        return obj
    }
    

    function getGotos( collection ){
        const gotoMap = []
        const items = collection.collection
        items.filter(i => i.hasNext())
            .forEach(item => {
              const symbol = item.getCurrentSymbol()
              if(gotoMap[symbol]=== undefined){
                gotoMap[symbol] = []
              }
              gotoMap[symbol].push(item.getNext()) 
            })
        return gotoMap
    }

    function findCompleteCC(entryHandle ){
        assert(collections.length === 0)
        getCollection(entryHandle)
        while(true){
            const collectionsCopy = Array.from(collections)
            collectionsCopy.forEach(c => {
                const gotos = getGotos(c)
                Object.keys(gotos).forEach(key => {
                    gotos[key].forEach(item => getCollection(item))
                    gotoTable[c.index][key] = getCollection(gotos[key][0]).index
                }) 

                
            })
            if (collectionsCopy.length === collections.length){
                break
            }
        }
        
        return Array.from(collections)
    }

    function getActions(cc){
        if (!actionTable[cc.index]){
            actionTable[cc.index] = []
        }
        cc.collection.forEach(item => {
            if (!item.hasNext() && item.getEnd() !== EOF){
                actionTable[cc.index][item.getEnd()] = {
                    action: "reduce",
                    rule: item.getRule()
                }
            }
            if (!item.hasNext() && item.getEnd() === EOF){
                actionTable[cc.index][EOF] = {action: "accept"}
            }
            if (item.hasNext() && Rules.isTerminal(item.getCurrentSymbol()) ){
                actionTable[cc.index][item.getCurrentSymbol()] = gotoTable[cc.index][item.getCurrentSymbol()]
            }
        })
    }

    function getActionTable(){
      if (actionTable.length > 0){
        return actionTable
      }
      collections.forEach(cc => getActions(cc)) 
      return actionTable 
    } 
    function getGotoTable(){
      return gotoTable
    }

    

    

    return {
      findCompleteCC,
      getActionTable,
      getGotoTable
    }
})()
//class responsibilities: create and handle canonical collection objects. 
//class should ensure that redundant ccs are not made. Redundant handle objects could exist
//handle objects are defined by a rule, an index and an endsymbol, none of which should be redundant
//handleMap will map each handle to an index in collections in this way