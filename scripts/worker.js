importScripts('./rule.js','./handle.js','./canonicalCollection.js')


self.onmessage = (messageData) => {
	switch(messageData.command){
		case "init":
		Rules.initializeRules(messageData.rulesString);		
		const entry = Handle.makeHandle(Rules.getExpansionRules(Rules.getGoal())[0], EOF, 0);
  		CC.compute(entry);

		case "resolveConflict"

		case "
