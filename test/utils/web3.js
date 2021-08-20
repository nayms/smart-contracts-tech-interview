const web3 = require('web3')

;[
  'toBN',
].forEach(m => {
  exports[m] = web3.utils[m]
})
