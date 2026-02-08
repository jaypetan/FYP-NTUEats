// React & React Native
import { useState } from "react";
import { View } from "react-native";

// Components
import LoadMore from "@/app/components/LoadMore";

interface ListWithSeeMoreProps {
  content: React.ReactNode;
  maxCount: number;
  fetchFn: (arrangement: string, limitNumber: number) => void;
  arrangement: string;
}

const ListWithSeeMore: React.FC<ListWithSeeMoreProps> = ({
  content,
  maxCount,
  fetchFn,
  arrangement,
}) => {
  const INITIAL_COUNT = 4;
  const [visibleCount, setVisibleCount] = useState(INITIAL_COUNT);

  const loadMoreStalls = () => {
    let newLimit = visibleCount + 2;
    if (newLimit > maxCount) {
      newLimit = maxCount;
    }
    setVisibleCount(newLimit);
    fetchFn(arrangement, newLimit);
  };

  return (
    <View className="flex-col">
      <View className="flex-col gap-2">{content}</View>
      {visibleCount < maxCount && <LoadMore onClick={loadMoreStalls} />}
    </View>
  );
};

export default ListWithSeeMore;
