const { defineConfig } = require('cypress')

module.exports = defineConfig({
    defaultCommandTimeout: 6000,
    e2e: {
        specPattern: 'cypress/e2e/**/*.{cy,spec}.{js,jsx,ts,tsx}',
        baseUrl: 'http://localhost:4173',
        backendUrl: 'https://backend.m294.ict-bz.ch',
    },
})
