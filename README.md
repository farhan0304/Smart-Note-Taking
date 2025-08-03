# NoteWise - Smart Note-Taking Application


**NoteWise** is a modern, full-stack note-taking application designed to provide a seamless and intelligent writing experience. Built with a powerful tech stack including Next.js and Firebase, it goes beyond simple note-taking by integrating generative AI to help users refine their content and generate relevant titles effortlessly.

The application features a clean, responsive interface with both light and dark modes, secure user authentication, and a rich text editor, making it a robust platform for all your note-taking needs.

---

## Key Features

* **Secure Authentication:** Users can sign up and log in using their email and password or with a single click via their Google account, powered by Firebase Authentication.
* **Rich Text Editor:** A beautiful and functional Tiptap-based editor that supports various formatting options, including headings, bold, italics, lists, blockquotes, and a color palette.
* **Full CRUD Functionality:** Users have complete control over their notes with the ability to **C**reate, **R**ead, **U**pdate, and **D**elete them. All notes are securely stored and linked to the user's account in Firestore.
* **AI-Powered Content Refinement:** Users can leverage the power of generative AI to automatically correct grammar, improve sentence structure, and enhance the clarity of their notes without losing the original formatting.
* **AI-Powered Title Generation:** The application can analyze the content of a note and suggest a concise, relevant title, saving the user time and effort.
* **Accept/Decline AI Suggestions:** A user-friendly interface allows users to review AI-generated suggestions for both titles and content, and choose to either accept or decline them.
* **Responsive Design with Dark/Light Mode:** A beautiful and accessible UI that looks great on all devices and includes a theme switcher for user comfort.
* **Protected Routes:** The user dashboard and note pages are protected, ensuring that only authenticated users can access their personal content.

---

## Technology Stack

* **Framework:** [Next.js](https://nextjs.org/) (App Router)
* **Styling:** [Tailwind CSS](https://tailwindcss.com/) (with JIT compiler and modern CSS variables for theming)
* **Authentication:** [Firebase Authentication](https://firebase.google.com/docs/auth)
* **Database:** [Cloud Firestore](https://firebase.google.com/docs/firestore)
* **AI Integration:** [LangChain.js](https://js.langchain.com/) for structuring AI interactions.
* **AI Model Provider:** [Fireworks.ai](https://fireworks.ai/) (using the Llama 3.3 70B Instruct model)
* **Rich Text Editor:** [Tiptap](https://tiptap.dev/)
* **Deployment:** Vercel (Recommended)

---

## User Flow

The application provides a simple and intuitive journey for users.

#### **Unauthenticated User**

1.  **Landing Page:** A visitor arrives at the hero page, which showcases the app's value proposition and a "Start Writing" call-to-action button.
2.  **Authentication:** Clicking the CTA button redirects the user to the login page. From there, they can navigate to the registration page.
3.  **Registration:** A new user can create an account using their name, email, and password.
4.  **Login:** An existing user can log in with their credentials or via their Google account.

#### **Authenticated User**

1.  **Dashboard:** Upon successful login, the user is redirected to their personal dashboard, which displays a list of all their created notes.
2.  **Create a Note:** The user can click the "New Note" button, which navigates them to a dedicated page (`/note/new`) to compose a new note. The note is only saved to the database when the user clicks "Save Note".
3.  **View a Note:** Clicking on any note title from the dashboard takes the user to that note's dedicated page in view-only mode.
4.  **Edit a Note:** From the note page or the dashboard, the user can enter "Edit Mode." This makes the title and content editable via the Tiptap editor.
5.  **Use AI Features:** In edit mode, the user can click "Refine Note" or "Generate Title." An AI-generated suggestion appears in a review box.
6.  **Accept/Decline:** The user can accept the suggestion, which updates the content, or decline it to keep their original version.
7.  **Delete a Note:** Users can delete notes from either the dashboard or the note page, with a confirmation prompt to prevent accidental deletion.
8.  **Logout:** The user can sign out, which clears their session and redirects them to the login page.

---

## Local Setup and Installation

To run this project locally, follow these steps:

#### **1. Clone the Repository**

```bash
git clone https://github.com/farhan0304/Smart-Note-Taking.git
cd notewise-app 
```

#### **2. Install Dependencies**

```bash
npm install
```

#### **3. Set Up Environment Variables**

Create a file named .env.local in the root of your project and add your Firebase and Fireworks AI credentials.

```bash
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY="AIza..."
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN="your-project-id.firebaseapp.com"
NEXT_PUBLIC_FIREBASE_PROJECT_ID="your-project-id"
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET="your-project-id.appspot.com"
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID="..."
NEXT_PUBLIC_FIREBASE_APP_ID="1:..."

# Fireworks AI API Key
FIREWORKS_API_KEY="fc-..."
```
#### **4. Firebase Configuration**

* Create a project on the Firebase Console.

* Authentication: Go to the "Authentication" section and enable the Email/Password and Google sign-in providers.

* Firestore: Go to the "Firestore Database" section and create a database. Start in Production mode.

* Firestore Rules: Navigate to the "Rules" tab in Firestore and paste the following security rules to protect user data:

```bash
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /notes/{noteId} {
      allow read, update, delete: if request.auth.uid == resource.data.authorId;
      allow create: if request.auth.uid != null;
    }
  }
}
```

#### **5. Run the Application**

Start the development server:

```bash
npm run dev
```

Open http://localhost:3000 in your browser to see the application.


