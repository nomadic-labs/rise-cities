const { initializeApp, backups } = require('firestore-export-import')
const fs = require('fs');


const config = require('./config/firebase-config.production.json')
const serviceAccountKey = config.serviceAccountKey

initializeApp(serviceAccountKey)

backups(['pages', 'config']).then((data) => {
  const parsedData = JSON.stringify(data, null, 2)
  fs.writeFileSync('backup.json', parsedData)
  console.log("Done writing backup file!")
})
