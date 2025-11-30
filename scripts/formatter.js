const Formatter = (()=> {

    //key points to remember: tokens are already defined. 
    // states do not need to be named
    // actionTable: table[state][token] = {action: , state: , rule: }
    // gotoTable: table[state][token] = state
    let entryFunction = console.log
    const rules = []
    let actionTable = undefined
    let gotoTable = undefined
    
    function getTypes(){

    }
    function getMacros(){

    }
    function formatActionTable(cc, rules){
        const actionTable = cc.getActionTable()
        const nonTerminals = rules.getNonTerminals()
        const terminals = rules.getTerminals()


        let actionTableString = "{ "
        for(let state = 0; state < actionTable.length; state++){
            actionTableString+= "{"
            for(let i = 0; i < terminals.length; i++){
               if(actionTable[state][terminals[i]] === undefined){
                    actionTableString += "UNDEFINED"
               } else {
                    actionTableString += `${actionTable[state][terminals[i]].action} | ${actionTable[state][terminals[i]].rule !== undefined ? actionTable[state][terminals[i]].rule.getId() : actionTable[state][terminals[i]].state}`
               }
               if (i < terminals.length - 1){
                actionTableString+= ", "
               }

            }
            actionTableString+= "}"
            if (state < actionTable.length - 1){
                actionTableString += ", "
            }
        
            
        }
        actionTableString+= "}"
        
        return actionTableString
    }
    function formatGotoTable(cc){

    }


    function setEntryFunc(f){
        entryFunction = f
    }
    
    




    const returnObj = {
        getTypes,
        getMacros,
        formatActionTable,
        formatGotoTable,
        setEntryFunc

    }
    Object.freeze(returnObj)
    return returnObj
})()