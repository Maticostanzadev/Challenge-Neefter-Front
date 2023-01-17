// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
  // getBytes,
} from "firebase/storage";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCwc08UkJq4hLWWTYQGKoQnZSZWR23J508",
  authDomain: "challenge-neefter.firebaseapp.com",
  projectId: "challenge-neefter",
  storageBucket: "challenge-neefter.appspot.com",
  messagingSenderId: "892701586387",
  appId: "1:892701586387:web:c8bf3bae5bcf431f9e7526"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);

export const uploadFile = async (file, id) => {
  const storageRef = ref(storage, `NFTs/${id}`);
  await uploadBytes(storageRef, file);
  const url = await getDownloadURL(storageRef);

  return url;
};