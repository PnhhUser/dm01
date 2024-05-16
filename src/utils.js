import {
  createUserWithEmailAndPassword,
  reauthenticateWithCredential,
  sendEmailVerification,
  signInWithEmailAndPassword,
  signOut,
  updateEmail,
  updatePassword,
} from "firebase/auth";
import { auth, db } from "./config/firebase";
import {
  collection,
  doc,
  getDocs,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { EmailAuthProvider } from "firebase/auth/cordova";

export const ROLE = {
  USER: 1,
  ADMIN: 99,
};

export const COLLECTION = {
  USERS: "users",
};

export const sleep = (ms) =>
  new Promise((resolve) => setTimeout(() => resolve(), ms));

// function generateID(length = 16) {
//   let id = "";
//   const possible =
//     "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

//   for (let i = 0; i < length; i++) {
//     id += possible.charAt(Math.floor(Math.random() * possible.length));
//   }

//   return id;
// }

export const regxEmail = function (email) {
  let regex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,4}$/;
  let result = regex.test(email);
  return result;
};

export const SignUp = async (email, password) => {
  try {
    const user = await createUserWithEmailAndPassword(auth, email, password);

    if (user) {
      await setDoc(doc(collection(db, COLLECTION.USERS)), {
        email: email,
        password: password,
        userId: user.user.uid,
        role: ROLE.USER,
      });

      return user;
    }
  } catch (error) {
    console.log(error);
    return error;
  }
};

export const signIn = async function (email, password) {
  try {
    await signInWithEmailAndPassword(auth, email, password);

    console.log("login success");
  } catch (error) {
    return error;
  }
};

export const logout = async function () {
  try {
    await signOut(auth);

    console.log("logout success");
  } catch (error) {
    return error;
  }
};

export const readData = async function (collectionName) {
  try {
    const docRef = collection(db, collectionName);
    const docSnap = await getDocs(docRef);

    const data = docSnap.docs.map((doc) => {
      return {
        ...doc.data(),
        id: doc.id,
      };
    });

    return data;
  } catch (error) {
    return error;
  }
};

export const updateData = async function (collectionName, data) {
  try {
    const docRef = doc(db, collectionName, data.id);

    await updateDoc(docRef, {
      ...data,
    });
  } catch (error) {
    return error;
  }
};

export const updateUser = async function (person, newEmail, newPass) {
  try {
    console.log(auth);
    const userCredential = EmailAuthProvider.credential(
      "hoang12@gmail.com",
      "12345678"
    );

    let isOk = false;

    await reauthenticateWithCredential(auth.currentUser, userCredential);

    console.log("xác thực thành công", userCredential._email);

    await updateEmail(auth.currentUser, newEmail);

    console.log("update email thành công");

    await updatePassword(auth.currentUser, newPass);

    console.log("update password thành công");

    person.email = newEmail;
    person.password = newPass;

    updateData(COLLECTION.USERS, person);

    await sendEmailVerification(auth.currentUser);

    console.log("Xác thực thành công");
    isOk = true;

    return { ok: isOk };
  } catch (error) {
    console.log(error);
    return error;
  }
};
