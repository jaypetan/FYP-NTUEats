// React and React Native core
import { useEffect, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";

// Utilities
import { getReviewArranged } from "@/utils/reviewServices";
import { fetchUserByDocId } from "@/utils/userServices";

// Components
import StallReviewCard from "@/app/components/Stall/Review/StallReviewCard";
import StallReviewHeader from "@/app/components/Stall/Review/StallReviewHeader";

interface StallReviewProps {
  selectedId: string | null;
}
const StallReview: React.FC<StallReviewProps> = (selectedId) => {
  const [numOfReviews, setNumOfReviews] = useState(3);
  const [arrangement, setArrangement] = useState("most_liked");
  // Get reviews from backend based on selectedId
  const [reviewsData, setReviewsData] = useState<any[]>([]);

  // Fetch reviews when selectedId changes
  useEffect(() => {
    if (selectedId.selectedId) {
      arrangeReviews();
    }
  }, [selectedId.selectedId, arrangement]);

  // Get names from user IDs in reviewsData, and format dates
  const arrangeReviews = () => {
    getReviewArranged(selectedId.selectedId, arrangement).then(
      async (data: any[]) => {
        if (data) {
          const reviewsWithNames = await Promise.all(
            data.map(async (review) => {
              review.reviewDate = formatDate(review.timestamp);
              review.name = await getUserName(review.user_id);
              return review;
            })
          );
          setReviewsData(reviewsWithNames);
        }
      }
    );
  };

  // Get names from user IDs in reviewsData
  const getUserName = async (userId: string) => {
    const userData = await fetchUserByDocId(userId);
    return userData ? userData.username : "Unknown User";
  };

  // Convert date format from ISO to MM/DD/YYYY
  const formatDate = (input: { seconds: number }) => {
    const date = new Date(input.seconds * 1000);
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const year = date.getFullYear();
    return `${month}/${day}/${year}`;
  };

  return (
    <View className="flex-col gap-4 mt-8" pointerEvents="box-none">
      <StallReviewHeader
        arrangement={arrangement}
        setArrangement={setArrangement}
        arrangeReviews={arrangeReviews}
      />
      <View className="flex-col gap-4">
        {!reviewsData ||
          (reviewsData.length === 0 && (
            <Text className="text-black text-xl text-center">
              No reviews currently available.
            </Text>
          ))}
        {reviewsData.slice(0, numOfReviews).map((review, index) => (
          <StallReviewCard
            key={index}
            reviewID={review.id}
            reviewImage={review.review_pic}
            reviewDate={review.reviewDate}
            reviewTitle={review.title}
            reviewDescription={review.content}
            reviewName={review.name}
          />
        ))}
      </View>
      {reviewsData.length > numOfReviews && (
        <TouchableOpacity
          className="border-2 border-blue rounded-2xl p-4 flex-row justify-center"
          onPress={() =>
            setNumOfReviews(
              numOfReviews + 1 < reviewsData.length
                ? numOfReviews + 2
                : reviewsData.length
            )
          }
        >
          <Text className="text-blue font-inter font-bold text-lg">
            View More Reviews
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default StallReview;
