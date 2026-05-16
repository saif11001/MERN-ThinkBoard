import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import NoteCard from "../components/NoteCard";
import RateLimitedUI from "../components/RateLimitedUI";
import { api } from "../lib/api";

const HomePage = () => {
  const navigate = useNavigate();
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isRateLimited, setIsRateLimited] = useState(false);

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const [data] = await Promise.all([
          api.get("/note"),
          new Promise((resolve) => setTimeout(resolve, 1000))
        ]);
        if (data.success) {
          setNotes(data.data);
        }
      } catch (error) {
        if (error.status === 429) setIsRateLimited(true);
        console.error("Error fetching notes:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchNotes();
  }, []);

  const handleDelete = (id) => {
    setNotes((prev) => prev.filter((note) => note._id !== id));
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center mt-20">
        <span className="loading loading-spinner loading-lg" style={{ color: "#1F4959" }} />
      </div>
    );
  }

  return (
    <div className="p-6">
      {isRateLimited ? (
        <RateLimitedUI />
      ) : notes.length === 0 ? (
        <div className="flex flex-col items-center justify-center mt-32 px-4">
          <div
            className="rounded-3xl p-10 max-w-lg w-full text-center"
            style={{
              backgroundColor: "#1F495922",
              border: "1px solid #F5F5F033",
            }}
          >
            <h1 className="text-4xl font-black tracking-wide" style={{ color: "#F5F5F0" }}>
              Your board is empty
            </h1>
            <p className="mt-4 text-base" style={{ color: "#F5F5F0BB" }}>
              Start capturing your ideas, thoughts, and plans in one place.
            </p>
            <button
              onClick={() => navigate("/create")}
              className="btn mt-6 px-8 rounded-2xl"
              style={{ backgroundColor: "#1F4959", color: "#FFFFFF", border: "none" }}>
              Create Your First Note
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto mt-6 px-6">
          {notes.map((note) => (
            <NoteCard key={note._id} note={note} onDelete={handleDelete} />
          ))}
        </div>
      )}
    </div>
  );
};

export default HomePage;