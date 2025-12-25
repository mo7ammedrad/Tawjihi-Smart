//react
import { useState } from "react";
import { useNavigate } from "react-router-dom";

//axios
import axios from "axios";

//toastify
import { toast } from "react-toastify";

//hooks
import { useCRUD } from "../../hooks/useCRUD";
//URL
import { API_URL } from "../../config";

//PATH
import { PATH } from "../../routes";

//styled
import {
  CourseCardContainer,
  ActionIcons,
  ActionBtn,
  ImageContainer,
  CourseImage,
  ImageOverlay,
  CardContent,
  CourseHeader,
  CourseInfo,
  CourseTitle,
  CourseMeta,
  MetaItem,
  TeacherInfo,
  TeacherDetails,
  TeacherLabel,
  TeacherName,
  CourseDescription,
  CardFooter,
  RatingContainer,
  StarsContainer,
  RatingText,
  PriceContainer,
  FreeBadge,
  PriceInfo,
  OldPrice,
  CurrentPrice,
} from "./style";

//icons
import {
  BookIcon,
  CartIcon,
  GraduationCapIcon,
  HeartIcon,
  StarIconComponent,
  UserIcon,
} from "../Icon/cartAndWishIcon";

export const CourseCard = ({
  imgSrc,
  teacherName,
  name,
  desc,
  starIcon = 0,
  price,
  priceAfterDiscount,
  branch,
  subject,
  id,
  item,
}) => {
  const {
    addToWishList,
    removeFromWishList,
    isInWishList,
    addToCartList,
    removeFromCartList,
    isInCartList,
  } = useCRUD();

  const [loadingCart, setLoadingCart] = useState(false);
  const [loadingWish, setLoadingWish] = useState(false);
  const navigate = useNavigate();

  const handleClickHeart = async () => {
    setLoadingWish(true);
    try {
      if (isInWishList(id)) {
        await axios.delete(`${API_URL}/wishlist/${id}`, {
          withCredentials: true,
        });
        removeFromWishList(id);
        toast.info("تمت إزالة الدورة من قائمة المفضلة");
      } else {
        await axios.post(
          `${API_URL}/wishlist/${id}`,
          { itemId: id },
          { withCredentials: true }
        );
        addToWishList(item);
        toast.success("تمت إضافة الدورة إلى قائمة المفضلة");
      }
    } catch (e) {
      console.error("Wishlist error:", e.message);
      toast.error("حدث خطأ أثناء تحديث قائمة المفضلة");
    } finally {
      setLoadingWish(false);
    }
  };

  const handleClickCart = async () => {
    setLoadingCart(true);
    try {
      if (isInCartList(id)) {
        await axios.delete(`${API_URL}/cart/${id}`, { withCredentials: true });
        removeFromCartList(id);
        toast.info("تمت إزالة الدورة من السلة");
      } else {
        await axios.post(
          `${API_URL}/cart/${id}`,
          { itemId: id },
          { withCredentials: true }
        );
        addToCartList(item);
        toast.success("تمت إضافة الدورة إلى السلة");
      }
    } catch (e) {
      console.error("Cart error:", e.message);
      toast.error("حدث خطأ أثناء تحديث السلة");
    } finally {
      setLoadingCart(false);
    }
  };

  const fullStars = Math.floor(starIcon);
  const hasHalfStar = starIcon % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  const renderStars = () => {
    const stars = [];

    // Full stars
    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <StarIconComponent
          key={`full-${i}`}
          filled={true}
          className="star-filled"
        />
      );
    }

    // Half star
    if (hasHalfStar) {
      stars.push(
        <StarIconComponent key="half" half={true} className="star-half" />
      );
    }

    // Empty stars
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <StarIconComponent
          key={`empty-${i}`}
          filled={false}
          className="star-empty"
        />
      );
    }

    return stars;
  };

  return (
    <CourseCardContainer>
      {/* Action Icons */}
      <ActionIcons>
        <ActionBtn
          className={`${isInCartList(id) ? "active" : ""} ${
            loadingCart ? "loading" : ""
          }`}
          onClick={handleClickCart}
          disabled={loadingCart}
        >
          <CartIcon />
        </ActionBtn>
        <ActionBtn
          className={`${isInWishList(id) ? "active wishlist-active" : ""} ${
            loadingWish ? "loading" : ""
          }`}
          onClick={handleClickHeart}
          disabled={loadingWish}
        >
          <HeartIcon filled={isInWishList(id)} />
        </ActionBtn>
      </ActionIcons>

      {/* Course Image */}
      {imgSrc && (
        <ImageContainer>
          <CourseImage
            src={imgSrc || "/placeholder.svg"}
            alt={`صورة تخص ${name || "الدورة"}`}
          />
          <ImageOverlay />
        </ImageContainer>
      )}

      <CardContent>
        {/* Course Header */}
        <CourseHeader
          onClick={() => {
            navigate(`/${PATH.Courses}/${name}/${id}`, { replace: true });
          }}
        >
          <CourseInfo>
            <CourseTitle>{name}</CourseTitle>

            <CourseMeta>
              <MetaItem>
                <BookIcon />
                <span>المادة: {subject}</span>
              </MetaItem>
              <MetaItem>
                <GraduationCapIcon />
                <span>{branch}</span>
              </MetaItem>
            </CourseMeta>
          </CourseInfo>

          {/* Teacher Info */}
          {teacherName && (
            <TeacherInfo>
              <TeacherDetails>
                <UserIcon />
                <TeacherLabel>المعلم: </TeacherLabel>
                <TeacherName>{teacherName}</TeacherName>
              </TeacherDetails>
            </TeacherInfo>
          )}

          {/* Description */}
          {desc && <CourseDescription>{desc}</CourseDescription>}
        </CourseHeader>

        {/* Footer */}
        <CardFooter>
          {/* Rating */}
          <RatingContainer>
            <StarsContainer>{renderStars()}</StarsContainer>
            <RatingText>({starIcon.toFixed(1)})</RatingText>
          </RatingContainer>

          {/* Price */}
          {price !== undefined && (
            <PriceContainer>
              {price === 0 ? (
                <FreeBadge>مجاني</FreeBadge>
              ) : (
                <PriceInfo>
                  {priceAfterDiscount ? (
                    <>
                      <OldPrice>{price} ₪</OldPrice>
                      <CurrentPrice>{priceAfterDiscount} ₪</CurrentPrice>
                    </>
                  ) : (
                    <CurrentPrice>{price} ₪</CurrentPrice>
                  )}
                </PriceInfo>
              )}
            </PriceContainer>
          )}
        </CardFooter>
      </CardContent>
    </CourseCardContainer>
  );
};
