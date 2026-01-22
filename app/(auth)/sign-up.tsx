// React and React Native core imports
import * as React from "react";
import { Alert, Text, TextInput, TouchableOpacity, View } from "react-native";

// External libraries
import { useSignUp } from "@clerk/clerk-expo";
import { Link, useRouter } from "expo-router";

// Project components
import InputField from "@/app/components/InputField";

export default function SignUpScreen() {
  const { isLoaded, signUp, setActive } = useSignUp();
  const router = useRouter();

  const [formData, setFormData] = React.useState({
    username: "",
    emailAddress: "",
    password: "",
    confirmPassword: "",
  });
  // TODO: use when connect to backend

  const [pendingVerification, setPendingVerification] = React.useState(false);
  const [code, setCode] = React.useState("");

  // Handle submission of sign-up form
  const onSignUpPress = async () => {
    if (!isLoaded) return;
    // Ensure the passwords match
    if (formData.password !== formData.confirmPassword) {
      Alert.alert("Passwords do not match");
      return;
    }

    // Start sign-up process using email and password provided
    try {
      await signUp.create({
        emailAddress: formData.emailAddress,
        username: formData.username,
        password: formData.password,
      });

      // Send user an email with verification code
      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });

      // Set 'pendingVerification' to true to display second form
      // and capture OTP code
      setPendingVerification(true);
    } catch (err) {
      // See https://clerk.com/docs/custom-flows/error-handling
      // for more info on error handling
      console.error(JSON.stringify(err, null, 2));
      Alert.alert((err as any).errors[0].message);
    }
  };

  // Handle submission of verification form
  const onVerifyPress = async () => {
    if (!isLoaded) return;

    try {
      // Use the code the user provided to attempt verification
      const signUpAttempt = await signUp.attemptEmailAddressVerification({
        code,
      });

      // If verification was completed, set the session to active
      // and redirect the user
      if (signUpAttempt.status === "complete") {
        await setActive({ session: signUpAttempt.createdSessionId });
        router.replace("/");
      } else {
        // If the status is not complete, check why. User may need to
        // complete further steps.
        console.error(JSON.stringify(signUpAttempt, null, 2));
      }
    } catch (err) {
      // See https://clerk.com/docs/custom-flows/error-handling
      // for more info on error handling
      console.error(JSON.stringify(err, null, 2));
    }
  };

  // To get out of verfication page
  const cancelVerification = () => {
    Alert.alert("Canceling verification", "Are you sure?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Yes",
        onPress: () => {
          setPendingVerification(false);
          router.push("/sign-up");
        },
      },
    ]);
  };

  // Verification Page
  if (pendingVerification) {
    return (
      <View className="flex-col gap-4 items-center justify-center px-8 h-full bg-cream text-blue">
        <Text className="text-blue text-3xl font-semibold text-center">
          Enter verification code
        </Text>
        <Text className="text-blue text-base font-semibold text-center">
          An email has been sent to {formData.emailAddress}
        </Text>
        <TextInput
          className="text-blue text-lg font-semibold border-2 border-blue leading-5 p-3 rounded-full w-72 text-center"
          value={code}
          placeholder="XXX XXX"
          onChangeText={(code) => setCode(code)}
        />
        <View className="w-72 flex-row justify-between items-center mt-4">
          <TouchableOpacity onPress={() => cancelVerification()}>
            <Text className="text-blue text-lg font-semibold text-center py-2 bg-red rounded-full w-28">
              Back
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={onVerifyPress}>
            <Text className="text-blue text-lg font-semibold border-2 border-blue text-center p-2 rounded-full w-40">
              Verify
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  // Sign Up Page
  return (
    <View className="flex-col items-center justify-center px-8 h-full bg-cream text-blue">
      <Text className="text-blue text-3xl text-left w-80 font-semibold">
        Create an account
      </Text>
      <View className="flex-row gap-2 text-left w-80">
        <Text>Already have an account?</Text>
        <Link href="/sign-in">
          <Text className="text-blue font-bold underline">Sign in</Text>
        </Link>
      </View>
      <View className="flex-col gap-4 text-left w-80 mt-4">
        <InputField
          label="Username"
          value={formData.username}
          placeholder="John Doe"
          onChangeText={(text) => setFormData({ ...formData, username: text })}
        />
        <InputField
          label="Email"
          value={formData.emailAddress}
          placeholder="example@email.com"
          onChangeText={(text) =>
            setFormData({ ...formData, emailAddress: text })
          }
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <InputField
          label="Password"
          value={formData.password}
          placeholder="password"
          secureTextEntry={true}
          autoComplete="password-new"
          onChangeText={(text) => setFormData({ ...formData, password: text })}
        />
        <InputField
          label="Confirm Password"
          value={formData.confirmPassword}
          placeholder="confirmed password"
          secureTextEntry={true}
          autoComplete="password-new"
          onChangeText={(text) =>
            setFormData({ ...formData, confirmPassword: text })
          }
        />
      </View>
      <View className="w-80 flex-row justify-end items-center mt-8">
        <TouchableOpacity onPress={onSignUpPress}>
          <Text className="text-blue text-lg font-semibold border-2 border-blue text-center p-2 rounded-full w-40">
            Sign Up
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
