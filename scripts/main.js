
const rulesArea = document.querySelector('#cfg-rules')
const submitButton = document.querySelector('#submit-grammar-button')

submitButton.addEventListener('click', () => {
  const  rulesString = rulesArea.value
  Rules.initializeRules(rulesString)
   
})



