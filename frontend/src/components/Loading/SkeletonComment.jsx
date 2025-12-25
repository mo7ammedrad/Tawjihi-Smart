import { SkeletonAvatar, SkeletonLine, SkeletonLineShort } from "./style";
import {
  ReviewCard,
  ReviewContent,
  ReviewHeader,
  ReviewText,
} from "../ReviewListSection/style";

function SkeletonComment() {
  return (
    <ReviewCard>
      <SkeletonAvatar
        style={{
          borderRadius: "50%",
          width: "45px",
          height: "45px",
        }}
      ></SkeletonAvatar>
      <ReviewContent>
        <ReviewHeader>
          <SkeletonLineShort> </SkeletonLineShort>
        </ReviewHeader>
        <ReviewText>
          <SkeletonLine></SkeletonLine>
        </ReviewText>
      </ReviewContent>
    </ReviewCard>
  );
}

export default SkeletonComment;
