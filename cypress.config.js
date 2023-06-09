const { defineConfig } = require("cypress")

module.exports = defineConfig({
  execTimeout: 60000,
  e2e: {
    // Sets the base URL for the application under test
    baseUrl: 'https://apex.oracle.com/pls/apex/r/danmende/qa-application/home',
    setupNodeEvents(on, config) {
      on('before:run', async (details) => {
        console.log('override before:run')
        await beforeRunHook(details)
      })

      on('after:run', async () => {
        console.log('override after:run')
        await afterRunHook()
      })
    },
  },
})