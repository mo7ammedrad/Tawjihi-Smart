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

  const { name, id, videoIndex } = useParams()
  const navigate = useNavigate()
  const { state } = useLocation()

  const items = Array.isArray(state?.items) ? state.items : []
  const currentIndex = Number(videoIndex) >= 0 && items[videoIndex] ? Number(videoIndex) : 0
  const selectedVideo = items[currentIndex] || {}


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

  const quizToShow = useMemo(() => (quizzes && quizzes.length ? quizzes[0] : null), [quizzes])

  if (isloading) {
    return (
      <>
        <Containers>
          <Loading />
        </Containers>
      </>
    )
  }

  if (!isEnrolled) {
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

        <ReviewSection>
          <SectionTitle>التعليقات والمراجعات</SectionTitle>
          <ReviewListSection lessonId={selectedVideo._id} from={'videoPage'} />
          <CommentForm
            lessonId={selectedVideo._id}
            from={'videoPage'}
            />
        </ReviewSection>

        {isEnrolled && (
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
