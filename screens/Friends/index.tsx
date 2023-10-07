import { View, Text } from "react-native";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { fetchFriendReq } from "../../redux/slices/userSlice";
import { useAppSelector } from "../../redux/hooks";
import FriendRequests from "../../components/FriendRequests";

const Friends = () => {
  const dispatch = useDispatch();
  const { requests } = useAppSelector((state) => state.users);
  useEffect(() => {
    dispatch(fetchFriendReq());
  }, []);

  if (requests?.length === 0) {
    return (
      <View className='items-center justify-center my-auto'>
        <Text className='text-2xl font-bold'>No Friend Request</Text>
      </View>
    );
  }

  console.log("req", requests);

  return (
    <View className='px-3 py-4 my-[12px]'>
      {requests?.length > 0 && <Text>Your Friend Requests</Text>}
      {requests?.map((request: any) => (
        <FriendRequests key={request.id} request={request} />
      ))}
    </View>
  );
};

export default Friends;
