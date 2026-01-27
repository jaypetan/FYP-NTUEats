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
  selectedId: string | "";
}

const StallReview: React.FC<StallReviewProps> = (selectedId) => {
  const [numOfReviews, setNumOfReviews] = useState(3);
  const [arrangement, setArrangement] = useState("most_liked");
  // Get reviews from backend based on selectedId
  const [reviewsData, setReviewsData] = useState<any[]>([]);
  const [reviewsLength, setReviewsLength] = useState(0);

  // Fetch reviews when selectedId changes
  useEffect(() => {
    if (selectedId.selectedId) {
      arrangeReviews(arrangement, numOfReviews);
    }
  }, [selectedId.selectedId, arrangement, numOfReviews]);

  // Get names from user IDs in reviewsData, and format dates
  const arrangeReviews = (arrangement: string, numOfReviews: number) => {
    getReviewArranged(selectedId.selectedId, arrangement, numOfReviews).then(
      async (data) => {
        if (data && Array.isArray(data.data)) {
          const reviewsWithNames = await Promise.all(
            data.data.map(async (review) => ({
              ...review,
              reviewDate: formatDate(review.timestamp),
              name: await getUserName(review.user_id),
            }))
          );
          setReviewsData(reviewsWithNames);
          setReviewsLength(data.length);
        } else {
          setReviewsData([]);
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

  const handleMoreReviews = () => {
    let newNumOfReviews = numOfReviews + 2;
    if (newNumOfReviews > reviewsLength) {
      newNumOfReviews = reviewsLength;
    }
    setNumOfReviews(newNumOfReviews);
    arrangeReviews(arrangement, newNumOfReviews);
  };

  return (
    <View className="flex-col gap-4 mt-8" pointerEvents="box-none">
      <StallReviewHeader
        arrangement={arrangement}
        setArrangement={setArrangement}
      />
      <View className="flex-col gap-4">
        {!reviewsData ||
          (reviewsData.length === 0 && (
            <Text className="text-black text-xl text-center">
              No reviews currently available.
            </Text>
          ))}
        {reviewsData.map((review, index) => (
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
      {reviewsLength > numOfReviews && (
        <TouchableOpacity
          className="border-2 border-blue rounded-2xl p-4 flex-row justify-center"
          onPress={() => handleMoreReviews()}
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
