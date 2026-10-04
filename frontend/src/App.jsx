import { Route, Routes } from "react-router-dom"
import HomePage from "./pages/HomePage"
import CreatePage from "./pages/CreatePage"
import NoteDetailsPage from "./pages/NoteDetailsPage"
import Navbar from "./components/Navbar"
import Footer from "./components/Footer"

function App() {
  return (
    <div style={{ backgroundColor: "#5C7C89", minHeight: "100dvh", display: "flex", flexDirection: "column" }}>
      <Navbar />
      <main style={{ flex: 1 }}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/create" element={<CreatePage />} />
          <Route path="/note/:noteId" element={<NoteDetailsPage />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}

export default App