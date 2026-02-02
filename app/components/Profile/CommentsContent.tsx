// React Native core
import { useEffect, useState } from "react";
import { ScrollView, Text, View } from "react-native";

// External libraries
import { useUser } from "@clerk/clerk-expo";
import { Timestamp } from "firebase/firestore";

// Utils
import { formatDate } from "@/utils/dateFormat";
import {
  arrangeRecipeCommentsByUserId,
  getRecipeById,
} from "@/utils/recipeServices";
import { arrangeReviewsByUserId } from "@/utils/reviewServices";
import { getStallDataById } from "@/utils/stallServices";
import { fetchUserByClerkId } from "@/utils/userServices";

// Components
import ListWithSeeMore from "@/app/components/ListWithLoadMore";
import Loader from "@/app/components/Loader";
import ProfileCommentsHeader from "@/app/components/Profile/CommentsContent/ProfileCommentsHeader";
import ProfileRecipeCommentsCard from "@/app/components/Profile/CommentsContent/ProfileRecipeCommentsCard";
import ProfileReviewCommentsCard from "@/app/components/Profile/CommentsContent/ProfileReviewCommentsCard";

// 1. Define the type
type RecipeComment = {
  id: string;
  timestamp: Timestamp;
  likes: number;
  formatted_date?: string;
  content: string;
  user_id: string;
  recipe_id: string;
  comment_pic?: string;
};

type ReviewComment = {
  id: string;
  timestamp: Timestamp;
  likes: number;
  formatted_date?: string;
  content: string;
  title: string;
  user_id: string;
  stall_id: string;
  review_pic?: string;
};

interface CommentsContentProps {
  activeTab: string;
  toggleModalVisibility: (type: string) => void;
  editModalVisible: string;
}
const CommentsContent: React.FC<CommentsContentProps> = ({
  activeTab,
  toggleModalVisibility,
  editModalVisible,
}) => {
  // To choose between comments and recipes
  const [pageInfo, setPageInfo] = useState("comments");

  const { user } = useUser();
  const [userId, setUserId] = useState("");
  const [comments, setComments] = useState<any[]>([]);
  const [maxLength, setMaxLength] = useState(0);

  // Fetch user ID based on Clerk ID when activeTab changes
  useEffect(() => {
    const fetchAndSetUserId = async () => {
      if (user) {
        const fetchedUser = await fetchUserByClerkId(user.id);
        if (fetchedUser) {
          setUserId(fetchedUser.id);
        }
      }
    };
    fetchAndSetUserId();
  }, [activeTab, user]);

  // Fetch comments when userId changes
  useEffect(() => {
    if (pageInfo === "comments") {
      fetchAndSetRecipeComments(4);
    } else {
      fetchAndSetReviewComments(4);
    }
  }, [userId, pageInfo, editModalVisible]);

  // Fetch and set recipe comments
  const fetchAndSetRecipeComments = async (limitNumber: number) => {
    if (userId) {
      const userComments = await arrangeRecipeCommentsByUserId(
        userId,
        "most_recent",
        limitNumber
      );

      // Type assertion to specify the type of content
      const userCommentsArray = userComments.content as RecipeComment[];

      // Set max length for pagination
      setMaxLength(userComments.total);

      // Add formatted date to each comment
      const commentsWithDate = userCommentsArray.map((comment) => ({
        ...comment,
        formatted_date: formatDate(comment.timestamp.seconds),
      }));

      // Fetch recipe titles for comments that have a recipe_id
      const commentsWithRecipeComments = await Promise.all(
        commentsWithDate.map(async (comment) => {
          if (comment.recipe_id) {
            const recipe = (await getRecipeById(comment.recipe_id)) as {
              id: string;
              title: string;
            };
            return {
              ...comment,
              title: recipe?.title || "",
            };
          }
          return comment;
        })
      );
      setComments(commentsWithRecipeComments);
    }
  };

  // Fetch and set review comments
  const fetchAndSetReviewComments = async (limitNumber: number) => {
    if (userId) {
      const userComments = await arrangeReviewsByUserId(
        userId,
        "most_recent",
        limitNumber
      );

      // Type assertion to specify the type of content
      const userCommentsArray =
        userComments.content as unknown as ReviewComment[];

      // Set max length for pagination
      setMaxLength(userComments.total);

      // Add formatted date to each comment
      const commentsWithDate = userCommentsArray.map((comment) => ({
        ...comment,
        formatted_date: formatDate(comment.timestamp.seconds),
      }));

      // Fetch review titles for comments that have a review_id
      const commentsWithReviewComments = await Promise.all(
        commentsWithDate.map(async (comment) => {
          if (comment.stall_id) {
            const stall = (await getStallDataById(comment.stall_id)) as {
              id: string;
              name: string;
            };
            return {
              ...comment,
              stall_name: stall?.name || "",
            };
          }
          return comment;
        })
      );
      setComments(commentsWithReviewComments);
    }
  };

  const recipeCommentCards = comments.map((comment) => (
    <View key={comment.id}>
      <ProfileRecipeCommentsCard
        comment={comment}
        toggleModalVisibility={toggleModalVisibility}
      />
    </View>
  ));

  const reviewCommentCards = comments.map((comment) => (
    <View key={comment.id}>
      <ProfileReviewCommentsCard
        comment={comment}
        toggleModalVisibility={toggleModalVisibility}
      />
    </View>
  ));

  // Function to switch between comments and reviews in header
  const handlePageInfoChange = () => {
    setComments(["loading"]);
    setPageInfo(pageInfo === "comments" ? "reviews" : "comments");
  };

  return (
    <View className="rounded-3xl w-full h-full items-center bg-darkcream/80 px-8 pt-8 mt-4">
      <ProfileCommentsHeader
        pageInfo={pageInfo}
        handlePageInfoChange={handlePageInfoChange}
      />
      <ScrollView className="flex-col w-full max-h-[500px]">
        {comments.length === 0 ? (
          <Text className="text-center text-lg text-blue mt-8">
            No comments yet.
          </Text>
        ) : comments[0] === "loading" ? (
          <View className="h-full justify-center items-center">
            <Loader />
          </View>
        ) : (
          <ListWithSeeMore
            content={
              pageInfo === "comments" ? recipeCommentCards : reviewCommentCards
            }
            maxCount={maxLength}
            fetchFn={(arrangement, limitNumber) =>
              pageInfo === "comments"
                ? fetchAndSetRecipeComments(limitNumber)
                : fetchAndSetReviewComments(limitNumber)
            }
            arrangement="most_recent"
          />
        )}
        <View className="mt-16"></View>
      </ScrollView>
    </View>
  );
};

export default CommentsContent;
