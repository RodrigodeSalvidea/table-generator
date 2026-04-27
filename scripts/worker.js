importScripts('./globals.js','./rule.js','./handle.js','./canonicalCollection.js', './conflicts.js','./formatter.js')
console.log('Worker script loaded and executing!');
//console.log(CC)
//debugger;

onmessage = (m) => {
	console.log("message recived")
	const messageData = m.data
	console.log(messageData)
	switch (messageData.message){
	case "init":
	Rules.initializeRules(messageData.rulesString);		
	const entry = Handle.makeHandle(Rules.getExpansionRules(Rules.getGoal())[0], EOF, 0);
	CC.compute(entry)
	console.log(CC.exportData(), Rules.exportData())
	postMessage({
		message: "init",
		cc: CC.exportData(),
		rules: Rules.exportData(),
		conflicts: ConflictRecorder.exportData()
	})
	break;
	case "edit":
	console.log("worker will edit the CC object");
	break;
	case "format":
  const numStates = CC.getStates().length;
  const fileName = 'parser-tables';
  const actionTypeDecl = `typedef unsigned int Action;`;
  const parserStateDecl = 'typedef unsigned int ParserState;';
  const reduceDecl = '#define REDUCE 0x20000000';
  const shiftDecl = '#define SHIFT  0x80000000';
  const acceptDecl = '#define  ACCEPT 0x40000000';
  const undefinedDecl = `#define UNDEFINED 0xffffffff`;
  const ruleSizeTableDecl = `int ruleSizes[ NUM_RULES ] = ${Formatter.formatRuleSizes(Rules)};`;
  const ruleReductionTableDecl = `NonTerminal reductions[ NUM_RULES ] = ${Formatter.formatRuleReductions(Rules)};`;
  const actionTableDecl = `Action actionTable[ NUM_STATES ][ NUM_TERMINALS ] = ${Formatter.formatActionTable(CC, Rules)};`;
  const gotoTableDecl = `ParserState gotoTable[ NUM_STATES ][ NUM_NONTERMINALS] = ${Formatter.formatGotoTable(CC, Rules)};`;
  const nonTerminalsDecl = `${Formatter.formatNonTerminals(Rules)};${'\n'}typedef enum e_Terminal Terminal;`;
  const terminalsDecl = `${Formatter.formatTerminalSymbols(Rules)};${'\n'}typedef enum e_NonTerminal NonTerminal;`;
  const sizesDecl = Formatter.formatSizeMacros(CC, Rules);
  const tokenNames = Formatter.formatTokenNameTable(Rules);

  const externsDecl = Formatter.formatExterns();
  const srcLabel = Formatter.formatSourceFileName(fileName);
  const headerLabel = Formatter.formatHeaderFileName(fileName);

  headerFileText = Array.from([
    reduceDecl,
    shiftDecl,
    acceptDecl,
    undefinedDecl,
    terminalsDecl,
    nonTerminalsDecl,
    actionTypeDecl,
    parserStateDecl,
    sizesDecl,
    externsDecl,
  ]).join('\n');

  sourceFileText = Array.from([
    tokenNames,
    ruleSizeTableDecl,
    ruleReductionTableDecl,
    actionTableDecl,
    gotoTableDecl,
  ]).join('\n');

  displayText = Array.from([
    headerLabel,
    reduceDecl,
    shiftDecl,
    acceptDecl,
    undefinedDecl,
    terminalsDecl,
    nonTerminalsDecl,
    actionTypeDecl,
    parserStateDecl,
    sizesDecl,
    externsDecl,
    srcLabel,
    tokenNames,
    ruleSizeTableDecl,
    ruleReductionTableDecl,
    actionTableDecl,
    gotoTableDecl,
  ])
  postMessage({
    message: "format",
    headerFileText,
    sourceFileText,
    displayText,
  })
  break;
  default:
  console.log("worker message not recognized");
  break;

	
	}

	 
}

