import { View, Text, TouchableOpacity } from "react-native";
import React, { useEffect } from "react";
import { FriendRequest, UserType } from "../../utils/types";
import { Pressable } from "react-native";
import { Image } from "react-native";
import { useDispatch } from "react-redux";
import {
  fetchUserFriends,
  getAllFriendRequests,
  sendFriendRequests,
} from "../../redux/slices/userSlice";
import { useAppSelector } from "../../redux/hooks";

type Props = {
  user: UserType;
  userId: string;
};

const User = ({
  user: { email, image, name, _id, friendRequests },
  userId,
}: Props) => {
  const dispatch = useDispatch();
  const { users, isRequestSent, userFriends, sentRequests } = useAppSelector(
    (state) => state.users
  );
  const sendFriendRequest = (currentUserId: string, selectedUserId: string) => {
    dispatch(sendFriendRequests(currentUserId, selectedUserId));
  };

  useEffect(() => {
    dispatch(getAllFriendRequests(userId));
    dispatch(fetchUserFriends(userId));
  }, []);

  console.log("userF", userFriends);
  console.log("friend requests sent ", sentRequests);

  let friends = userFriends.includes(_id) || [];

  return (
    <Pressable className='flex-row items-center py-[10px] px-2'>
      <View>
        <Image
          source={{ uri: image }}
          className='object-cover rounded-full h-14 w-14'
        />
      </View>

      <View className='flex-1 ml-[9px]'>
        <Text className='text-lg font-bold'>{name}</Text>
        <Text className='text-base font-light'>{email}</Text>
      </View>

      {friends ? (
        <View
          style={{
            backgroundColor: "#82CD47",
            padding: 10,
            width: 105,
            borderRadius: 6,
          }}>
          <Text style={{ textAlign: "center", color: "white" }}>Friends</Text>
        </View>
      ) : isRequestSent ||
        sentRequests.some((friend: any) => friend._id === _id) ? (
        <View
          style={{
            backgroundColor: "gray",
            padding: 10,
            width: 105,
            borderRadius: 6,
          }}>
          <Text style={{ textAlign: "center", color: "white", fontSize: 13 }}>
            Request Sent
          </Text>
        </View>
      ) : (
        <TouchableOpacity
          onPress={() => {
            sendFriendRequest(userId, _id);
          }}
          className='items-center justify-center bg-primary rounded-lg px-[10px] w-[105px] h-12'>
          <Text className='text-base font-semibold text-white'>Add Friend</Text>
        </TouchableOpacity>
      )}
    </Pressable>
  );
};

export default User;
