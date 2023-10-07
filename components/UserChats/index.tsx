import { View, Text, Pressable, Image } from "react-native";
import React, { useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import { StackNavigation } from "../Layout";
import { useAppSelector } from "../../redux/hooks";
import {
  useGetMessagesQuery,
  useLazyGetMessagesQuery,
} from "../../redux/queries/messages";

type Props = {
  item: any;
};

const UserChats = ({ item: { image, name, email, _id } }: Props) => {
  const { userId } = useAppSelector((state) => state.users);
  const navigation = useNavigation<StackNavigation | any>();
  const { data, isLoading, error, refetch } = useGetMessagesQuery({
    userId,
    recepientId: _id,
  });
  const [refetchRequest, { isLoading: isRefetchLoading }] =
    useLazyGetMessagesQuery();

  useEffect(() => {
    refetchRequest({ userId, recepientId: _id });
  }, []);

  let messages = data || [];

  const getLastMessage = () => {
    const userMessages = messages.filter(
      (message: any) => message.messageType === "text"
    );

    const n = userMessages.length;

    return userMessages[n - 1];
  };
  const lastMessage = getLastMessage();
  console.log("kk", lastMessage);
  const formatTime = (time: any) => {
    const options: any = { hour: "numeric", minute: "numeric" };
    return new Date(time).toLocaleString("en-US", options);
  };
  if (error) {
    return (
      <View>
        <Text>hello</Text>
      </View>
    );
  }
  return (
    <Pressable
      onPress={() =>
        navigation.navigate("Messages", {
          recepientId: _id,
        })
      }
      className='flex-row items-center gap-2 px-3 py-4 border-b border-gray-300'>
      <Image
        source={{ uri: image }}
        className='object-cover rounded-full h-14 w-14'
      />

      <View className='flex-1'>
        <Text className='text-base font-medium text-primaryDark'>{name}</Text>
        <Text className='mt-1 text-sm font-medium text-medical'>
          {lastMessage && (
            <Text style={{ marginTop: 3, color: "gray", fontWeight: "500" }}>
              {lastMessage?.message}
            </Text>
          )}
        </Text>
      </View>
      <View>
        <Text className='text-sm font-normal text-primaryDark'>
          {lastMessage && formatTime(lastMessage?.timeStamp)}
        </Text>
      </View>
    </Pressable>
  );
};

export default UserChats;
