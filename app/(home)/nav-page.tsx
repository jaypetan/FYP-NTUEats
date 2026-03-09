// React and React Native core
import { useEffect, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";

// External libraries
import { useUser } from "@clerk/clerk-expo";

// App Context
import { useAppContext } from "@/app/components/AppContext";

// Components
import NavImage from "@/app/components/Nav/NavImage";
import SignOutButton from "@/app/components/SignOutButton";

// Utilities
import { fetchUserByClerkId } from "@/utils/userServices";

interface NavPageProps {
  closeDrawer: () => void;
}

export default function NavPage({ closeDrawer }: NavPageProps) {
  const appContext = useAppContext();

  // Navigation Button Component
  const NavDirectButton = (page: string, text: string) => {
    return (
      <TouchableOpacity
        onPress={() => {
          appContext.setCurrentPage(page);
          closeDrawer();
        }}
      >
        <Text className="font-koulen font-bold text-blue text-4xl pt-4">
          {text}
        </Text>
      </TouchableOpacity>
    );
  };

  // Check if user is admin
  const [isAdmin, setIsAdmin] = useState(false);
  const { user } = useUser();
  useEffect(() => {
    if (!user || !user.id) return; // Wait until user is loaded
    fetchUserByClerkId(user.id).then((data) => {
      setIsAdmin(data?.role === "admin");
      console.log(data?.role);
    });
  }, [user]);

  return (
    <View className="h-full w-full flex-col px-8 gap-2 pt-24">
      <NavImage />
      <Text className="font-ranchers text-2xl text-blue mb-4">
        Looking for What?
      </Text>

      {NavDirectButton("home-page", "Home")}
      {NavDirectButton("eat-what", "EatWHAT")}
      {NavDirectButton("cook-what", "CookWHAT")}
      {NavDirectButton("profile-page", "Profile")}
      {NavDirectButton("upload-recipe-page", "Upload Recipe")}
      {NavDirectButton("report-page", "Report")}
      {isAdmin && NavDirectButton("admin-page", "Admin Panel")}

      <SignOutButton />
    </View>
  );
}
