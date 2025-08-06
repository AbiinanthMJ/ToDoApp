# Google OAuth Setup Guide - Step by Step

This guide will walk you through setting up Google OAuth for your To-Do App.

## Step 1: Go to Google Cloud Console

1. Open your browser and go to: https://console.cloud.google.com/
2. Sign in with your Google account

## Step 2: Create or Select a Project

1. **If you don't have a project:**
   - Click "Select a project" at the top
   - Click "New Project"
   - Name it: "To-Do App OAuth"
   - Click "Create"

2. **If you have a project:**
   - Click "Select a project" at the top
   - Choose your existing project

## Step 3: Enable Google+ API

1. In the left sidebar, click "APIs & Services" → "Library"
2. Search for "Google+ API"
3. Click on "Google+ API"
4. Click "Enable"

## Step 4: Create OAuth 2.0 Credentials

1. In the left sidebar, click "APIs & Services" → "Credentials"
2. Click "Create Credentials" → "OAuth 2.0 Client IDs"

## Step 5: Configure OAuth Consent Screen

1. If prompted, click "Configure Consent Screen"
2. Choose "External" user type
3. Click "Create"
4. Fill in the required fields:
   - **App name**: "To-Do App"
   - **User support email**: Your email
   - **Developer contact information**: Your email
5. Click "Save and Continue"
6. Click "Save and Continue" (skip scopes)
7. Click "Save and Continue" (skip test users)
8. Click "Back to Dashboard"

## Step 6: Create OAuth 2.0 Client ID

1. Go back to "Credentials"
2. Click "Create Credentials" → "OAuth 2.0 Client IDs"
3. Choose "Android" for Android app
4. Fill in the details:
   - **Name**: "To-Do App Android"
   - **Package name**: `com.abiinanth.To_Do_App`
   - **SHA-1 certificate fingerprint**: (we'll get this next)

## Step 7: Get SHA-1 Fingerprint

### Option 1: Using keytool (if you have Java installed)

#### For Development (Debug):
```bash
# On Windows (PowerShell):
keytool -list -v -keystore "%USERPROFILE%\.android\debug.keystore" -alias androiddebugkey -storepass android -keypass android

# On macOS/Linux:
keytool -list -v -keystore ~/.android/debug.keystore -alias androiddebugkey -storepass android -keypass android
```

#### For Production:
```bash
# If you have a release keystore:
keytool -list -v -keystore your-release-key.keystore -alias your-key-alias
```

### Option 2: Using Android Studio (Recommended)

1. Open Android Studio
2. Go to "Tools" → "SDK Manager"
3. Click on "SDK Tools" tab
4. Check "Android SDK Build-Tools" and "Android SDK Platform-Tools"
5. Click "Apply" and install
6. Go to "File" → "Project Structure"
7. Click on "Modules" → "app"
8. Click on "Signing" tab
9. You'll see the SHA-1 fingerprint there

### Option 3: Using Expo (Development Only)

For development with Expo, you can use this default SHA-1 fingerprint:
```
5E:8F:16:06:2E:A3:CD:2C:4A:0D:54:78:76:BA:A6:F3:8C:AB:F6:25
```

**Note**: This is a default Expo development fingerprint. For production, you'll need to get your actual SHA-1.

### Option 4: Using Online SHA-1 Generator

1. Go to: https://developers.google.com/android/guides/client-auth
2. Follow the instructions to generate your SHA-1

5. Copy the SHA-1 fingerprint (looks like: `AA:BB:CC:DD:EE:FF:00:11:22:33:44:55:66:77:88:99:AA:BB:CC:DD`)
6. Paste it into the Google Cloud Console
7. Click "Create"

## Step 8: Copy Your Client ID

1. After creating the OAuth 2.0 Client ID, you'll see a popup with your credentials
2. **Copy the Client ID** (looks like: `123456789-abcdefghijklmnop.apps.googleusercontent.com`)

## Step 9: Update Your App Configuration

1. Open `config/auth.ts` in your project
2. Replace `'YOUR_GOOGLE_CLIENT_ID'` with your actual Client ID:

```typescript
GOOGLE: {
  CLIENT_ID: '123456789-abcdefghijklmnop.apps.googleusercontent.com', // Your actual Client ID
  REDIRECT_URI: 'todoapp://',
},
```

## Step 10: Test Your Setup

1. Start your app: `npm start`
2. Test on a physical device (not simulator)
3. Try the "Continue with Google" button
4. You should see the Google OAuth consent screen
5. After authentication, you'll be logged in with your real Google account

## Troubleshooting

### Common Issues:

1. **"Invalid Client ID" error**
   - Double-check your Client ID is correct
   - Ensure package name matches exactly: `com.abiinanth.To_Do_App`

2. **"Redirect URI mismatch" error**
   - Make sure redirect URI in Google Console is: `todoapp://`
   - Check that your app scheme is correctly configured

3. **"SHA-1 fingerprint not found"**
   - Run the keytool command again
   - Make sure you're using the correct keystore

4. **App crashes during OAuth**
   - Check that expo-auth-session and expo-web-browser are installed
   - Verify plugins are added to app.json

### Debug Tips:

1. Check the console logs in your development tools
2. Look for OAuth flow progress messages
3. Verify your Google Cloud Console settings
4. Test on a physical device, not simulator

## Security Notes:

- Never commit your Client ID to public repositories
- Use environment variables for production
- Keep your SHA-1 fingerprints secure
- Regularly rotate your OAuth credentials

## Next Steps:

Once Google OAuth is working:
1. Test with different Google accounts
2. Implement proper error handling
3. Add user profile management
4. Consider implementing token refresh 