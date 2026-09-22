import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { db } from "../firebase_config";
import {
  collection,
  getDocs,
  setDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";
import Link from "next/link";

// ---------------------------------------------------------------------------
// Shared helpers
// ---------------------------------------------------------------------------

const Input = ({ label, value, onChange, placeholder, type = "text", disabled = false }) => (
  <div className="flex flex-col gap-1">
    <label className="text-sm font-semibold text-gray-700">{label}</label>
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      disabled={disabled}
      className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-500 disabled:bg-gray-100 disabled:text-gray-500"
    />
  </div>
);

const Select = ({ label, value, onChange, options }) => (
  <div className="flex flex-col gap-1">
    <label className="text-sm font-semibold text-gray-700">{label}</label>
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-500"
    >
      {options.map((option) => (
        <option key={option} value={option}>{option}</option>
      ))}
    </select>
  </div>
);

const Checkbox = ({ label, checked, onChange, hint }) => (
  <label className="flex items-start gap-2">
    <input
      type="checkbox"
      checked={checked}
      onChange={(e) => onChange(e.target.checked)}
      className="mt-1 h-4 w-4 rounded border-gray-300"
    />
    <span>
      <span className="text-sm font-semibold text-gray-700">{label}</span>
      {hint && <span className="block text-xs text-gray-500">{hint}</span>}
    </span>
  </label>
);

const Textarea = ({ label, value, onChange, placeholder, rows = 4 }) => (
  <div className="flex flex-col gap-1">
    <label className="text-sm font-semibold text-gray-700">{label}</label>
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      rows={rows}
      className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-500 font-mono"
    />
  </div>
);

const Btn = ({ onClick, children, variant = "primary", disabled = false, type = "button" }) => {
  const base = "px-4 py-2 rounded-md text-sm font-semibold transition-colors disabled:opacity-50";
  const variants = {
    primary: "bg-slate-800 text-white hover:bg-slate-700",
    danger: "bg-red-600 text-white hover:bg-red-500",
    ghost: "bg-gray-100 text-gray-800 hover:bg-gray-200",
  };
  return (
    <button type={type} onClick={onClick} disabled={disabled} className={`${base} ${variants[variant]}`}>
      {children}
    </button>
  );
};

const SectionHeader = ({ title, onAdd }) => (
  <div className="flex items-center justify-between mb-4">
    <h2 className="text-xl font-bold text-gray-900">{title}</h2>
    {onAdd && <Btn onClick={onAdd}>+ New</Btn>}
  </div>
);

const Modal = ({ title, onClose, children }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
    <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
      <div className="flex items-center justify-between px-6 py-4 border-b">
        <h3 className="text-lg font-bold text-gray-900">{title}</h3>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-700 text-xl leading-none">&times;</button>
      </div>
      <div className="px-6 py-4">{children}</div>
    </div>
  </div>
);

const ConfirmModal = ({ message, onConfirm, onCancel }) => (
  <Modal title="Confirm Delete" onClose={onCancel}>
    <p className="text-gray-700 mb-6">{message}</p>
    <div className="flex gap-3 justify-end">
      <Btn variant="ghost" onClick={onCancel}>Cancel</Btn>
      <Btn variant="danger" onClick={onConfirm}>Delete</Btn>
    </div>
  </Modal>
);

const StatusBanner = ({ status }) => {
  if (!status) return null;
  const styles = status.type === "error"
    ? "bg-red-50 border border-red-300 text-red-700"
    : "bg-green-50 border border-green-300 text-green-700";
  return <div className={`rounded-md px-4 py-2 text-sm mb-4 ${styles}`}>{status.message}</div>;
};

// ---------------------------------------------------------------------------
// Courses Tab
// ---------------------------------------------------------------------------

const CoursesTab = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null); // null | { mode: 'create'|'edit', data }
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [status, setStatus] = useState(null);

  const [form, setForm] = useState({ id: "", title: "", description: "" });

  const fetchCourses = async () => {
    setLoading(true);
    const snap = await getDocs(collection(db, "courses"));
    setCourses(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    setLoading(false);
  };

  useEffect(() => { fetchCourses(); }, []);

  const openCreate = () => {
    setForm({ id: "", title: "", description: "" });
    setModal({ mode: "create" });
  };

  const openEdit = (course) => {
    setForm({ id: course.id, title: course.title || "", description: course.description || "" });
    setModal({ mode: "edit" });
  };

  const handleSave = async () => {
    if (!form.id.trim() || !form.title.trim()) {
      setStatus({ type: "error", message: "Course ID and Title are required." });
      return;
    }
    try {
      await setDoc(doc(db, "courses", form.id.trim()), {
        title: form.title.trim(),
        description: form.description.trim(),
      }, { merge: true });
      setStatus({ type: "success", message: modal.mode === "create" ? "Course created." : "Course updated." });
      setModal(null);
      fetchCourses();
    } catch (e) {
      setStatus({ type: "error", message: e.message });
    }
  };

  const handleDelete = async () => {
    try {
      await deleteDoc(doc(db, "courses", deleteTarget.id));
      setStatus({ type: "success", message: "Course deleted." });
      setDeleteTarget(null);
      fetchCourses();
    } catch (e) {
      setStatus({ type: "error", message: e.message });
    }
  };

  return (
    <div>
      <StatusBanner status={status} />
      <SectionHeader title="Courses" onAdd={openCreate} />

      {loading ? (
        <p className="text-gray-500 text-sm">Loading...</p>
      ) : courses.length === 0 ? (
        <p className="text-gray-500 text-sm">No courses found.</p>
      ) : (
        <div className="grid gap-3">
          {courses.map((course) => (
            <div key={course.id} className="border border-gray-200 rounded-lg p-4 flex items-start justify-between gap-4 bg-white">
              <div>
                <p className="font-semibold text-gray-900">{course.title}</p>
                <p className="text-xs text-gray-500 font-mono mt-0.5">ID: {course.id}</p>
                {course.description && <p className="text-sm text-gray-600 mt-1 line-clamp-2">{course.description}</p>}
              </div>
              <div className="flex gap-2 shrink-0">
                <Btn variant="ghost" onClick={() => openEdit(course)}>Edit</Btn>
                <Btn variant="danger" onClick={() => setDeleteTarget(course)}>Delete</Btn>
              </div>
            </div>
          ))}
        </div>
      )}

      {modal && (
        <Modal title={modal.mode === "create" ? "New Course" : "Edit Course"} onClose={() => setModal(null)}>
          <div className="flex flex-col gap-4">
            <Input
              label="Course ID (used in URLs, e.g. DAA)"
              value={form.id}
              onChange={(v) => setForm((f) => ({ ...f, id: v }))}
              placeholder="DAA"
              disabled={modal.mode === "edit"}
            />
            <Input
              label="Title"
              value={form.title}
              onChange={(v) => setForm((f) => ({ ...f, title: v }))}
              placeholder="Data Action Accelerator 2025/2026"
            />
            <Textarea
              label="Description"
              value={form.description}
              onChange={(v) => setForm((f) => ({ ...f, description: v }))}
              placeholder="Course description..."
            />
            <div className="flex gap-3 justify-end pt-2">
              <Btn variant="ghost" onClick={() => setModal(null)}>Cancel</Btn>
              <Btn onClick={handleSave}>Save</Btn>
            </div>
          </div>
        </Modal>
      )}

      {deleteTarget && (
        <ConfirmModal
          message={`Delete course "${deleteTarget.title}" (${deleteTarget.id})? This will not delete subcollections automatically.`}
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
        />
      )}
    </div>
  );
};

// ---------------------------------------------------------------------------
// Themes Tab
// ---------------------------------------------------------------------------

const ThemesTab = () => {
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [themes, setThemes] = useState([]);
  const [loadingCourses, setLoadingCourses] = useState(true);
  const [loadingThemes, setLoadingThemes] = useState(false);
  const [modal, setModal] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [status, setStatus] = useState(null);

  const emptyForm = { id: "", title: "", description: "", index: "0", audience: "" };
  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    const load = async () => {
      const snap = await getDocs(collection(db, "courses"));
      const list = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      setCourses(list);
      setLoadingCourses(false);
      if (list.length > 0) setSelectedCourse(list[0].id);
    };
    load();
  }, []);

  useEffect(() => {
    if (!selectedCourse) return;
    const load = async () => {
      setLoadingThemes(true);
      const snap = await getDocs(collection(db, "courses", selectedCourse, "themes"));
      const list = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      list.sort((a, b) => (a.index ?? 99) - (b.index ?? 99));
      setThemes(list);
      setLoadingThemes(false);
    };
    load();
  }, [selectedCourse]);

  const refreshThemes = async () => {
    if (!selectedCourse) return;
    setLoadingThemes(true);
    const snap = await getDocs(collection(db, "courses", selectedCourse, "themes"));
    const list = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    list.sort((a, b) => (a.index ?? 99) - (b.index ?? 99));
    setThemes(list);
    setLoadingThemes(false);
  };

  const openCreate = () => {
    setForm(emptyForm);
    setModal({ mode: "create" });
  };

  const openEdit = (theme) => {
    setForm({
      id: theme.id,
      title: theme.title || "",
      description: theme.description || "",
      index: String(theme.index ?? 0),
      audience: theme.audience || "",
    });
    setModal({ mode: "edit" });
  };

  const handleSave = async () => {
    if (!form.id.trim() || !form.title.trim()) {
      setStatus({ type: "error", message: "Theme ID and Title are required." });
      return;
    }
    try {
      await setDoc(
        doc(db, "courses", selectedCourse, "themes", form.id.trim()),
        {
          title: form.title.trim(),
          description: form.description.trim(),
          index: parseInt(form.index, 10) || 0,
          audience: form.audience.trim(),
        },
        { merge: true }
      );
      setStatus({ type: "success", message: modal.mode === "create" ? "Theme created." : "Theme updated." });
      setModal(null);
      refreshThemes();
    } catch (e) {
      setStatus({ type: "error", message: e.message });
    }
  };

  const handleDelete = async () => {
    try {
      await deleteDoc(doc(db, "courses", selectedCourse, "themes", deleteTarget.id));
      setStatus({ type: "success", message: "Theme deleted." });
      setDeleteTarget(null);
      refreshThemes();
    } catch (e) {
      setStatus({ type: "error", message: e.message });
    }
  };

  return (
    <div>
      <StatusBanner status={status} />
      <div className="mb-4 flex items-center gap-3">
        <label className="text-sm font-semibold text-gray-700">Course</label>
        {loadingCourses ? (
          <p className="text-sm text-gray-500">Loading courses...</p>
        ) : (
          <select
            value={selectedCourse}
            onChange={(e) => setSelectedCourse(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-500"
          >
            {courses.map((c) => (
              <option key={c.id} value={c.id}>{c.title || c.id}</option>
            ))}
          </select>
        )}
      </div>

      <SectionHeader title="Themes" onAdd={selectedCourse ? openCreate : undefined} />

      {loadingThemes ? (
        <p className="text-gray-500 text-sm">Loading...</p>
      ) : themes.length === 0 ? (
        <p className="text-gray-500 text-sm">No themes found for this course.</p>
      ) : (
        <div className="grid gap-3">
          {themes.map((theme) => (
            <div key={theme.id} className="border border-gray-200 rounded-lg p-4 flex items-start justify-between gap-4 bg-white">
              <div>
                <p className="font-semibold text-gray-900">{theme.title}</p>
                <p className="text-xs text-gray-500 font-mono mt-0.5">ID: {theme.id} · index: {theme.index ?? "—"}</p>
                {theme.audience && <p className="text-xs text-gray-500 mt-0.5">Audience: {theme.audience}</p>}
                {theme.description && <p className="text-sm text-gray-600 mt-1 line-clamp-2">{theme.description}</p>}
              </div>
              <div className="flex gap-2 shrink-0">
                <Btn variant="ghost" onClick={() => openEdit(theme)}>Edit</Btn>
                <Btn variant="danger" onClick={() => setDeleteTarget(theme)}>Delete</Btn>
              </div>
            </div>
          ))}
        </div>
      )}

      {modal && (
        <Modal title={modal.mode === "create" ? "New Theme" : "Edit Theme"} onClose={() => setModal(null)}>
          <div className="flex flex-col gap-4">
            <Input
              label="Theme ID (e.g. intro)"
              value={form.id}
              onChange={(v) => setForm((f) => ({ ...f, id: v }))}
              placeholder="intro"
              disabled={modal.mode === "edit"}
            />
            <Input
              label="Title"
              value={form.title}
              onChange={(v) => setForm((f) => ({ ...f, title: v }))}
              placeholder="Introduction to Data"
            />
            <Textarea
              label="Description"
              value={form.description}
              onChange={(v) => setForm((f) => ({ ...f, description: v }))}
              placeholder="Theme description..."
            />
            <Input
              label="Index (display order, 0 = primary)"
              type="number"
              value={form.index}
              onChange={(v) => setForm((f) => ({ ...f, index: v }))}
              placeholder="0"
            />
            <Input
              label="Audience (optional)"
              value={form.audience}
              onChange={(v) => setForm((f) => ({ ...f, audience: v }))}
              placeholder="All practitioners"
            />
            <div className="flex gap-3 justify-end pt-2">
              <Btn variant="ghost" onClick={() => setModal(null)}>Cancel</Btn>
              <Btn onClick={handleSave}>Save</Btn>
            </div>
          </div>
        </Modal>
      )}

      {deleteTarget && (
        <ConfirmModal
          message={`Delete theme "${deleteTarget.title}" (${deleteTarget.id})? Guides inside it will not be deleted automatically.`}
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
        />
      )}
    </div>
  );
};

// ---------------------------------------------------------------------------
// Guides Tab
// ---------------------------------------------------------------------------

const GuidesTab = () => {
  const [courses, setCourses] = useState([]);
  const [themes, setThemes] = useState([]);
  const [guides, setGuides] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [selectedTheme, setSelectedTheme] = useState("");
  const [loadingCourses, setLoadingCourses] = useState(true);
  const [loadingThemes, setLoadingThemes] = useState(false);
  const [loadingGuides, setLoadingGuides] = useState(false);
  const [modal, setModal] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [status, setStatus] = useState(null);
  const [preview, setPreview] = useState(false);

  const emptyForm = { id: "", title: "", description: "", index: "0", audience: "", videoId: "", markdown_content: "" };
  const [form, setForm] = useState(emptyForm);

  // Load courses
  useEffect(() => {
    const load = async () => {
      const snap = await getDocs(collection(db, "courses"));
      const list = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      setCourses(list);
      setLoadingCourses(false);
      if (list.length > 0) setSelectedCourse(list[0].id);
    };
    load();
  }, []);

  // Load themes when course changes
  useEffect(() => {
    if (!selectedCourse) return;
    const load = async () => {
      setLoadingThemes(true);
      setThemes([]);
      setSelectedTheme("");
      const snap = await getDocs(collection(db, "courses", selectedCourse, "themes"));
      const list = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      list.sort((a, b) => (a.index ?? 99) - (b.index ?? 99));
      setThemes(list);
      setLoadingThemes(false);
      if (list.length > 0) setSelectedTheme(list[0].id);
    };
    load();
  }, [selectedCourse]);

  // Load guides when theme changes
  useEffect(() => {
    if (!selectedCourse || !selectedTheme) return;
    const load = async () => {
      setLoadingGuides(true);
      const snap = await getDocs(collection(db, "courses", selectedCourse, "themes", selectedTheme, "guides"));
      const list = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      list.sort((a, b) => (a.index ?? 99) - (b.index ?? 99));
      setGuides(list);
      setLoadingGuides(false);
    };
    load();
  }, [selectedCourse, selectedTheme]);

  const refreshGuides = async () => {
    if (!selectedCourse || !selectedTheme) return;
    setLoadingGuides(true);
    const snap = await getDocs(collection(db, "courses", selectedCourse, "themes", selectedTheme, "guides"));
    const list = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    list.sort((a, b) => (a.index ?? 99) - (b.index ?? 99));
    setGuides(list);
    setLoadingGuides(false);
  };

  const openCreate = () => {
    setForm(emptyForm);
    setPreview(false);
    setModal({ mode: "create" });
  };

  const openEdit = (guide) => {
    setForm({
      id: guide.id,
      title: guide.title || "",
      description: guide.description || "",
      index: String(guide.index ?? 0),
      audience: guide.audience || "",
      videoId: guide.videoId || "",
      markdown_content: guide.markdown_content || "",
    });
    setPreview(false);
    setModal({ mode: "edit" });
  };

  const handleSave = async () => {
    if (!form.id.trim() || !form.title.trim()) {
      setStatus({ type: "error", message: "Guide ID and Title are required." });
      return;
    }
    try {
      await setDoc(
        doc(db, "courses", selectedCourse, "themes", selectedTheme, "guides", form.id.trim()),
        {
          title: form.title.trim(),
          description: form.description.trim(),
          index: parseInt(form.index, 10) || 0,
          audience: form.audience.trim(),
          videoId: form.videoId.trim(),
          markdown_content: form.markdown_content,
        },
        { merge: true }
      );
      setStatus({ type: "success", message: modal.mode === "create" ? "Guide created." : "Guide updated." });
      setModal(null);
      refreshGuides();
    } catch (e) {
      setStatus({ type: "error", message: e.message });
    }
  };

  const handleDelete = async () => {
    try {
      await deleteDoc(doc(db, "courses", selectedCourse, "themes", selectedTheme, "guides", deleteTarget.id));
      setStatus({ type: "success", message: "Guide deleted." });
      setDeleteTarget(null);
      refreshGuides();
    } catch (e) {
      setStatus({ type: "error", message: e.message });
    }
  };

  return (
    <div>
      <StatusBanner status={status} />
      <div className="mb-4 flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2">
          <label className="text-sm font-semibold text-gray-700">Course</label>
          {loadingCourses ? (
            <p className="text-sm text-gray-500">Loading...</p>
          ) : (
            <select
              value={selectedCourse}
              onChange={(e) => setSelectedCourse(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-500"
            >
              {courses.map((c) => (
                <option key={c.id} value={c.id}>{c.title || c.id}</option>
              ))}
            </select>
          )}
        </div>
        <div className="flex items-center gap-2">
          <label className="text-sm font-semibold text-gray-700">Theme</label>
          {loadingThemes ? (
            <p className="text-sm text-gray-500">Loading...</p>
          ) : (
            <select
              value={selectedTheme}
              onChange={(e) => setSelectedTheme(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-500"
              disabled={themes.length === 0}
            >
              {themes.map((t) => (
                <option key={t.id} value={t.id}>{t.title || t.id}</option>
              ))}
            </select>
          )}
        </div>
      </div>

      <SectionHeader title="Guides" onAdd={selectedCourse && selectedTheme ? openCreate : undefined} />

      {loadingGuides ? (
        <p className="text-gray-500 text-sm">Loading...</p>
      ) : guides.length === 0 ? (
        <p className="text-gray-500 text-sm">No guides found for this theme.</p>
      ) : (
        <div className="grid gap-3">
          {guides.map((guide) => (
            <div key={guide.id} className="border border-gray-200 rounded-lg p-4 flex items-start justify-between gap-4 bg-white">
              <div>
                <p className="font-semibold text-gray-900">{guide.title}</p>
                <p className="text-xs text-gray-500 font-mono mt-0.5">ID: {guide.id} · index: {guide.index ?? "—"}</p>
                {guide.videoId && <p className="text-xs text-gray-500 mt-0.5">Video: {guide.videoId}</p>}
                {guide.description && <p className="text-sm text-gray-600 mt-1 line-clamp-2">{guide.description}</p>}
              </div>
              <div className="flex gap-2 shrink-0">
                <Link
                  href={`/guide?guideId=${selectedCourse}_${selectedTheme}_${guide.id}`}
                  target="_blank"
                  className="px-4 py-2 rounded-md text-sm font-semibold bg-gray-100 text-gray-800 hover:bg-gray-200 transition-colors"
                >
                  View
                </Link>
                <Btn variant="ghost" onClick={() => openEdit(guide)}>Edit</Btn>
                <Btn variant="danger" onClick={() => setDeleteTarget(guide)}>Delete</Btn>
              </div>
            </div>
          ))}
        </div>
      )}

      {modal && (
        <Modal
          title={modal.mode === "create" ? "New Guide" : `Edit Guide: ${form.title}`}
          onClose={() => setModal(null)}
        >
          <div className="flex flex-col gap-4">
            <Input
              label="Guide ID (e.g. lesson1)"
              value={form.id}
              onChange={(v) => setForm((f) => ({ ...f, id: v }))}
              placeholder="lesson1"
              disabled={modal.mode === "edit"}
            />
            <Input
              label="Title"
              value={form.title}
              onChange={(v) => setForm((f) => ({ ...f, title: v }))}
              placeholder="Introduction to Spreadsheets"
            />
            <Textarea
              label="Description"
              value={form.description}
              onChange={(v) => setForm((f) => ({ ...f, description: v }))}
              placeholder="Short guide description..."
              rows={2}
            />
            <Input
              label="Index (display order)"
              type="number"
              value={form.index}
              onChange={(v) => setForm((f) => ({ ...f, index: v }))}
              placeholder="0"
            />
            <Input
              label="Audience (optional)"
              value={form.audience}
              onChange={(v) => setForm((f) => ({ ...f, audience: v }))}
              placeholder="All practitioners"
            />
            <Input
              label="YouTube Video ID (e.g. dQw4w9WgXcQ)"
              value={form.videoId}
              onChange={(v) => setForm((f) => ({ ...f, videoId: v }))}
              placeholder="dQw4w9WgXcQ"
            />
            <div className="flex flex-col gap-1">
              <div className="flex items-center justify-between">
                <label className="text-sm font-semibold text-gray-700">Markdown Content</label>
                <button
                  type="button"
                  onClick={() => setPreview((p) => !p)}
                  className="text-xs text-slate-600 underline"
                >
                  {preview ? "Edit" : "Preview"}
                </button>
              </div>
              {preview ? (
                <div className="border border-gray-300 rounded-md p-3 min-h-32 prose prose-sm max-w-none overflow-auto bg-gray-50">
                  {/* Dynamic import to avoid adding a dep at the top level only for preview */}
                  <MarkdownPreview content={form.markdown_content} />
                </div>
              ) : (
                <textarea
                  value={form.markdown_content}
                  onChange={(e) => setForm((f) => ({ ...f, markdown_content: e.target.value }))}
                  rows={12}
                  placeholder="# Guide Title&#10;&#10;Your markdown content here..."
                  className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-500 font-mono"
                />
              )}
            </div>
            <div className="flex gap-3 justify-end pt-2">
              <Btn variant="ghost" onClick={() => setModal(null)}>Cancel</Btn>
              <Btn onClick={handleSave}>Save</Btn>
            </div>
          </div>
        </Modal>
      )}

      {deleteTarget && (
        <ConfirmModal
          message={`Delete guide "${deleteTarget.title}" (${deleteTarget.id})?`}
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
        />
      )}
    </div>
  );
};

// Lazy markdown preview — reuses react-markdown already in the project
import Markdown from "react-markdown";
const MarkdownPreview = ({ content }) => (
  <Markdown>{content || "*No content yet.*"}</Markdown>
);

// ---------------------------------------------------------------------------
// Main Admin page
// ---------------------------------------------------------------------------

const TABS = [
  { id: "courses", label: "Courses" },
  { id: "themes", label: "Themes" },
  { id: "guides", label: "Guides" },
];

const Admin = () => {
  const { user, userMeta } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState("courses");

  if (!user) {
    return (
      <div className="py-32 container mx-auto px-4">
        <p>Please <Link href="/auth/login" className="underline text-blue-700">log in</Link> to access the admin panel.</p>
      </div>
    );
  }

  if (!userMeta) {
    return <div className="py-32 container mx-auto px-4"><p>Loading...</p></div>;
  }

  if (!userMeta.admin) {
    return (
      <div className="py-32 container mx-auto px-4">
        <p className="text-red-600 font-semibold">Access denied. Admin privileges required.</p>
      </div>
    );
  }

  return (
    <div className="py-32 container mx-auto px-4">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900">Admin Panel</h1>
        <p className="text-gray-500 mt-1 text-sm">Manage courses, themes and guides directly in the browser.</p>
      </div>

      {/* Tab bar */}
      <div className="flex gap-1 border-b border-gray-200 mb-8">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-5 py-2.5 text-sm font-semibold rounded-t-md transition-colors ${
              activeTab === tab.id
                ? "bg-white border border-b-white border-gray-200 text-slate-900 -mb-px"
                : "text-gray-500 hover:text-gray-800"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {activeTab === "courses" && <CoursesTab />}
      {activeTab === "themes" && <ThemesTab />}
      {activeTab === "guides" && <GuidesTab />}
    </div>
  );
};

export default Admin;
