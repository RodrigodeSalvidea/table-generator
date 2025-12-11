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
			})
			return message
		}
		conflict.getActions = () => Array.from(actions)
		conflict.getState = () => state
		conflict.getSymbol = () => symbol
		conflict.debug = () => {
		console.log(`Conflict detected at state ${state}, symbol ${symbol}`)
		actions.forEach(action => console.log(action))


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
		const conflict = conflictsMap[state][symbol]
		conflict.addAction(newAction)
	}
	conflictRecorder.getConflicts = () => conflictsList
	conflictRecorder.debug = () => {
		conflictsList.forEach(conflict => conflict.debug())
	}
	
	Object.freeze(conflictRecorder)
	return conflictRecorder
})()
