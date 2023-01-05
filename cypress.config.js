const { defineConfig } = require('cypress')

module.exports = defineConfig({
    defaultCommandTimeout: 6000,
    e2e: {
        specPattern: 'cypress/e2e/**/*.{cy,spec}.{js,jsx,ts,tsx}',
        baseUrl: 'http://localhost:4173',
        backendUrl: 'http://modul-294-backend.lndo.site',
    },
})
