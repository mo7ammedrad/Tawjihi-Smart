import { useEffect, useState } from "react";
import { API_URL } from "../config";

const defaultDistribution = { mcq: 6, true_false: 2, fill_blank: 2, short_answer: 0 };

const box = {
  page: { padding: "24px", maxWidth: 1100, margin: "0 auto", fontFamily: "inherit", direction: "rtl" },
  card: { background: "#fff", borderRadius: 14, boxShadow: "0 10px 30px rgba(0,0,0,0.06)", padding: 18, marginBottom: 16, border: "1px solid #eef1f4" },
  header: { display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 },
  grid: { display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: 12 },
  label: { fontSize: 13, fontWeight: 600, color: "#333", marginBottom: 4 },
  input: { width: "100%", padding: 10, border: "1px solid #dfe3e8", borderRadius: 8, textAlign: "right" },
  button: { padding: "10px 16px", border: "none", borderRadius: 8, background: "#0d6efd", color: "#fff", cursor: "pointer" },
  badgeRow: { display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(140px,1fr))", gap: 10, alignItems: "end" },
  badgeItem: { display: "flex", flexDirection: "column", gap: 4 },
  questions: { display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: 12 },
  qCard: { background: "#f8f9fa", border: "1px solid #e9ecef", borderRadius: 10, padding: 12 },
  sectionTitle: { fontWeight: 700, fontSize: 15, marginBottom: 4 },
  badge: { display: "inline-flex", alignItems: "center", gap: 6, padding: "6px 10px", borderRadius: 999, background: "#eef2ff", color: "#3949ab", fontSize: 12, border: "1px solid #d7ddff" },
};

const TeacherAiQuizBuilder = () => {
  const [courses, setCourses] = useState([]);
  const [lessons, setLessons] = useState([]);
  const [form, setForm] = useState({
    courseId: "",
    lessonId: "",
    nQuestions: 10,
    difficulty: "medium",
    language: "ar",
    distribution: defaultDistribution,
  });
  const [loading, setLoading] = useState(false);
  const [quizId, setQuizId] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [error, setError] = useState("");
  const [teacherId, setTeacherId] = useState("");

  const totalDistribution =
    Number(form.distribution.mcq) +
    Number(form.distribution.true_false) +
    Number(form.distribution.fill_blank) +
    Number(form.distribution.short_answer);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("user");
      const parsed = raw ? JSON.parse(raw) : null;
      setTeacherId(parsed?._id || parsed?.id || "");
    } catch (e) {
      setTeacherId("");
    }
  }, []);

  useEffect(() => {
    const query = teacherId ? `${API_URL}/courses?teacher=${teacherId}` : `${API_URL}/courses`;
    fetch(query, { credentials: "include" })
      .then((r) => r.json())
      .then((data) => setCourses(data?.data?.docs || []))
      .catch(() => setError("فشل تحميل الكورسات"));
  }, [teacherId]);

  useEffect(() => {
    if (!form.courseId) return;
    fetch(`${API_URL}/lessons?course=${form.courseId}`, { credentials: "include" })
      .then((r) => r.json())
      .then((data) => setLessons(data?.data?.docs || []))
      .catch(() => setError("فشل تحميل الدروس"));
  }, [form.courseId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const updateDistribution = (key, val) => {
    setForm((f) => ({
      ...f,
      distribution: { ...f.distribution, [key]: Number(val) || 0 },
    }));
  };

  const fetchQuiz = async () => {
    setError("");
    if (!form.courseId || !form.lessonId) {
      setError("اختر الكورس والدرس أولاً");
      return;
    }
    const total =
      Number(form.distribution.mcq) +
      Number(form.distribution.true_false) +
      Number(form.distribution.fill_blank) +
      Number(form.distribution.short_answer);
    if (total !== Number(form.nQuestions)) {
      setError("مجموع التوزيع يجب أن يساوي عدد الأسئلة");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/ai/quiz/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          courseId: form.courseId,
          lessonId: form.lessonId,
          nQuestions: Number(form.nQuestions),
          difficulty: form.difficulty,
          language: form.language,
          distribution: form.distribution,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        const msg = data?.message || data?.error || "فشل التوليد";
        if (res.status === 429) {
          throw new Error("تم تجاوز الحد المسموح لطلبات التوليد، جرّب بعد دقائق.");
        }
        throw new Error(msg);
      }
      setQuizId(data.quizId);
      setQuestions(data.questions || []);
    } catch (err) {
      setError(err.message || "فشل التوليد");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={box.page} className="fade-in">
      <div style={box.card} className="card-soft">
        <div style={box.header}>
          <div>
            <div style={{ fontWeight: 700, fontSize: 18 }}>منشئ الاختبارات بالذكاء الاصطناعي</div>
            <div style={{ color: "#6c757d", fontSize: 13 }}>اختَر الكورس والدرس ثم وزّع الأسئلة قبل التوليد</div>
          </div>
          {quizId && <div style={{ fontSize: 12, color: "#0d6efd" }}>Quiz ID: {quizId}</div>}
        </div>

        {error && <div style={{ color: "#d6336c", marginBottom: 10 }}>{error}</div>}
        <div style={{ marginBottom: 8, display: "flex", gap: 10, flexWrap: "wrap" }}>
          <span style={box.badge}>الإجمالي المطلوب: {form.nQuestions}</span>
          <span style={box.badge}>توزيع فعلي: {totalDistribution}</span>
          {totalDistribution !== Number(form.nQuestions) && (
            <span style={{ ...box.badge, background: "#fff4e5", color: "#c05621", borderColor: "#f6ad55" }}>
              عدّل التوزيع ليطابق العدد
            </span>
          )}
        </div>

        <div style={box.grid}>
          <div>
            <div style={box.label}>الكورس</div>
            <select name="courseId" value={form.courseId} onChange={handleChange} style={box.input}>
              <option value="">اختر الكورس</option>
              {courses
                .filter((c) => {
                  if (!teacherId) return true;
                  const tId = c.teacher?._id || c.teacher?.id || c.teacher;
                  return String(tId) === String(teacherId);
                })
                .map((c) => (
                <option key={c._id} value={c._id}>
                  {c.name || c.title}
                </option>
              ))}
            </select>
          </div>
          <div>
            <div style={box.label}>الدرس</div>
            <select name="lessonId" value={form.lessonId} onChange={handleChange} style={box.input} disabled={!form.courseId}>
              <option value="">اختر الدرس</option>
              {lessons.map((l) => (
                <option key={l._id} value={l._id}>
                  {l.name || l.title}
                </option>
              ))}
            </select>
          </div>
          <div>
            <div style={box.label}>عدد الأسئلة</div>
            <input type="number" name="nQuestions" value={form.nQuestions} onChange={handleChange} min={1} max={30} style={box.input} />
          </div>
          <div>
            <div style={box.label}>الصعوبة</div>
            <select name="difficulty" value={form.difficulty} onChange={handleChange} style={box.input}>
              <option value="easy">سهل</option>
              <option value="medium">متوسط</option>
              <option value="hard">صعب</option>
            </select>
          </div>
          <div>
            <div style={box.label}>اللغة</div>
            <select name="language" value={form.language} onChange={handleChange} style={box.input}>
              <option value="ar">عربي</option>
              <option value="en">إنجليزي</option>
            </select>
          </div>
        </div>

        <div style={{ ...box.card, marginTop: 12, padding: 12 }} className="card-soft">
          <div style={{ ...box.sectionTitle, marginBottom: 8 }}>توزيع الأسئلة</div>
          <div style={box.badgeRow}>
            <div style={box.badgeItem}>
              <span style={box.label}>MCQ</span>
              <input type="number" min={0} value={form.distribution.mcq} onChange={(e) => updateDistribution("mcq", e.target.value)} style={box.input} />
            </div>
            <div style={box.badgeItem}>
              <span style={box.label}>True/False</span>
              <input type="number" min={0} value={form.distribution.true_false} onChange={(e) => updateDistribution("true_false", e.target.value)} style={box.input} />
            </div>
            <div style={box.badgeItem}>
              <span style={box.label}>Fill Blank</span>
              <input type="number" min={0} value={form.distribution.fill_blank} onChange={(e) => updateDistribution("fill_blank", e.target.value)} style={box.input} />
            </div>
            <div style={box.badgeItem}>
              <span style={box.label}>Short Answer</span>
              <input type="number" min={0} value={form.distribution.short_answer} onChange={(e) => updateDistribution("short_answer", e.target.value)} style={box.input} />
            </div>
            <button onClick={fetchQuiz} disabled={loading} style={box.button}>
              {loading ? "جارٍ التوليد..." : "توليد الاختبار"}
            </button>
          </div>
        </div>
      </div>

      <div style={box.card} className="card-soft">
        <div style={{ ...box.sectionTitle, marginBottom: 8 }}>الأسئلة المولدة</div>
        <div style={box.questions}>
          {questions.map((q, idx) => (
            <div key={idx} style={box.qCard} className="card-soft fade-in">
              <div style={{ fontWeight: 700, marginBottom: 6 }}>
                سؤال {idx + 1} ({q.type})
              </div>
              <div style={{ marginBottom: 6 }}>{q.question}</div>
              {q.options && q.options.length > 0 && (
                <ul style={{ paddingInlineStart: 18, margin: "0 0 6px 0" }}>
                  {q.options.map((opt, oi) => (
                    <li key={oi}>{opt}</li>
                  ))}
                </ul>
              )}
              <div style={{ fontSize: 13, marginBottom: 4 }}>
                <b>الإجابة:</b> {String(q.answer)}
              </div>
              <div style={{ fontSize: 13 }}>
                <b>شرح:</b> {q.explanation}
              </div>
            </div>
          ))}
          {!questions.length && <div>لم يتم التوليد بعد.</div>}
        </div>
      </div>
    </div>
  );
};

export default TeacherAiQuizBuilder;
