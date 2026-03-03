import React, {
  Dispatch,
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import {
  fetchDietaryRestrictions,
  fetchUserByClerkId,
} from "@/utils/userServices";
import { useUser } from "@clerk/clerk-expo";

// Define the Context Type
interface AppContextType {
  currentPage: string;
  setCurrentPage: Dispatch<React.SetStateAction<string>>;
  returnToPreviousPage: () => void;
  selectedId: string | null;
  setSelectedId: Dispatch<React.SetStateAction<string | null>>;
  selectedSecondaryId: string | null;
  setSelectedSecondaryId: Dispatch<React.SetStateAction<string | null>>;
  restrictions: { vegetarian: boolean; halal: boolean };
  setRestrictions: Dispatch<
    React.SetStateAction<{ vegetarian: boolean; halal: boolean }>
  >;
}

// Create Context Object
const AppContext = createContext<AppContextType | undefined>(undefined);

// Create Provider Componenet
const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // States to manage the current page
  // Current pages include: "home-page", "profile-page", "stall-page", "recipe-page", "review-page"
  const [currentPage, setCurrentPage] = useState("home-page");
  const [prevPage, setPrevPage] = useState({ prev: "", next: "home-page" });

  // State for selected ID (stall or review)
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [selectedSecondaryId, setSelectedSecondaryId] = useState<string | null>(
    null,
  );

  // State for dietary restrictions
  const [restrictions, setRestrictions] = useState({
    vegetarian: false,
    halal: false,
  });

  useEffect(() => {
    // Update previous page when currentPage changes
    if (currentPage === "profile-page") {
      // Reset to home-page when navigating to profile-page
      setPrevPage({ prev: "home-page", next: "profile-page" });
      return;
    } else {
      setPrevPage((prev) => ({ prev: prev.next, next: currentPage }));
    }
  }, [currentPage]);

  const returnToPreviousPage = () => {
    setCurrentPage(prevPage.prev);
  };

  // Function to fetch user dietary restrictions
  const { user } = useUser();
  useEffect(() => {
    const fetchUserDietaryRestrictions = async () => {
      if (!user) {
        setRestrictions({ vegetarian: false, halal: false });
        return;
      }
      const userId = await fetchUserByClerkId(user.id);
      const fetchedRestrictions = await fetchDietaryRestrictions(userId?.id!);
      if (fetchedRestrictions.length > 0) {
        const userRestrictions = fetchedRestrictions[0];
        setRestrictions({
          vegetarian:
            "vegetarian" in userRestrictions
              ? userRestrictions.vegetarian
              : false,
          halal: "halal" in userRestrictions ? userRestrictions.halal : false,
        });
      } else {
        setRestrictions({ vegetarian: false, halal: false });
      }
    };

    fetchUserDietaryRestrictions();
  }, [user, currentPage]);

  return (
    <AppContext.Provider
      value={{
        currentPage,
        setCurrentPage,
        returnToPreviousPage,
        selectedId,
        setSelectedId,
        selectedSecondaryId,
        setSelectedSecondaryId,
        restrictions,
        setRestrictions,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

// Create Custom Hook
const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext must be used within a AppProvider");
  }
  return context;
};

export { AppProvider, useAppContext };
export default AppProvider;
