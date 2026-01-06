const Formatter = (()=> {

    //key points to remember: tokens are already defined. 
    // states do not need to be named
    // actionTable: table[state][token] = {action: , state: , rule: }
    // gotoTable: table[state][token] = state

   	function formatSizeMacros(cc, rules){
	return 
	`
#define NUM_RULES ${ rules.getAllRules().length}
#define NUM_STATES ${ cc.getStates().length }
#define NUM_TERMINALS ${ rules.getTerminals().length }
#define NUM_NONTERMINALS ${ rules.getNonTerminals().length }
`
	}
    
        function formatActionTable(cc, rules){
        const actionTable = cc.getActionTable()
        const nonTerminals = rules.getNonTerminals()
        const terminals = rules.getTerminals()


        let actionTableString = "{\n"
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
                actionTableString += ",\n"
            }
        
            
        }
        actionTableString+= "\n}"
        
        return actionTableString
    }
    function formatGotoTable(cc, rules){
        const gotoTable = cc.getGotoTable()
        const nonTerminals = rules.getNonTerminals()


        let gotoTableString = "{\n"

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
                gotoTableString += ",\n"
            }

        }
        gotoTableString+= "\n}"


        return gotoTableString

    }

    
    function formatNonTerminals(rules){
        let nonTerminalsString = "enum e_NonTerminal{\n"
        const nonTerminals = rules.getNonTerminals()
        for(let i = 0; i < nonTerminals.length; i++){
            nonTerminalsString+= "\t" + `PARSER_${nonTerminals[i]}`
            if (i < nonTerminals.length - 1){
                nonTerminalsString+= ","
            }
            nonTerminalsString+= "\n"
        }
        nonTerminalsString+= "}"
        return nonTerminalsString
    }

    function formatRuleSizes(rules){
        return `{${rules.getAllRules().map(rule => rule.getRightSide()[0] === EPSILON ? 0 : rule.getRightSide().length).join(", ")}}`

    }
    function formatRuleReductions(rules){
	    return `{${rules.getAllRules().map(rule => rule.getLeftSide()).join(", ")}}`
    }

    function formatTerminalSymbols(rules){
        let terminalsString = "enum e_Terminal{\n"
        const terminals = rules.getTerminals()

        for(let i = 0; i < terminals.length; i++){
            terminalsString+= "\t" + `PARSER_${terminals[i]}`
            if (i < terminals.length - 1){
                terminalsString+= ","
            }
            terminalsString+="\n"
        }
        terminalsString+="}"
        return terminalsString
    }


   function formatExterns(){
	   return `
extern int ruleSizes[ NUM_RULES ];
extern NonTerminal reductions[ NUM_RULES ];
extern Action actionTavle[ NUM_STATES ][ NUM_TERMINALS ];
extern ParserState gotoTable[ NUM_STATES ][ NUM_NONTERMINALS ];    
`
   }
   function formatSourceFileName(name){
   	return `----${name}.c----`
   }
   function formatHeaderFileName(name){
	return `----${name}.h----`
   }

    const returnObj = {
        formatSizeMacros,
	formatActionTable,
        formatGotoTable,
        formatNonTerminals,
        formatRuleSizes,
	formatRuleReductions,
        formatTerminalSymbols,
	formatExterns,
	formatSourceFileName, 
	formatHeaderFileName

    }
    Object.freeze(returnObj)
    return returnObj
})()
