import {
  AvatarCircle,
  ReviewActions,
  ReviewCard,
  ReviewContent,
  ReviewerName,
  ReviewHeader,
  ReviewList,
  ReviewText,
} from "./style";
import { useEffect, useState } from "react";
import SkeletonComment from "../Loading/SkeletonComment";
import {
  Typography,
  Modal,
  Box,
  TextField,
  Button,
  CircularProgress,
} from "@mui/material";
import { FaEdit, FaTrash } from "react-icons/fa";
import { useComments } from "../../context/CommentContext";

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  borderRadius: "10px",
  boxShadow: 24,
  p: 4,
};

const ReviewListSection = ({ courseId, lessonId, from }) => {
  const {
    course_comments,
    lesson_comments,
    isReviewsLoading,
    isReviewDeleting,
    reviewDeletingId,
    isUpdating,
    getCourseComments,
    deleteCourseComment,
    updateCourseComment,
    getLessonComments,
    deleteLessonComment,
    updateLessonComment,
  } = useComments();

  const reviews = from === "videoPage" ? lesson_comments : course_comments;

  const [editContent, setEditContent] = useState("");
  const [editReviewId, setEditReviewId] = useState(null);
  const [isModalOpen, setModalOpen] = useState(false);

  const userData = JSON.parse(localStorage.getItem("user"));
  const userId = userData?._id;

  useEffect(() => {
    if (from === "videoPage") {
      getLessonComments(lessonId);
    } else if (from === "coursePage") {
      getCourseComments(courseId);
    }
  }, [courseId, lessonId]);

  const handleDelete = async (clickedReviewId) => {
    if (from === "videoPage") {
      await deleteLessonComment(lessonId, clickedReviewId);
    } else if (from === "coursePage") {
      await deleteCourseComment(courseId, clickedReviewId);
    }
  };

  const openEditModal = (reviewId, currentContent) => {
    setEditReviewId(reviewId);
    setEditContent(currentContent);
    setModalOpen(true);
  };

  const handleUpdate = async () => {
    if (from === "videoPage") {
      await updateLessonComment(lessonId, editReviewId, editContent);
    } else if (from === "coursePage") {
      await updateCourseComment(courseId, editReviewId, editContent);
    }
    setModalOpen(false);
  };

  return (
    <>
      <ReviewList>
        {isReviewsLoading ? (
          Array.from({ length: 3 }).map((_, i) => <SkeletonComment key={i} />)
        ) : reviews.length === 0 ? (
          <Typography style={{ padding: "10px 0px" }}>
            لا توجد مراجعات حتى الآن
          </Typography>
        ) : (
          reviews?.map((review, index) => (
            <ReviewCard key={index}>
              <AvatarCircle>
                {review?.user?.name?.charAt(0).toUpperCase()}
              </AvatarCircle>
              <ReviewContent>
                <ReviewHeader>
                  <ReviewerName>{review?.user?.name}</ReviewerName>
                  <ReviewActions>
                    {review?.user?._id === userId && (
                      <>
                        <FaEdit
                          style={{
                            cursor:
                              isUpdating || isReviewDeleting
                                ? "not-allowed"
                                : "pointer",
                            opacity:
                              isUpdating || isReviewDeleting ? 0.5 : 1,
                          }}
                          onClick={() =>
                            !isUpdating &&
                            !isReviewDeleting &&
                            openEditModal(
                              review?._id,
                              from === "videoPage"
                                ? review.content
                                : review.comment
                            )
                          }
                        />
                    
                        {isReviewDeleting && reviewDeletingId === review?._id ? (

                          <CircularProgress size={16} />
                        ) : (
                          <FaTrash
                            style={{
                              cursor:
                                isUpdating || isReviewDeleting
                                  ? "not-allowed"
                                  : "pointer",
                              opacity:
                                isUpdating || isReviewDeleting ? 0.5 : 1,
                            }}
                            onClick={() =>
                              !isUpdating &&
                              !isReviewDeleting &&
                              handleDelete(review?._id)
                            }
                          />
                        )}
                      </>
                    )}
                  </ReviewActions>
                </ReviewHeader>
                <ReviewText>
                  {from === "videoPage"
                    ? review?.content
                    : from === "coursePage"
                      ? review?.comment
                      : null}
                </ReviewText>
              </ReviewContent>
            </ReviewCard>
          ))
        )}
      </ReviewList>

      {/* Modal */}
      <Modal open={isModalOpen} onClose={() => setModalOpen(false)}>
        <Box sx={modalStyle}>
          <Typography variant="h6" gutterBottom>
            تعديل المراجعة
          </Typography>
          <TextField
            fullWidth
            multiline
            rows={4}
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            disabled={isUpdating}
          />
          <Box mt={2} display="flex" justifyContent="flex-end" gap={1}>
            <Button
              variant="outlined"
              onClick={() => setModalOpen(false)}
              disabled={isUpdating}
            >
              إلغاء
            </Button>
            <Button
              variant="contained"
              onClick={handleUpdate}
              disabled={isUpdating}
            >
              {isUpdating ? (
                <CircularProgress size={20} color="inherit" />
              ) : (
                "تحديث"
              )}
            </Button>
          </Box>
        </Box>
      </Modal>
    </>
  );
};

export default ReviewListSection;
