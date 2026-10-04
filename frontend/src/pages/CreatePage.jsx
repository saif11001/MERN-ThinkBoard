import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../lib/api";

const CreatePage = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim() || !content.trim()) {
      setError("Title and content are required");
      return;
    }

    try {
      setLoading(true);
      const data = await api.post("/note", { title, content });

      if (data.success) {
        navigate("/");
      }
    } catch (err) {
      setError(
        err.status === 429
          ? "Too many requests, please wait a moment and try again."
          : err.message
      );
      console.error("Error creating note:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center pt-18 px-4 sm:px-10 pb-10">
      <div
        className="w-full max-w-lg rounded-2xl p-6 sm:p-8"
        style={{
          backgroundColor: "#F5F5F0",
          boxShadow: "0 0 0 1px #5C7C8933, 0 4px 24px #5C7C8922",
        }}
      >
        <h2 className="text-2xl font-bold mb-6" style={{ color: "#1F4959" }}>
          Create New Note
        </h2>

        {error && (
          <div role="alert" className="mb-4 p-3 rounded-lg text-sm"
            style={{ backgroundColor: "#CC333322", color: "#CC3333" }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">

          <div className="flex flex-col gap-1">
            <label htmlFor="title" className="text-sm font-medium" style={{ color: "#1F4959" }}>
              Title
            </label>
            <input
              id="title"
              type="text"
              placeholder="Note title..."
              maxLength={100}
              value={title}
              onChange={e => { setTitle(e.target.value); setError(''); }}
              className="input w-full text-base"
              style={{
                backgroundColor: "#FFFFFF",
                border: "1px solid #5C7C8944",
                color: "#1F4959",
              }}
            />
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="content" className="text-sm font-medium" style={{ color: "#1F4959" }}>
              Content
            </label>
            <textarea
              id="content"
              placeholder="Write your note..."
              maxLength={5000}
              value={content}
              onChange={e => { setContent(e.target.value); setError(''); }}
              className="textarea w-full h-40 text-base"
              style={{
                backgroundColor: "#FFFFFF",
                border: "1px solid #5C7C8944",
                color: "#1F4959",
                resize: "none",
              }}
            />
          </div>

          <div className="flex gap-3 justify-end mt-2">
            <button
              type="button"
              onClick={() => navigate("/")}
              className="btn"
              style={{ backgroundColor: "#5C7C8933", color: "#1F4959", border: "none" }}>
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="btn"
              style={{ backgroundColor: "#1F4959", color: "#FFFFFF", border: "none" }}>
              {loading ? <span className="loading loading-spinner loading-sm" /> : "Save Note"}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default CreatePage;