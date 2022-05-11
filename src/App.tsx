import React, { useEffect, useState } from 'react';
import './App.css';
import { initializeApp, FirebaseApp } from 'firebase/app';
import { getFirestore, collection, getDocs, DocumentData, Firestore, deleteField, doc, updateDoc } from 'firebase/firestore/lite';
import { doc as docF, onSnapshot, getFirestore as getFirestoreF } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBKhSshByqqtS2xs91uoSiaIuAr1hTjEGY",
  authDomain: "react-firebase-211e3.firebaseapp.com",
  projectId: "react-firebase-211e3",
  storageBucket: "react-firebase-211e3.appspot.com",
  messagingSenderId: "316307753292",
  appId: "1:316307753292:web:98da3d917b03deccdea7e9",
  measurementId: "G-ZJ7RVVP9HV"
};

// Initialize Firebase
const app: FirebaseApp = initializeApp(firebaseConfig);
const db: Firestore = getFirestore(app);
const dbF: Firestore = getFirestoreF(app);

async function getDBZCharacters(db: Firestore, setMain: React.Dispatch<React.SetStateAction<String>>, setSecondary: React.Dispatch<React.SetStateAction<String>>) {
  const dbzCol = collection(db, 'dbz');
  const dbzSnapshot = await getDocs(dbzCol);
  const dbzList: DocumentData[] = dbzSnapshot.docs.map(doc => doc.data());
  let firstElement: DocumentData = dbzList[0];
  let main: String = firstElement['main'];
  let secondary: String = firstElement['secondary'];
  setMain(main);
  setSecondary(secondary);
}

async function addElement(db: Firestore) {
  try {
    let newCharacterRef = doc(db, 'dbz', 'characters');
    await updateDoc(newCharacterRef, {
      main: 'Goku3'
    });
  } catch (e) {
    console.error("Error adding document: ", e);
  }
}

async function deleteElement(db: Firestore) {
  try {

    let newCharacterRef = doc(db, 'dbz', 'characters');
    await updateDoc(newCharacterRef, {
      main: deleteField()
    });
  } catch (e) {
    console.error("Error adding document: ", e);
  }
}


function App() {
  const [main, setMain] = useState<String>('');
  const [secondary, setSecondary] = useState<String>('');

  useEffect(() => {
    // getDBZCharacters(db, setMain, setSecondary);

    const unsuscribe = onSnapshot(docF(dbF, "dbz", "characters"), (doc) => {
      console.log('llego aca');
      console.log("Current data: ", doc.data());
    }, (err) => {
      console.log('Soy el error');
      console.log('err', err);

    });
    return () => {
      unsuscribe();
    }
  });
  return (
    <div className="App">
      <p>Main: {main}</p>
      <p>Secondary: {secondary}</p>
      <button onClick={async () => {
        await addElement(db);
      }}>Agregar Caracter</button>
      <button onClick={async () => {
        await deleteElement(db);
      }}>Delete Caracter</button>
    </div>
  );
}

export default App;
