// React and React Native core
import { useCallback, useEffect, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";

// External libraries
import Animated, { SequencedTransition } from "react-native-reanimated";

// Utilities
import { getReviewArranged } from "@/utils/reviewServices";

// Components
import StallReviewCard from "@/app/components/Stall/Review/StallReviewCard";
import StallReviewHeader from "@/app/components/Stall/Review/StallReviewHeader";
import { useAppContext } from "../../AppContext";

interface StallReviewProps {
  selectedId: string | null;
}

const StallReview: React.FC<StallReviewProps> = ({ selectedId }) => {
  const { selectedSecondaryId } = useAppContext();

  const [numOfReviews, setNumOfReviews] = useState(3);
  const [arrangement, setArrangement] = useState("most_liked");
  // Get reviews from backend based on selectedId
  const [reviewsData, setReviewsData] = useState<any[]>([]);
  const [reviewsLength, setReviewsLength] = useState(0);

  // Get names from user IDs in reviewsData, and format dates
  const arrangeReviews = useCallback(
    async (nextArrangement: string, nextNumOfReviews: number) => {
      if (!selectedId) {
        setReviewsData([]);
        setReviewsLength(0);
        return;
      }

      const data = await getReviewArranged(
        selectedId,
        nextArrangement,
        nextNumOfReviews,
      );

      if (data && Array.isArray(data.data)) {
        setReviewsData(data.data);
        setReviewsLength(data.length);
      } else {
        setReviewsData([]);
      }
    },
    [selectedId],
  );

  // Fetch reviews when selectedId changes
  useEffect(() => {
    arrangeReviews(arrangement, numOfReviews);
  }, [arrangement, numOfReviews, arrangeReviews]);

  // Move selected review to top when selectedSecondaryId changes or reviews finish loading
  useEffect(() => {
    if (!selectedSecondaryId || reviewsData.length === 0) return;

    // Find the index of the selected review
    const selectedIndex = reviewsData.findIndex(
      (review) => review.id === selectedSecondaryId,
    );

    // If the selected review is already at the top or doesn't exist, do nothing
    if (selectedIndex <= 0) return;

    // Move the selected review to the top of the list
    setReviewsData((prevData) => {
      const currentIndex = prevData.findIndex(
        (review) => review.id === selectedSecondaryId,
      );

      if (currentIndex <= 0) {
        return prevData;
      }

      const reorderedData = [...prevData];
      const [selectedReview] = reorderedData.splice(currentIndex, 1);
      reorderedData.unshift(selectedReview);
      return reorderedData;
    });
  }, [selectedSecondaryId, reviewsData]);

  // Handle "View More Reviews" button press
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
          <Animated.View layout={SequencedTransition} key={review.id}>
            <StallReviewCard
              key={index}
              reviewID={review.id}
              reviewImage={review.review_pic}
              reviewDate={review.reviewDate}
              reviewTitle={review.title}
              reviewDescription={review.content}
              reviewName={review.name}
            />
          </Animated.View>
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
