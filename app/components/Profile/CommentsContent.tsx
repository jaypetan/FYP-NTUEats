// React Native core
import { useEffect, useState } from "react";
import { ScrollView, Text, View } from "react-native";

// External libraries
import { useUser } from "@clerk/clerk-expo";
import { Timestamp } from "firebase/firestore";

// Utils
import { formatDate } from "@/utils/dateFormat";
import {
  getRecipeById,
  getRecipeCommentsByUserId,
} from "@/utils/recipeServices";
import { fetchUserByClerkId } from "@/utils/userServices";

// Components
import ProfileCommentsCard from "@/app/components/Profile/CommentsContent/ProfileCommentsCard";
import ProfileCommentsHeader from "@/app/components/Profile/CommentsContent/ProfileCommentsHeader";

// 1. Define the type
type Comment = {
  id: string;
  timestamp: Timestamp;
  likes: number;
  formatted_date?: string;
  content: string;
  user_id: string;
  recipe_id: string;
  comment_pic?: string;
};

interface CommentsContentProps {
  activeTab?: string;
}
const CommentsContent: React.FC<CommentsContentProps> = ({ activeTab }) => {
  // To choose between comments and recipes
  const [pageInfo, setPageInfo] = useState("comments");

  const { user } = useUser();
  const [userId, setUserId] = useState("");
  const [comments, setComments] = useState<any[]>([]);

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
    const fetchAndSetComments = async () => {
      if (userId) {
        const userComments = (await getRecipeCommentsByUserId(
          userId
        )) as Comment[];
        const commentsWithDate = userComments.map((comment) => ({
          ...comment,
          formatted_date: formatDate(comment.timestamp.seconds),
        }));
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
        console.log("Fetched comments:", commentsWithRecipeComments);
      }
    };
    fetchAndSetComments();
  }, [userId]);

  return (
    <ScrollView className="px-8 pt-8 mt-4 bg-darkcream/80 w-full h-full rounded-3xl">
      <ProfileCommentsHeader pageInfo={pageInfo} setPageInfo={setPageInfo} />
      {comments.length === 0 ? (
        <Text className="text-center text-lg text-blue mt-8">
          No comments yet.
        </Text>
      ) : (
        comments.map((comment) => (
          <View key={comment.id}>
            <ProfileCommentsCard comment={comment} />
          </View>
        ))
      )}
    </ScrollView>
  );
};

export default CommentsContent;
