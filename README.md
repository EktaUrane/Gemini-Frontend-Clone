# Gemini Frontend Clone Assignment - Kuvaka Tech

**Vercel Link**
[https://gemini-frontend-clone-d4lfips9l-ekta-uranes-projects.vercel.app/login]

**GitHub Repository:** 
[https://github.com/EktaUrane/Gemini-Frontend-Clone]

## Project Overview

This project is a frontend clone of a Gemini-style conversational AI chat application, built as an assignment for Kuvaka Tech. It simulates key features such as OTP-based authentication, chatroom management, AI messaging with typing indicators and throttling, image uploads, and a highly responsive, user-friendly interface with dark mode.

The application aims to demonstrate proficiency in React, modern state management (Zustand), robust form validation (React Hook Form + Zod), and a keen eye for UI/UX details.

## Features Implemented

### 1. Authentication
*   **OTP-based Login/Signup:** Simulated flow that always succeeds for any valid-looking input.
*   **Country Code Selection:** Fetches real country data (flags, dial codes) from `restcountries.com` and allows searching by country name.
*   **Form Validation:** Implemented with React Hook Form and Zod for schema-based validation.
*   **Session Persistence:** User authentication status and data saved in `localStorage`.

### 2. Dashboard
*   **Chatroom Listing:** Displays a list of user's chatrooms.
*   **Create/Delete Chatrooms:** Functionality to add and remove chatrooms with confirmation toasts.
*   **Debounced Search:** Filters chatrooms by title with a debounced input for performance.
*   **Logout:** Securely logs out the user and clears session.

### 3. Chatroom Interface
*   **Dynamic Chat UI:** Displays user and simulated AI messages with timestamps.
*   **Typing Indicator:** "Gemini is typing..." animation.
*   **AI Response Simulation:** Fake AI replies after a delay using `setTimeout`, with throttling to prevent rapid responses.
*   **Auto-scroll:** Automatically scrolls to the latest message.
*   **Reverse Infinite Scroll:** Simulates fetching older messages with client-side pagination (20 messages per page).
*   **Image Upload:** Supports uploading images (as Base64 previews) directly into the chat.
*   **Copy-to-Clipboard:** Feature on message hover for easy text/image URL copying.
*   **Loading Skeletons:** Displays placeholder skeletons for messages during initial load (or when fetching older messages).

### 4. Global UX Features
*   **Mobile Responsive Design:** Fully responsive layout using Tailwind CSS, adapting to various screen sizes.
*   **Dark Mode Toggle:** Seamless dark mode implementation.
*   **Toast Notifications:** Provides user feedback for key actions (OTP sent, message sent, chatroom deleted, etc.) using `react-hot-toast`.
*   **Keyboard Accessibility:** Ensures all main interactions are navigable and operable via keyboard.
*   **Made with Love:** A small attribution on the login page.

## Technical Stack

*   **Framework:** React (create-react-app with TypeScript)
*   **State Management:** Zustand (for global and persistent state)
*   **Form Validation:** React Hook Form + Zod
*   **Styling:** Tailwind CSS
*   **Routing:** React Router DOM
*   **Notifications:** React Hot Toast
*   **Icons:** React Icons
*   **Country Data:** `restcountries.com` API
*   **Deployment:** Netlify

## Setup and Run Instructions

1.  **Clone the repository:**
    ```bash
    git clone [YOUR_GITHUB_REPO_URL_HERE]
    cd gemini-clone
    ```
2.  **Install dependencies:**
    ```bash
    npm install
    ```
3.  **Start the development server:**
    ```bash
    npm start
    ```
    The application will open in your browser at `http://localhost:3000`.
