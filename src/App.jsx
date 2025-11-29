// App.jsx
import React, { useEffect, useState } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase";

import Login from "./components/Login";
import Signup from "./components/Signup";
import ChatFlow from "./components/ChatFlow";
import LoadingFlow from "./components/LoadingFlow";
import FlowerResult from "./components/FlowerResult";
import SavedCards from "./components/SavedCards";
import CardDetail from "./components/CardDetail";

import ChatWrapper from "./components/_ChatWrapper";
import FlowerResultWrapper from "./components/_FlowerResultWrapper";

export default function App() {
  console.log("🔥 App 렌더링됨");

  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setAuthLoading(false);
    });
    return () => unsub();
  }, []);

  if (authLoading) {
    return <div>Loading...</div>;
  }

  return (
    <BrowserRouter>
      <Routes>

        <Route path="/login" element={!user ? <Login /> : <Navigate to="/" />} />
        <Route path="/signup" element={!user ? <Signup /> : <Navigate to="/" />} />
         <Route path="/loading" element={<LoadingFlow />} />

        <Route path="/" element={user ? <ChatWrapper /> : <Navigate to="/login" />} />

       

        <Route path="/result" element={user ? <FlowerResultWrapper /> : <Navigate to="/login" />} />

        <Route path="/garden" element={user ? <SavedCards /> : <Navigate to="/login" />} />
        <Route path="/card/:id" element={user ? <CardDetail /> : <Navigate to="/login" />} />

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}
