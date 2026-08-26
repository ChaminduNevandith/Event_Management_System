# Firebase Configuration Guide

You can configure Firebase in your backend using **Individual `.env` Variables** (No JSON file needed).

---

### How to get the keys from Firebase Console:

1. Go to [Firebase Console](https://console.firebase.google.com/).
2. Click **Project Settings ⚙️** (top left) -> **Service accounts** tab.
3. Click **Generate new private key** (downloads a `.json` file).
4. Open the downloaded `.json` file in a text editor (like VS Code or Notepad).
5. Copy the 3 required fields directly into your [`Backend/.env`](file:///c:/Users/DELL/Desktop/New%20folder%20(7)/Event%20management/Event_Management_System/Backend/.env):

```env
PORT=5000

FIREBASE_PROJECT_ID="your-project-id"
FIREBASE_CLIENT_EMAIL="firebase-adminsdk-xxxxx@your-project-id.iam.gserviceaccount.com"
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQC...\n-----END PRIVATE KEY-----\n"
```

> [!TIP]
> Keep the quotes `"..."` around `FIREBASE_PRIVATE_KEY` so that the `\n` linebreaks are preserved correctly.
