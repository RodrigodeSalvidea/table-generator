importScripts('./globals.js','./rule.js','./handle.js','./canonicalCollection.js', './conflicts.js')
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
	}

	/*
  	CC.compute(entry);
	console.log("...computing cc in worker thread")
	postMessage({
		message: "init"
		cc: CC.exportData(),
		rules: rules.exportData()
	})
*/

	 
}

