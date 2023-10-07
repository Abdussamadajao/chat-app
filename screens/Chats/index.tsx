import { View, Text, ScrollView, Pressable, FlatList } from "react-native";
import React, { useEffect } from "react";
// import { useUserId } from "../../context/useContext";
import { useDispatch } from "react-redux";
import { acceptFriends } from "../../redux/slices/userSlice";
import { useAppSelector } from "../../redux/hooks";
import UserChats from "../../components/UserChats";

const Chats = () => {
  const dispatch = useDispatch();
  const { friends, requests, users, userId } = useAppSelector(
    (state) => state.users
  );
  useEffect(() => {
    dispatch(acceptFriends(userId));
  }, [userId]);

  console.log("friends", friends);

  console.log("req", users);

  return (
    <View>
      <Pressable>
        <FlatList
          data={friends}
          renderItem={({ item }) => <UserChats item={item} />}
          showsVerticalScrollIndicator
          keyExtractor={(item) => item}
        />
      </Pressable>
    </View>
  );
};

export default Chats;
