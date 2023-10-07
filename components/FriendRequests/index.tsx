import { View, Text, Pressable, Image } from "react-native";
import React, { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import jwt_decode from "jwt-decode";
import ApiInstance from "../../utils/api";
import { setFriendRequest } from "../../redux/slices/userSlice";
import { useAppSelector } from "../../redux/hooks";
import { useNavigation } from "@react-navigation/native";
import { StackNavigation } from "../Layout";

type Props = {
  request: any;
};
const FriendRequests = ({ request: { images, name, id } }: Props) => {
  const navigation = useNavigation<StackNavigation>();
  const { requests, friends } = useAppSelector((state) => state.users);
  const [userId, setUserId] = useState<string>("");
  useEffect(() => {
    const handleToken = async () => {
      const token = (await AsyncStorage.getItem("authToken")) as any;
      const decodedToken: any = jwt_decode(token);
      let userId = decodedToken.userId;
      setUserId(userId);
    };
    handleToken();
  }, []);
  console.log(requests);
  console.log("id", id);

  const accpetRequest = async (friendRequestId: string) => {
    try {
      const res = await ApiInstance.post("/friend-request/accept", {
        senderId: friendRequestId,
        recepientId: userId,
      });

      if (res.status === 200) {
        setFriendRequest(
          requests.filter((request: any) => request._id !== friendRequestId)
        );
        navigation.navigate("Chats");
      }
    } catch (error) {
      console.log("something went wrong", error);
    }
  };

  return (
    <Pressable className='flex-row items-center justify-between w-full my-4'>
      <Image
        source={{ uri: images }}
        className='object-cover rounded-full h-14 w-14'
      />

      <Text className='flex-1 mx-2 text-base font-bold'>
        {name} sent you a friend request
      </Text>

      <Pressable
        onPress={() => {
          accpetRequest(id);
        }}
        className='bg-blue-600 p-[10px] rounded-lg w-28 justify-center items-center'>
        <Text className='text-base font-semibold text-white'>Accept</Text>
      </Pressable>
    </Pressable>
  );
};

export default FriendRequests;
