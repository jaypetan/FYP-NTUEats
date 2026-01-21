import { useState } from "react";
import { Text, View } from "react-native";
import TouchableScale from "../TouchableScale";
import CommentUploadModal from "./CommentUploadModal";
import RecipeCommentCard from "./RecipeCommentCard";

interface RecipeCommentsProps {
  comments: object[];
  fetchCommentsData: () => Promise<void>;
}

const RecipeComments: React.FC<RecipeCommentsProps> = ({
  comments,
  fetchCommentsData,
}) => {
  const [commentUploadModalVisible, setCommentUploadModalVisible] =
    useState(false);
  return (
    <>
      {commentUploadModalVisible && (
        <CommentUploadModal
          commentUploadModalVisible={commentUploadModalVisible}
          setCommentUploadModalVisible={setCommentUploadModalVisible}
          fetchCommentsData={fetchCommentsData}
        />
      )}
      <View className="justify-between flex-row items-center mt-4 border-b border-blue pb-4">
        <Text className="text-3xl pt-2 mt-4 font-koulen text-blue">
          Comments:
        </Text>
        <TouchableScale
          onPress={() => setCommentUploadModalVisible(true)}
          className="bg-green/50 rounded-xl px-4 py-2"
        >
          <Text className="text-blue font-semibold text-xl">Add Comment</Text>
        </TouchableScale>
      </View>
      <View className="px-2 pt-4">
        {comments.length === 0 ? (
          <Text className="text-xl text-blue">No comments yet.</Text>
        ) : (
          comments.map((comment: any, index: number) => (
            <RecipeCommentCard key={index} comment={comment} />
          ))
        )}
      </View>
    </>
  );
};

export default RecipeComments;
