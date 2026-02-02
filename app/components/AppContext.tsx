import React, {
  Dispatch,
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

// Define the Context Type
interface AppContextType {
  currentPage: string;
  setCurrentPage: Dispatch<React.SetStateAction<string>>;
  returnToPreviousPage: () => void;
  selectedId: string | null;
  setSelectedId: Dispatch<React.SetStateAction<string | null>>;
}

// Create Context Object
const AppContext = createContext<AppContextType | undefined>(undefined);

// Create Provider Componenet
const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // States to manage the current page
  const [currentPage, setCurrentPage] = useState("home-page");
  const [prevPage, setPrevPage] = useState({ prev: "", next: "home-page" });

  // State for selected ID (stall or review)
  const [selectedId, setSelectedId] = useState<string | null>(null);

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

  return (
    <AppContext.Provider
      value={{
        currentPage,
        setCurrentPage,
        returnToPreviousPage,
        selectedId,
        setSelectedId,
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
