import React from "react";
import "@/App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import Builder from "./pages/Builder";
import Result from "./pages/Result";
import MentionsLegales from "./pages/MentionsLegales";
import Confidentialite from "./pages/Confidentialite";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/builder" element={<Builder />} />
          <Route path="/builder/:caseType" element={<Builder />} />
          <Route path="/result" element={<Result />} />
          <Route path="/mentions-legales" element={<MentionsLegales />} />
          <Route path="/confidentialite" element={<Confidentialite />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
