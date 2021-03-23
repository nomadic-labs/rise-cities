
# React/Gatsby CMS starter

## Set up Firebase services
- Authentication
  - go to "Web Setup" and get API config and add it to `config/firebase-config.json`
- Realtime database
  - update rules as follows:
```
{
  "rules": {
    "pages": {
    	".read": true,
    	".write": "auth != null && root.child('users').child(auth.uid).child('isEditor').val() == true"
    },
    "users": {
      "$user_id": {
        ".write": "$user_id === auth.uid",
        ".read": "$user_id === auth.uid"
      }
    },
  }
}
```
- Storage
  - get service account keys and add to `config/firebase-config.json`

## Clone the starter kit
- Set env vars in .env files
- update package.json with project title and description

