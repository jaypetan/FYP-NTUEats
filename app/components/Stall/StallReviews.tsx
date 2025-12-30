import { fetchReviewsByStallId } from "@/utils/reviewServices";
import { fetchUserByDocId } from "@/utils/userServices";
import { useEffect, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import StallReviewCard from "./StallReviewCard";

interface StallReviewProps {
  selectedId: string | null;
}
const StallReview: React.FC<StallReviewProps> = (selectedId) => {
  const [numOfReviews, setNumOfReviews] = useState(3);
  // Get reviews from backend based on selectedId
  const [reviewsData, setReviewsData] = useState<any[]>([]);

  useEffect(() => {
    fetchReviewsByStallId(selectedId.selectedId).then(async (data: any[]) => {
      if (data) {
        const reviewsWithNames = await Promise.all(
          data.map(async (review) => {
            review.reviewDate = formatDate(review.timestamp);
            review.name = await getUserName(review.user_id);
            return review;
          })
        );
        console.log(reviewsWithNames);
        setReviewsData(reviewsWithNames);
      }
    });
  }, [selectedId.selectedId]);

  // Get names from user IDs in reviewsData
  const getUserName = async (userId: string) => {
    const userData = await fetchUserByDocId(userId);
    return userData ? userData.username : "Unknown User";
  };

  // Convert date format from ISO to MM/DD/YYYY
  const formatDate = (input: { seconds: number }) => {
    console.log(input.seconds * 1000);
    const date = new Date(input.seconds * 1000);
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const year = date.getFullYear();
    return `${month}/${day}/${year}`;
  };

  // const reviews = [
  //   {
  //     reviewImage: review1,
  //     reviewDate: "1/1/2025",
  //     reviewTitle: "The best food in the world",
  //     reviewDescription:
  //       "The food was delicious and full of flavor, with fresh ingredients and perfect seasoning. The service was friendly and the cozy atmosphere made the experience even better.",
  //     reviewName: "Jaype",
  //     reviewLikes: 1000,
  //   },
  //   {
  //     reviewImage: review2,
  //     reviewDate: "1/1/2025",
  //     reviewTitle: "Good Food",
  //     reviewDescription: "Yum Yum in the Tum",
  //     reviewName: "Ting",
  //     reviewLikes: 888,
  //   },
  //   {
  //     reviewTitle: "Highly Recommended",
  //     reviewDate: "1/1/2025",
  //     reviewDescription:
  //       "The food was delicious and full of flavor, with fresh ingredients and perfect seasoning. The service was friendly and the cozy atmosphere made the experience even better.”",
  //     reviewName: "Joe",
  //     reviewLikes: 30,
  //   },
  //   {
  //     reviewTitle: "Test Comment",
  //     reviewDate: "1/1/2025",
  //     reviewDescription: "Yum Yum in the Tum",
  //     reviewName: "Joe",
  //     reviewLikes: 30,
  //   },
  //   {
  //     reviewImage: review2,
  //     reviewTitle: "Test Comment",
  //     reviewDate: "1/1/2025",
  //     reviewDescription: "Yum Yum in the Tum",
  //     reviewName: "Joe",
  //     reviewLikes: 30,
  //   },
  // ];
  return (
    <View className="flex-col gap-4 mt-8">
      <Text className="text-blue font-inter font-bold text-3xl w-full text-center">
        Top Reviews
      </Text>
      <View className="flex-col gap-4">
        {reviewsData.slice(0, numOfReviews).map((review, index) => (
          <StallReviewCard
            key={index}
            reviewImage={review.review_pic}
            reviewDate={review.reviewDate}
            reviewTitle={review.title}
            reviewDescription={review.content}
            reviewName={review.name}
            reviewLikes={review.likes}
          />
        ))}
      </View>
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
    </View>
  );
};

export default StallReview;
