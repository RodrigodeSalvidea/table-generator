const GroupTreeNodeFactory = (() => {
  function makeGroupNode(){
    let node = {}
    let index = undefined
    let children = []
    node.addChild = (next) => {
      children.push(next)
      return node
    }
    node.setIndex = (i) => {
      index = i
      return node
    }
    node.hasChildren = () => {
      return children.length > 0
    }
    node.log = () => {
      console.log(`[${index}]:: {`)
      children.forEach(child => child.log())
      console.log(`}`)
    }
    Object.freeze(node)
    return node
  }
 return {
   makeGroupNode
 }
})()
