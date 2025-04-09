// lib/firebaseConfig.ts
import { initializeApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
	apiKey: "YOUR_REAL_API_KEY",
	authDomain: "your-project.firebaseapp.com",
	projectId: "your-project-id",
	storageBucket: "your-project.appspot.com",
	messagingSenderId: "XXXXXX",
	appId: "XXXXXXXXXXXX"
};

const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
const auth = getAuth(app);

export { app, auth };
