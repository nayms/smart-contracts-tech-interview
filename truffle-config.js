const solcVersion = "0.7.0"

module.exports = {
  networks: {
    test: {
      host: "localhost",
      network_id: "*",
      port: 8545,
      gasPrice: 1000000000      // 1 gwei
    },
  },

  mocha: {
    reporter: 'spec',
    timeout: 100000,
  },

  compilers: {
    solc: {
      version: solcVersion,
      settings: {
        optimizer: {
          enabled: true,
        }
      }
    }
  }
}