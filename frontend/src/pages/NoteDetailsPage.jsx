import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import RateLimitedUI from "../components/RateLimitedUI";
import { api } from "../lib/api";

const NoteDetailsPage = () => {
  const navigate = useNavigate();
  const { noteId } = useParams();

  const [note, setNote] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  useEffect(() => {
    const fetchNote = async () => {
      try {
        const data = await api.get(`/note/${noteId}`);
        if (data.success) {
          setNote(data.data);
          setTitle(data.data.title);
          setContent(data.data.content);
        }
      } catch (error) {
        setLoadError(error);
        console.error("Error fetching note:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchNote();
  }, [noteId]);

  const handleSave = async () => {
    if (!title.trim() || !content.trim()) {
      setSaveError("Title and content are required");
      return;
    }

    try {
      setSaving(true);
      setSaveError('');
      const data = await api.patch(`/note/${noteId}`, { title, content });
      if (data.success) {
        setNote(data.data);
        setIsEditing(false);
      }
    } catch (error) {
      setSaveError(
        error.status === 429
          ? "Too many requests, please wait a moment and try again."
          : error.message
      );
      console.error("Error updating note:", error);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center mt-20">
        <span className="loading loading-spinner loading-lg" style={{ color: "#1F4959" }} />
      </div>
    );
  }

  if (loadError?.status === 429) {
    return <RateLimitedUI />;
  }

  if (!note) {
    return (
      <div className="flex flex-col gap-4 justify-center items-center mt-20 px-4 text-center">
        <p style={{ color: "#F5F5F0" }}>
          {loadError && loadError.status !== 404 && loadError.status !== 400
            ? loadError.message
            : "Note not found."}
        </p>
        <button
          onClick={() => navigate("/")}
          className="btn btn-sm"
          style={{ backgroundColor: "#1F4959", color: "#FFFFFF", border: "none" }}>
          ← Home
        </button>
      </div>
    );
  }

  return (
    <div className="flex justify-center pt-16 px-4 sm:px-10 pb-10">
      <div
        className="w-full max-w-2xl rounded-2xl transition-all duration-300"
        style={{
          backgroundColor: "#F5F5F0",
          border: "3px solid #5C7C8944",
          boxShadow: "0 0 0 1px #5C7C8933, 0 4px 24px #5C7C8922",
        }}
      >
        <div className="p-6 sm:p-8 flex flex-col gap-5">

          {/* Title */}
          {isEditing ? (
            <input
              type="text"
              aria-label="Title"
              maxLength={100}
              value={title}
              onChange={e => { setTitle(e.target.value); setSaveError(''); }}
              className="input w-full text-xl font-bold"
              style={{
                backgroundColor: "#FFFFFF",
                border: "1px solid #5C7C8944",
                color: "#1F4959",
              }}
            />
          ) : (
            <h1 className="text-2xl font-bold wrap-break-word" style={{ color: "#1F4959" }}>
              {note.title}
            </h1>
          )}

          {/* Content */}
          {isEditing ? (
            <textarea
              aria-label="Content"
              maxLength={5000}
              value={content}
              onChange={e => { setContent(e.target.value); setSaveError(''); }}
              className="textarea w-full text-base"
              rows={10}
              style={{
                backgroundColor: "#FFFFFF",
                border: "1px solid #5C7C8944",
                color: "#1F4959",
                resize: "none",
              }}
            />
          ) : (
            <p className="text-sm leading-relaxed whitespace-pre-wrap wrap-break-word" style={{ color: "#1F4959BB" }}>
              {note.content}
            </p>
          )}

          {saveError && (
            <div role="alert" className="p-3 rounded-lg text-sm"
              style={{ backgroundColor: "#CC333322", color: "#CC3333" }}>
              {saveError}
            </div>
          )}

          {isEditing && (
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => {
                  setIsEditing(false);
                  setTitle(note.title);
                  setContent(note.content);
                  setSaveError('');
                }}
                className="btn btn-sm"
                style={{ backgroundColor: "#5C7C8933", color: "#1F4959", border: "none" }}>
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="btn btn-sm"
                style={{ backgroundColor: "#1F4959", color: "#FFFFFF", border: "none" }}>
                {saving ? <span className="loading loading-spinner loading-xs" /> : "Save"}
              </button>
            </div>
          )}

          <div className="w-full h-px" style={{ backgroundColor: "#5C7C8944" }} />

          <div className="flex items-center justify-between">
            <span className="text-xs" style={{ color: "#5C7C89" }}>
              {new Date(note.createdAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
              })}
            </span>
            <div className="flex gap-3">
              {!isEditing && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="btn btn-sm"
                  style={{ backgroundColor: "#1F4959", color: "#FFFFFF", border: "none" }}>
                  ✏️ Edit
                </button>
              )}
              <button
                onClick={() => navigate("/")}
                className="btn btn-sm"
                style={{ backgroundColor: "#5C7C8933", color: "#1F4959", border: "none" }}>
                ← Home
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default NoteDetailsPage;