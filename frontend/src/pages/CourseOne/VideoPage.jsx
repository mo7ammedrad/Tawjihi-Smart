"use client"

import { useEffect, useState } from "react"
import { useLocation, useParams, useNavigate } from "react-router-dom"
import { LogoAndButton } from "../../components/LogoAndButton"
import { ModalTeacher } from "../../components/modalTeacher"
import AnimatedList from "../../components/Animations/AnimatedList"
import VideoPlayerWithControls from "../../components/VideoPlayerWithControls"
import ReviewListSection from "../../components/ReviewListSection"
import CommentForm from "../../components/CommentForm"
import { Containers } from "../../components/Container"
import VideoResources from "../../components/VideoResources"
import { NavBar } from "../../layout/navBar"
import {
  VideoWrapper,
  PlayerContainer,
  ListContainer,
  ReviewSection,
  LoadingWrapper,
  VideoHeader,
  VideoTitle,
  VideoMeta,
  NavigationHint,
  VideoContent,
  PlayerSection,
  PlaylistSection,
  SectionTitle,
  VideoCounter,
  EnrollmentMessage,
  NoContentWrapper,
  LessonContentCard,
  LessonDescription,
  PdfActions,
} from "./style"
import NoVideos from "../../components/NoVideos"
import { API_URL } from "../../config"
import axios from "axios"
import Loading from "../../components/Loading"
import { useForm } from "react-hook-form"
import { useMemo } from "react"

const VideoPage = () => {
  // States
  const [enrollmentCourses, setEnrollmentCourses] = useState([])
  const [isloading, setIsloading] = useState(false)
  const [quizzes, setQuizzes] = useState([])
  const [quizError, setQuizError] = useState("")
  const [selfQuizQuestions, setSelfQuizQuestions] = useState([])
  const [selfQuizLoading, setSelfQuizLoading] = useState(false)
  const [selfQuizError, setSelfQuizError] = useState("")
  const [selfQuizCount, setSelfQuizCount] = useState(10)
  const [selfQuizResponses, setSelfQuizResponses] = useState({})

  const { name, id, videoIndex } = useParams()
  const navigate = useNavigate()
  const { state } = useLocation()

  const items = Array.isArray(state?.items) ? state.items : []
  const currentIndex = Number(videoIndex) >= 0 && items[videoIndex] ? Number(videoIndex) : 0
  const selectedVideo = items[currentIndex] || {}
  const userData = JSON.parse(localStorage.getItem("user"))
  const isPrivileged = userData?.role === "admin" || userData?.role === "teacher"
  const isCourseOwner =
    isPrivileged &&
    (selectedVideo?.teacher?._id === userData?._id ||
      selectedVideo?.teacher === userData?._id ||
      selectedVideo?.course?.teacher?._id === userData?._id ||
      selectedVideo?.course?.teacher === userData?._id)


  const handleVideoSelect = (item, index) => {
    navigate(`/courses/${name}/${id}/video/${index}`, { state: { items } })
  }

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();



  useEffect(() => {
    if (!items.length) return

    const handleKey = (e) => {
      if (e.key === "ArrowRight") {
        const next = (currentIndex + 1) % items.length
        handleVideoSelect(items[next], next)
      } else if (e.key === "ArrowLeft") {
        const prev = (currentIndex - 1 + items.length) % items.length
        handleVideoSelect(items[prev], prev)
      }
    }

    window.addEventListener("keydown", handleKey)
    return () => window.removeEventListener("keydown", handleKey)
  }, [currentIndex, items])

  // Fetch enrolled courses
  useEffect(() => {
    const getEnrolledCourses = async () => {
      try {
        setIsloading(true)
        const userData = JSON.parse(localStorage.getItem("user"))
        const enrollmentsRes = await axios.get(`${API_URL}/enrollments?user=${userData._id}`, {
          withCredentials: true,
        })
        if (enrollmentsRes) {
          setEnrollmentCourses(enrollmentsRes.data.data.docs)
        }
      } catch (e) {
        console.error("Error fetching enrolled courses:", e)
      } finally {
        setIsloading(false)
      }
    }
    getEnrolledCourses()
  }, [])

  // check if the user is enrolled in the course
  const isEnrolled = enrollmentCourses.some((enrolled) => enrolled?.course._id === id)
  const canView = isEnrolled || isCourseOwner

  useEffect(() => {
    const fetchQuiz = async () => {
      if (!selectedVideo?._id || !isEnrolled) {
        setQuizzes([])
        return
      }
      try {
        setQuizError("")
        const res = await axios.get(
          `${API_URL}/quizzes/public/by-lesson?courseId=${id}&lessonId=${selectedVideo._id}`,
          { withCredentials: true }
        )
        setQuizzes(res.data?.quizzes || [])
      } catch (e) {
        setQuizError("لا توجد اختبارات منشورة لهذا الدرس حالياً.")
        setQuizzes([])
      }
    }
    fetchQuiz()
  }, [selectedVideo?._id, id, isEnrolled])

  // reset self-quiz when lesson changes
  useEffect(() => {
    setSelfQuizQuestions([])
    setSelfQuizError("")
    setSelfQuizLoading(false)
    setSelfQuizResponses({})
  }, [selectedVideo?._id])

  const quizToShow = useMemo(() => (quizzes && quizzes.length ? quizzes[0] : null), [quizzes])
  const pdfUrl = useMemo(() => {
    if (selectedVideo?.pdfUrl) return selectedVideo.pdfUrl
    if (Array.isArray(selectedVideo?.resources)) {
      return selectedVideo.resources.find(
        (r) => typeof r === "string" && r.toLowerCase().trim().endsWith(".pdf")
      )
    }
    return null
  }, [selectedVideo])
  const resolvedPdfUrl = useMemo(() => {
    if (!pdfUrl) return null
    if (pdfUrl.startsWith("/")) {
      const apiBase = API_URL.replace(/\/api\/v1$/, "")
      return `${apiBase}${pdfUrl}`
    }
    return pdfUrl
  }, [pdfUrl])

  const handleGenerateSelfQuiz = async () => {
    if (!selectedVideo?._id) return
    try {
      setSelfQuizLoading(true)
      setSelfQuizError("")
      setSelfQuizQuestions([])
      setSelfQuizResponses({})
      const res = await axios.post(
        `${API_URL}/ai/quiz/self`,
        { courseId: id, lessonId: selectedVideo._id, nQuestions: selfQuizCount },
        { withCredentials: true }
      )
      setSelfQuizQuestions(res.data?.questions || [])
    } catch (e) {
      const msg =
        e?.response?.data?.message ||
        e?.response?.data?.error ||
        e?.message ||
        "تعذر توليد الاختبار حالياً."
      setSelfQuizError(msg)
    } finally {
      setSelfQuizLoading(false)
    }
  }

  if (isloading) {
    return (
      <>
        <Containers>
          <Loading />
        </Containers>
      </>
    )
  }

  if (!canView) {
    return (
      <>
        <LogoAndButton />
        <NavBar />
        <ModalTeacher />
        <Containers>
          <NoContentWrapper>
            <EnrollmentMessage>
              <div className="icon">🔒</div>
              <h3>غير مسجل في الدورة</h3>
              <p>لا يمكنك مشاهدة هذا الفيديو، لأنك لم تشترك في هذه الدورة</p>
              <button onClick={() => navigate(`/courses/${name}/${id}`)}>العودة إلى صفحة الدورة</button>
            </EnrollmentMessage>
          </NoContentWrapper>
        </Containers>
      </>
    )
  }

  if (items.length === 0) {
    return (
      <>
        <LogoAndButton />
        <NavBar />
        <ModalTeacher />
        <Containers>
          <NoContentWrapper>
            <NoVideos>
              <div className="icon">📹</div>
              <h3>لا يوجد اختبار حالياً</h3>
              <p>لم يضع المعلم اختباراً لهذا الدرس بعد. انتظر إشعار المعلم عند النشر.</p>
            </NoVideos>
          </NoContentWrapper>
        </Containers>
      </>
    )
  }

  return (
    <>
      <LogoAndButton />
      <NavBar />
      <ModalTeacher />

      <Containers>
        <VideoHeader>
          <div>
            <VideoTitle>{selectedVideo.title || `الدرس ${currentIndex + 1}`}</VideoTitle>
            <VideoMeta>
              <VideoCounter>
                الدرس {currentIndex + 1} من {items.length}
              </VideoCounter>
              <span>•</span>
              <span>{selectedVideo.duration || "غير محدد"}</span>
            </VideoMeta>
          </div>
          <NavigationHint>استخدم الأسهم ← → للتنقل بين الدروس</NavigationHint>
        </VideoHeader>

        <VideoContent>
          <VideoWrapper>
            <PlayerSection>
              <PlayerContainer>
                <VideoPlayerWithControls
                  video={selectedVideo}
                  currentIndex={currentIndex}
                  items={items}
                  onVideoSelect={handleVideoSelect}
                />
              </PlayerContainer>

              {selectedVideo.resources && selectedVideo.resources.length > 0 && (
                <VideoResources resources={selectedVideo.resources} />
              )}
            </PlayerSection>

            <PlaylistSection>
              <SectionTitle>قائمة الدروس</SectionTitle>
              <ListContainer>
                <AnimatedList
                  items={items}
                  onItemSelect={handleVideoSelect}
                  selectedIndex={currentIndex}
                  showGradients
                  enableArrowNavigation
                  displayScrollbar
                />
              </ListContainer>
            </PlaylistSection>
          </VideoWrapper>
        </VideoContent>

        {(selectedVideo?.description || pdfUrl) && (
          <LessonContentCard>
            <SectionTitle>محتوى الدرس</SectionTitle>
            {selectedVideo?.description && (
              <LessonDescription>{selectedVideo.description}</LessonDescription>
            )}

            {resolvedPdfUrl && (
              <>
                <PdfActions>
                  <span className="meta">يمكنك تحميل ملف الـ PDF المرفق.</span>
                  <a href={resolvedPdfUrl} target="_blank" rel="noreferrer" download>
                    📄 تحميل PDF
                  </a>
                </PdfActions>
              </>
            )}
          </LessonContentCard>
        )}

        {canView && (
          <LessonContentCard style={{ display: "grid", gap: 12 }}>
            <SectionTitle>اختبر نفسك (Quiz AI)</SectionTitle>
            <p style={{ margin: 0, color: "#4b5563" }}>
              اضغط لتوليد اختبار ذاتي مبني على هذا الدرس بالذكاء الاصطناعي  (اختيار من متعدد + صح/خطأ).
            </p>
            <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
              <label style={{ color: "#4b5563", fontWeight: 600 }}>
                عدد الأسئلة:
                <input
                  type="number"
                  min={1}
                  max={20}
                  value={selfQuizCount}
                  onChange={(e) => setSelfQuizCount(Number(e.target.value))}
                  style={{
                    marginInlineStart: 8,
                    padding: "6px 10px",
                    borderRadius: 8,
                    border: "1px solid #e5e7eb",
                    width: 80,
                  }}
                />
              </label>
            </div>
            <div>
              <button
                type="button"
                onClick={handleGenerateSelfQuiz}
                disabled={selfQuizLoading}
                style={{
                  background: selfQuizLoading
                    ? "linear-gradient(135deg, #9ca3af 0%, #9ca3af 100%)"
                    : "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
                  color: "#fff",
                  border: "none",
                  padding: "10px 16px",
                  borderRadius: "10px",
                  fontWeight: 700,
                  cursor: "pointer",
                  boxShadow: "0 8px 20px rgba(99, 102, 241, 0.25)",
                }}
              >
                {selfQuizLoading ? "جاري التوليد..." : "🚀 توليد اختبار ذاتي"}
              </button>
            </div>
            {selfQuizError && <div style={{ color: "#dc2626", fontWeight: 600 }}>{selfQuizError}</div>}
            {selfQuizQuestions.length > 0 && (
              <div style={{ display: "grid", gap: 10, marginTop: 8 }}>
                {selfQuizQuestions.map((q, idx) => (
                  <div
                    key={idx}
                    style={{ border: "1px solid #e5e7eb", borderRadius: 10, padding: 12, background: "#f8fafc" }}
                  >
                    <div style={{ fontWeight: 700, marginBottom: 6 }}>سؤال {idx + 1}</div>
                    <div style={{ marginBottom: 6 }}>{q.question}</div>
                    {q.options && q.options.length > 0 && (
                      <div style={{ display: "grid", gap: 8 }}>
                        {q.options.map((opt, oi) => {
                          const key = `${idx}-${oi}`
                          const answered = selfQuizResponses[idx]
                          const isCorrect = answered?.selected === opt && answered?.correct
                          const isWrong = answered?.selected === opt && !answered?.correct
                          return (
                            <button
                              key={key}
                              type="button"
                              onClick={() => {
                                const correct = String(q.correctAnswer || q.answer || "").trim()
                                const selected = String(opt || "").trim()
                                setSelfQuizResponses((prev) => ({
                                  ...prev,
                                  [idx]: {
                                    selected,
                                    correct: selected === correct,
                                    correctAnswer: correct,
                                  },
                                }))
                              }}
                              disabled={!!selfQuizResponses[idx]}
                              style={{
                                textAlign: "left",
                                padding: "10px 12px",
                                borderRadius: 8,
                                border: isCorrect
                                  ? "2px solid #16a34a"
                                  : isWrong
                                  ? "2px solid #dc2626"
                                  : "1px solid #e5e7eb",
                                background: isCorrect
                                  ? "#ecfdf3"
                                  : isWrong
                                  ? "#fef2f2"
                                  : "#fff",
                                cursor: selfQuizResponses[idx] ? "not-allowed" : "pointer",
                              }}
                            >
                              {opt}
                            </button>
                          )
                        })}
                      </div>
                    )}
                    {selfQuizResponses[idx] && (
                      <div style={{ marginTop: 6, fontWeight: 600 }}>
                        {selfQuizResponses[idx].correct ? (
                          <span style={{ color: "#16a34a" }}>الإجابة صحيحة 🎉</span>
                        ) : (
                          <span style={{ color: "#dc2626" }}>
                            إجابة خاطئة. الصحيح: {selfQuizResponses[idx].correctAnswer || "—"}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </LessonContentCard>
        )}

        <ReviewSection>
          <SectionTitle>التعليقات والمراجعات</SectionTitle>
          <ReviewListSection lessonId={selectedVideo._id} from={'videoPage'} />
          <CommentForm
            lessonId={selectedVideo._id}
            from={'videoPage'}
            />
        </ReviewSection>

        {canView && (
          <ReviewSection style={{ marginTop: "24px" }} id="lesson-quiz">
            <SectionTitle>اختبار الدرس</SectionTitle>
            {!quizToShow && <div style={{ color: "#6c757d" }}>{quizError || "لا يوجد اختبار منشور بعد."}</div>}
            {quizToShow && (
              <div style={{ display: "grid", gap: 12 }}>
                <div style={{ fontWeight: 700 }}>{quizToShow.title || quizToShow.quizTitle || "اختبار"}</div>
                <div style={{ display: "grid", gap: 10 }}>
                  {quizToShow.questions.map((q, idx) => (
                    <div key={idx} style={{ padding: 12, border: "1px solid #e9ecef", borderRadius: 10, background: "#f8f9fa" }}>
                      <div style={{ fontWeight: 600, marginBottom: 6 }}>
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
                      <details>
                        <summary style={{ cursor: "pointer", color: "#0d6efd" }}>عرض الإجابة</summary>
                        <div style={{ marginTop: 6 }}>
                          <b>الإجابة:</b> {String(q.answer)}
                        </div>
                        <div style={{ marginTop: 4, fontSize: 13, color: "#495057" }}>
                          <b>شرح:</b> {q.explanation}
                        </div>
                      </details>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </ReviewSection>
        )}
      </Containers>
    </>
  )
}

export default VideoPage
