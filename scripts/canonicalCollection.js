const CC = (() => {
    const collections = []
    const handleMap = [] // [rule][endSymbol][index]
    const actionTable = []
    const gotoTable = []
    let i = 0
    
    function getCollection(handle){
        console.log(`${handle}`)
        if (handleMap[handle.getRule().getId()] === undefined){
            handleMap[handle.getRule().getId()] = []
        }
        if (handleMap[handle.getRule().getId()][handle.getEnd()] === undefined){
            handleMap[handle.getRule().getId()][handle.getEnd()] = []
        }
        if (handleMap[handle.getRule().getId()][handle.getEnd()][handle.getIndex()] !== undefined ){
            return Array.from(handleMap[handle.getRule().getId()][handle.getEnd()][handle.getIndex()])
        }

        const collection = []
        let allDescendantsAreNew = true
        let rep = undefined
        const cci = Handle.findCanonicalCollection(handle)
        cci.forEach(h => {
            if (handleMap[h.getRule().getId()] === undefined){
                handleMap[h.getRule().getId()] = []
            }
            if (handleMap[h.getRule().getId()][h.getEnd()] === undefined ){
                handleMap[h.getRule().getId()][h.getEnd()] = []
            }
            if (handleMap[h.getRule().getId()][h.getEnd()][h.getIndex()]){
                allDescendantsAreNew = false
                rep = h
            }else{
                collection.push(h)
            }
            handleMap[h.getRule().getId()][h.getEnd()][h.getIndex()]
        })
        
        let obj
        if (allDescendantsAreNew){
            obj = {
                index: i++,
                collection: collection
            }
        }else{
            obj = {
                index: handleMap[rep.getRule().getId()][rep.getEnd()][rep.getIndex()].index,
                collection: [...collection, ...handleMap[rep.getRule().getId()][rep.getEnd()][rep.getIndex()].collection]
            }
        }
        obj.collection.forEach(h => {
            handleMap[h.getRule().getId()][h.getEnd()][h.getIndex()] = obj
        })
        collections[obj.index] = obj
        console.log(obj)
        obj.collection.forEach(item => console.log(`${item}`))
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
              gotoMap[symbol].push(Handle.getNext(item)) 
            })
        return gotoMap
    }

    function findCompleteCC(entryHandle ){
       // assert(collections.length === 0)
        getCollection(entryHandle)
        while(true){
            const collectionsCopy = Array.from(collections)
            collectionsCopy.forEach(c => {
                const gotos = getGotos(c)
                if (gotoTable[c.index] === undefined){gotoTable[c.index] = []}
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
                    rule: item.getRule().getId()
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