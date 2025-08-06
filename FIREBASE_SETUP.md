# Firebase Authentication Setup Guide

This guide will help you set up Firebase Authentication for your To-Do App in just a few minutes.

## Step 1: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project" or select existing project
3. Name your project: "To-Do App"
4. Follow the setup wizard (you can disable Google Analytics if you want)

## Step 2: Add Your App

1. In Firebase Console, click "Add app"
2. Choose "Android" (for mobile app)
3. Enter your package name: `com.abiinanth.To_Do_App`
4. Download the `google-services.json` file
5. Place it in your project root

## Step 3: Enable Authentication

1. In Firebase Console, go to "Authentication"
2. Click "Get started"
3. Go to "Sign-in method" tab
4. Enable "Google" as a sign-in provider
5. Add your support email
6. Save

## Step 4: Get Configuration

1. In Firebase Console, go to "Project Settings" (gear icon)
2. Scroll down to "Your apps" section
3. Copy the config values:
   - apiKey
   - authDomain
   - projectId
   - storageBucket
   - messagingSenderId
   - appId

## Step 5: Update Configuration

1. Open `config/firebase.ts`
2. Replace the placeholder values with your actual Firebase config
3. Save the file

## Step 6: Test

1. Start your app: `npx expo start`
2. Test on a physical device
3. Try "Continue with Google"
4. You should see real Google authentication!

## Benefits of Firebase Auth:

✅ **No complex OAuth setup**  
✅ **Real Google authentication**  
✅ **Multiple providers** (Google, Facebook, Apple, Email)  
✅ **Secure token management**  
✅ **Free tier available**  
✅ **Easy to implement**  

## Next Steps:

Once Firebase is configured, you can easily add:
- Facebook Login
- Apple Sign In
- Email/Password authentication
- Phone number authentication

Firebase handles all the complex OAuth flows for you! 