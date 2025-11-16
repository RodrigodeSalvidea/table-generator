const GroupFactory = (() => {
  function makeGroup(){
    const obj = {}
    let index = undefined 
    let nexts = []  
    obj.setIndex = (i) => {
      index = i
      return obj
    }
     


    return obj
  }
 return {
   makeGroup
 }
})()
