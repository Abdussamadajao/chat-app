import { View, Text } from "react-native";
import React, { useContext, useEffect, useLayoutEffect, useState } from "react";
import { StackNavigation } from "../../components/Layout";
import { useNavigation } from "@react-navigation/native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useAppSelector } from "../../redux/hooks";
import { useDispatch } from "react-redux";
import { fetchUsers } from "../../redux/slices/userSlice";
import AsyncStorage from "@react-native-async-storage/async-storage";
import jwt_decode from "jwt-decode";
import User from "../../components/User";
import { UserType } from "../../utils/types";
import { logOutProvider } from "../../redux/slices/authSlice";
import { UserContext, UserState } from "../../context/useContext";
// import { useUserId } from "../../context/useContext";

const Home = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation<StackNavigation>();
  const { users, isRequestSent, userId } = useAppSelector(
    (state) => state.users
  );

  useEffect(() => {
    dispatch(fetchUsers(userId));
  }, []);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: "",
      headerLeft: () => (
        <Text
          onPress={() => dispatch(logOutProvider())}
          className='text-lg font-semibold'>
          Swift Chat
        </Text>
      ),
      headerRight: () => (
        <View className='flex-row gap-[10px] items-center'>
          <Ionicons
            onPress={() => navigation.navigate("Chats")}
            name='chatbox-ellipses-outline'
            size={34}
            color={"black"}
          />
          <MaterialIcons
            onPress={() => navigation.navigate("Friends")}
            name='people-outline'
            size={34}
            color={"black"}
          />
        </View>
      ),
    });
  }, []);
  return (
    <View>
      <View>
        {users?.map((user: UserType) => (
          <User userId={userId} user={user} key={user._id} />
        ))}
      </View>
    </View>
  );
};

export default Home;
