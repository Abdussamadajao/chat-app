import { View, Text } from "react-native";
import React from "react";
import {
  NavigationContainer,
  NavigationProp,
  useNavigation,
} from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Login from "../../screens/Login";
import Register from "../../screens/Register";
import { useAppSelector } from "../../redux/hooks";
import Home from "../../screens/Home";
import Friends from "../../screens/Friends";

import Chats from "../../screens/Chats";
import Messages from "../../screens/Messages";

export type ScreenNames = [
  "Home",
  "Friends",
  "Chats",
  "Login",
  "Register",
  "Messages"
]; // type these manually
export type RootStackParamList = Record<ScreenNames[number], undefined>;
export type StackNavigation = NavigationProp<RootStackParamList>;

const Stack = createNativeStackNavigator<RootStackParamList>();

const AuthStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name='Login' component={Login} />
      <Stack.Screen name='Register' component={Register} />
    </Stack.Navigator>
  );
};

const ScreenStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: true }}>
      <Stack.Screen name='Home' component={Home} />
      <Stack.Screen name='Friends' component={Friends} />
      <Stack.Screen name='Chats' component={Chats} />
      <Stack.Screen name='Messages' component={Messages} />
    </Stack.Navigator>
  );
};

const Layout = () => {
  const { isLoggedIn } = useAppSelector((state) => state.auth);

  return (
    <NavigationContainer>
      {!isLoggedIn ? <AuthStack /> : <ScreenStack />}
    </NavigationContainer>
  );
};

export default Layout;
