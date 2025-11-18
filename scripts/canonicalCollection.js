const SetFactory = (() => {
  function makeSet(){
    const set = {}
    const handles = []
    let processed =  false

    set.markProcessed = () => { processed = true }
    set.add = (handle) => { 
      if (handles.every(h => !Handle.equals(h, handle))){
        handles.push(handle) 
      }
    }
    set.getHandles = () => Array.from(handles)
    set.debug = () => {
      console.log("[") 
      handles.forEach(h => {console.log(`${h}`)})
      console.log("]")
    }
    Object.freeze(set)
    return set
 
  }
 
  return { makeSet }
})()






const CC = (() => {
    const sets = []
    const setMap = [] // [rule][endSymbol][index]
    const actionTable = []
    const gotoTable = []
    const cc = []
    let i = 0

    function compute(entry){
      cc.push(Handle.closure(entry))

      cc.forEach(collection => {
        collection.markProcessed()
        collection.getHandles().forEach(h => {
          
	})


      })
    }

	      
		  
})()
