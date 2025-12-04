ConflictRecorder = (() => {
	const conflictsList = []
	const conflictsMap = []
	const conflictRecorder = {}
	
	conflictRecorder.recordConflict = (state, symbol, newAction, oldAction) => {
		if (conflictsMap[state] === undefined){
			conflictsMap[state] = []
		}
		if (conflictsMap[state][symbol] === undefined){
			const conflict = makeConflict()
			conflict.setState(state)
			conflict.setSymbol(symbol)
			conflict.addAction(newAction)
			conflict.addAction(oldAction)
			conflictsList.push(conflict)
			conflictsMap[state][symbol] = conflict
			return
		}
		const conflict = conflictMap[state][symbol]
		conflict.addAction(newAction)
	}
	conflictRecorder.getConflicts = () => conflictsList
	conflictRecorder.freeze()
	return conflictRecorder
})()
