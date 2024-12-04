import TextEditor from "./TextEditor";
import { v4 as uuidV4 } from "uuid";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import CardsDashboard from "./selectHome.jsx";
import "./styles.css";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to={`/documents/${uuidV4()}`} />} />
        <Route path="/documents/:id" element={<TextEditor />} />
        {/* <Route path="/" element={<CardsDashboard />} /> */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
