const Formatter = (()=> {

    //key points to remember: tokens are already defined. 
    // states do not need to be named
    // actionTable: table[state][token] = {action: , state: , rule: }
    // gotoTable: table[state][token] = state

    
    
    function getTypes(){

    }
    function getMacros(cc){


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
                    actionTableString += `${actionTable[state][terminals[i]].action.toUpperCase()} | ${actionTable[state][terminals[i]].rule !== undefined ? actionTable[state][terminals[i]].rule.getId() : actionTable[state][terminals[i]].state}`
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
    function formatGotoTable(cc, rules){
        const gotoTable = cc.getGotoTable()
        const nonTerminals = rules.getNonTerminals()


        let gotoTableString = "{ "

        for(let state = 0; state < gotoTable.length; state++){
            gotoTableString += " { "
            for(let i = 0; i < nonTerminals.length; i++){
                gotoTableString += gotoTable[state][nonTerminals[i]] === undefined ? "UNDEFINED" : String(gotoTable[state][nonTerminals[i]])
            
                if (i < nonTerminals.length - 1){
                    gotoTableString += ", "
                }
            }
            gotoTableString+= "}"
            if (state < gotoTable.length - 1){
                gotoTableString += ", "
            }

        }
        gotoTableString+= "}"


        return gotoTableString

    }

    
    function formatNonTerminals(rules){
        let nonTerminalsString = "enum NonTerminal{\n"
        const nonTerminals = rules.getNonTerminals()
        for(let i = 0; i < nonTerminals.length; i++){
            nonTerminalsString+= "\t" + nonTerminals[i]
            if (i < nonTerminals.length - 1){
                nonTerminalsString+= ","
            }
            nonTerminalsString+= "\n"
        }
        nonTerminalsString+= "}"
        return nonTerminalsString
    }

    function formatRuleSizes(rules){
        return `{${rules.getAllRules().map(rule => rule.getRightSide().length).join(", ")}}`

    }


    
    
    




    const returnObj = {
        getTypes,
        getMacros,
        formatActionTable,
        formatGotoTable,
        formatNonTerminals,
        formatRuleSizes

    }
    Object.freeze(returnObj)
    return returnObj
})()