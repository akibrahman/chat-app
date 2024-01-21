import axios from "axios";
import {
  //   GoogleAuthProvider,
  createUserWithEmailAndPassword,
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  //   signInWithPopup,
  signOut,
  updateProfile,
} from "firebase/auth";
import { createContext, useEffect, useState } from "react";
import { app } from "../../firebase.config";

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [authReloader, setAuthReloader] = useState(true);
  const [privateRouteLoader, setPrivateRouteLoader] = useState(true);
  const [conversationOpen, setConversationOpen] = useState(true);
  //   const googleProvider = new GoogleAuthProvider();
  //! Getting Auth
  const auth = getAuth(app);
  //! For Registration
  const registration = (email, password) => {
    setPrivateRouteLoader(false);
    return createUserWithEmailAndPassword(auth, email, password);
  };
  //! For Login
  const login = (email, password) => {
    setPrivateRouteLoader(false);
    return signInWithEmailAndPassword(auth, email, password);
  };
  //! Update Profile
  const UpdateProfile = (name, photo) => {
    setPrivateRouteLoader(false);
    return updateProfile(auth.currentUser, {
      displayName: name,
      photoURL: photo,
    });
  };
  //! For Google Login
  //   const googleLogin = () => {
  //     setPrivateRouteLoader(false);
  //     return signInWithPopup(auth, googleProvider);
  //   };
  //! For Logout
  const logout = () => {
    setPrivateRouteLoader(false);
    return signOut(auth);
  };
  //! State Listener
  useEffect(() => {
    const un = onAuthStateChanged(auth, async (currentUser) => {
      //   const userEmail = currentUser?.email || user?.email;
      if (currentUser && currentUser.email) {
        setUser(currentUser);
        const userData = {
          name: currentUser.displayName,
          profilePicture: currentUser.photoURL,
          email: currentUser.email,
          role: "general",
        };
        console.log(userData);
        await axios.put(
          `${import.meta.env.VITE_SERVER}/all-users?email=${currentUser.email}`,
          userData
        );
        setPrivateRouteLoader(false);
      } else {
        setUser(null);
        setPrivateRouteLoader(false);
      }
    });
    return () => un();
  }, [auth, authReloader, user?.email]);

  const contextInfo = {
    auth,
    authReloader,
    setAuthReloader,
    registration,
    login,
    UpdateProfile,
    logout,
    user,
    setUser,
    privateRouteLoader,
    setPrivateRouteLoader,
    conversationOpen,
    setConversationOpen,
  };
  return (
    <AuthContext.Provider value={contextInfo}>{children}</AuthContext.Provider>
  );
};

export default AuthProvider;
