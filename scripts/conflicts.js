ConflictRecorder = (() => {
	const makeConflict = () => {
		const conflict = {}
		const actions = []
		let state = undefined
		let symbol = undefined
		conflict.setState = (s) => {state = s}
		conflict.setSymbol = (s) => {symbol = s}
		conflict.addAction = (action) => { actions.push(action) }
		conflict.getMessage = () => {
			let message = `Conflict at state ${state} and symbol ${symbol}.`
			actions.forEach(action => {
				if (action.action === "shift"){
					message+= `shift ${action.state}.`
				} else{
					message+= `reduce ${action.state}.`
				}
			}
			return message
		}
		Object.freeze(conflict)
		return conflict
	}

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
	Object.freeze(conflictRecorder)
	return conflictRecorder
})()
