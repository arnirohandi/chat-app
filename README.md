# CHATLY - React Native Mobile Chat App

## Overview

This project is a mobile chat application built using React Native, Expo, and Google Firestore Database. It allows users to chat in real-time, send images, share their location, and read messages offline. The app supports both Android and iOS platforms, ensuring a smooth user experience across different devices.

## Features

- **User Authentication**: Anonymous login via Google Firebase Authentication.
- **Real-Time Chat**: Chat conversations are stored in Google Firestore and updated in real-time.
- **Image Sharing**: Users can pick images from their phone's gallery or take pictures using the camera.
- **Location Sharing**: Users can share their current location via a map view in the chat.
- **Offline Functionality**: Messages are stored locally, allowing users to read conversations offline.
- **Screen Reader Compatibility**: The app is designed to be accessible for users with visual impairments.
- **Customizable UI**: Users can choose a background color for the chat screen and enter their name.

## Technical Requirements

- **React Native**: For building the mobile app.
- **Expo**: To streamline the development process and manage app deployment.
- **Google Firestore Database**: To store chat messages in the cloud.
- **Firebase Cloud Storage**: To store images sent in chats.
- **Gifted Chat**: A library to create a beautiful chat interface.
- **Google Firebase Authentication**: For authenticating users anonymously.
- **AsyncStorage**: To store messages locally when users are offline.

## Installation

1. Clone this repository:
   ```bash
   git clone https://github.com/yourusername/chat-app.git
   ```
2. Navigate to the project folder:
   ```bash
   cd chat-app
   ```
3. Install the dependencies:
   ```bash
   npm install
   ```
4. Start the Expo development server:
   ```bash
   expo start
   ```

## Usage

- Upon launching the app, users will be prompted to enter their name and choose a background color for the chat screen.
- Users can start chatting, send images, and share their location in real-time.
- The app will store messages offline and allow users to view them even when they are not connected to the internet.

## Features in Progress

- Push notifications (coming soon)
- Enhanced user profile management
- Group chat functionality
