const { initializeApp, restore } = require('firestore-export-import')

const config = require('./config/firebase-config.production.json')
const serviceAccountKey = config.serviceAccountKey

initializeApp(serviceAccountKey)

restore('./backup.json')

console.log("Restored db from backup!")