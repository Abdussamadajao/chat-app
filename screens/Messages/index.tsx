import {
  View,
  Text,
  KeyboardAvoidingView,
  ScrollView,
  TextInput,
  Pressable,
  Image,
  RefreshControl,
  ActivityIndicator,
} from "react-native";
import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import {
  Entypo,
  Feather,
  FontAwesome,
  Ionicons,
  MaterialIcons,
} from "@expo/vector-icons";
import EmojiSelector from "react-native-emoji-selector";
import { useNavigation, useRoute } from "@react-navigation/native";
import ApiInstance from "../../utils/api";
import { StackNavigation } from "../../components/Layout";
import * as ImagePicker from "expo-image-picker";
import { useDispatch } from "react-redux";
// import { fetchMessages } from "../../redux/slices/messgesSlice";
import { useAppSelector } from "../../redux/hooks";
import {
  useGetMessagesQuery,
  useLazyGetMessagesQuery,
} from "../../redux/queries/messages";

const Messages = () => {
  const route = useRoute();
  const dispatch = useDispatch();
  const { recepientId } = route.params as any;
  const { userId } = useAppSelector((state) => state.users);
  const [refreshing, setRefreshing] = useState(false);
  const navigation = useNavigation<StackNavigation | any>();
  const [showEmojiSelector, setShowEmojiSelector] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");
  const [selectedImage, setSelectedImage] = useState<string>("");
  const [recepientData, setRecepientData] = useState<any>();
  const [selectedMessages, setSelectedMessages] = useState<any>([]);

  const scrollViewRef = useRef<any>(null);

  useEffect(() => {
    scrollToBottom();
  }, []);

  const scrollToBottom = () => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollToEnd({ animated: false });
    }
  };

  const handleContentSizeChange = () => {
    scrollToBottom();
  };

  const handleEmojiPress = () => {
    setShowEmojiSelector(!showEmojiSelector);
  };

  const { data, isLoading, error, refetch } = useGetMessagesQuery({
    userId,
    recepientId,
  });
  const [refetchRequest, { isLoading: isRefetchLoading }] =
    useLazyGetMessagesQuery();

  useEffect(() => {
    const fetchRecepientData = async () => {
      try {
        const response = await fetch(
          `https://chat-app-api-hag4.onrender.com/user/${recepientId}`
        );

        const data = await response.json();
        setRecepientData(data);
      } catch (error) {
        console.log("error retrieving details", error);
      }
    };

    fetchRecepientData();
    refetchRequest({ userId, recepientId });
  }, []);

  const handleSend = async (messageType: any, imageUri?: any) => {
    try {
      const formData = new FormData() as any;
      formData.append("senderId", userId);
      formData.append("recepientId", recepientId);

      //if the message type id image or a normal text
      if (messageType === "image") {
        formData.append("messageType", "image");
        formData.append("imageFile", {
          uri: imageUri,
          name: "image.jpg",
          type: "image/jpeg",
        });
      } else {
        formData.append("messageType", "text");
        formData.append("messageText", message);
      }
      const response = await fetch(
        "https://chat-app-api-hag4.onrender.com/messages",
        {
          method: "POST",
          body: formData,
        }
      );

      // const res = await ApiInstance.post("/messages", formData);

      if (response.status === 200) {
        setMessage("");
        setSelectedImage("");
        refetchRequest({ userId, recepientId });
      }
    } catch (error) {
      console.log("error in sending the message", error);
    }
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: "",
      headerLeft: () => (
        <View className='flex-row items-center gap-3'>
          <Ionicons
            onPress={() => navigation.goBack()}
            name='arrow-back'
            size={24}
            color='black'
          />

          {selectedMessages.length > 0 ? (
            <View>
              <Text className='text-base font-medium text-primaryDark'>
                {selectedMessages.length}
              </Text>
            </View>
          ) : (
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Image
                source={{ uri: recepientData?.image }}
                className='w-[30px] h-[30px] rounded-full object-cover'
              />

              <Text className='ml-[5px] text-base font-bold'>
                {recepientData?.name}
              </Text>
            </View>
          )}
        </View>
      ),
      headerRight: () =>
        selectedMessages.length > 0 ? (
          <View className='flex-row items-center gap-[10px]'>
            <Ionicons name='md-arrow-redo-sharp' size={24} color='black' />
            <Ionicons name='md-arrow-undo' size={24} color='black' />
            <FontAwesome name='star' size={24} color='black' />
            <MaterialIcons
              onPress={() => deleteMessages(selectedMessages)}
              name='delete'
              size={24}
              color='black'
            />
          </View>
        ) : null,
    });
  }, [recepientData, selectedMessages]);

  const formatTime = (time: any) => {
    const options: any = { hour: "numeric", minute: "numeric" };
    return new Date(time).toLocaleString("en-US", options);
  };

  const pickImage = async () => {
    let result: any = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    console.log(result);
    if (!result.canceled) {
      handleSend("image", result.uri);
    }
  };
  const handleSelectMessage = (message: any) => {
    //check if the message is already selected
    const isSelected = selectedMessages.includes(message._id);

    if (isSelected) {
      setSelectedMessages((previousMessages: any) =>
        previousMessages.filter((id: any) => id !== message._id)
      );
    } else {
      setSelectedMessages((previousMessages: any) => [
        ...previousMessages,
        message._id,
      ]);
    }
  };
  const deleteMessages = async (messageIds: any) => {
    try {
      const response = await fetch(
        "https://chat-app-api-hag4.onrender.com/deleteMessages",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ messages: messageIds }),
        }
      );

      console.log("deleted", response);

      if (response.ok) {
        setSelectedMessages((prevSelectedMessages: any) =>
          prevSelectedMessages.filter((id: any) => !messageIds.includes(id))
        );
        refetchRequest({ userId, recepientId });
      } else {
        console.log("error deleting messages", response.status);
      }
    } catch (error) {
      console.log("error deleting messages", error);
    }
  };

  console.log("selected", selectedMessages);

  return (
    <KeyboardAvoidingView className='flex-1 bg-white'>
      <ScrollView
        ref={scrollViewRef}
        contentContainerStyle={{ flexGrow: 1 }}
        onContentSizeChange={handleContentSizeChange}>
        {data?.map((message: any, index: any) => {
          if (message.messageType === "text") {
            const isSelected = selectedMessages.includes(message._id);
            return (
              <Pressable
                onLongPress={() => handleSelectMessage(message)}
                key={index}
                className={`max-w-[237px] ${
                  message?.senderId?._id === userId
                    ? "bg-primary self-end rounded-tl-md rounded-bl-md rounded-br-md m-2 p-2"
                    : "bg-[#E8F3F1] self-start m-2 p-2 rounded-bl-md rounded-tr-md rounded-br-md"
                } `}>
                <Text
                  className={`text-[16px] ${
                    message?.senderId?._id === userId
                      ? "text-white"
                      : "text-[#555]"
                  } `}
                  style={{
                    textAlign: isSelected ? "right" : "left",
                  }}>
                  {message?.message}
                </Text>
                <Text
                  className={`text-[9px] text-right mt-1  ${
                    message?.senderId?._id === userId
                      ? "text-white"
                      : "text-[#555]"
                  } `}>
                  {formatTime(message.timeStamp)}
                </Text>
              </Pressable>
            );
          }

          if (message.messageType === "image") {
            const baseUrl =
              "/Users/sujananand/Build/messenger-project/api/files/";
            const imageUrl = message.imageUrl;
            const filename = imageUrl.split("/").pop();
            const source = { uri: baseUrl + filename };
            return (
              <Pressable
                key={index}
                style={[
                  message?.senderId?._id === userId
                    ? {
                        alignSelf: "flex-end",
                        backgroundColor: "#DCF8C6",
                        padding: 8,
                        maxWidth: "60%",
                        borderRadius: 7,
                        margin: 10,
                      }
                    : {
                        alignSelf: "flex-start",
                        backgroundColor: "white",
                        padding: 8,
                        margin: 10,
                        borderRadius: 7,
                        maxWidth: "60%",
                      },
                ]}>
                <View>
                  <Image
                    source={source}
                    style={{ width: 200, height: 200, borderRadius: 7 }}
                  />
                  <Text
                    style={{
                      textAlign: "right",
                      fontSize: 9,
                      position: "absolute",
                      right: 10,
                      bottom: 7,
                      color: "white",
                      marginTop: 5,
                    }}>
                    {formatTime(message?.timeStamp)}
                  </Text>
                </View>
              </Pressable>
            );
          }
        })}
      </ScrollView>

      <View
        className={`flex-row items-center p-[10px] border-t border-gray-300 ${
          showEmojiSelector ? "mb-0" : "mb-[15px]"
        }`}>
        <Entypo
          onPress={() => {
            handleEmojiPress();
          }}
          name='emoji-happy'
          size={27}
          color={"gray"}
        />
        <TextInput
          value={message}
          onChangeText={(text) => setMessage(text)}
          className='border border-gray-300 h-[40px] flex-1 p-[10px] rounded-full ml-2'
          placeholder='Enter message'
        />
        <View className='flex-row items-center gap-[7px] mx-[8px]'>
          <Entypo name='camera' onPress={pickImage} size={24} color={"gray"} />
          <Feather name='mic' size={24} color={"gray"} />
        </View>

        <Pressable
          onPress={() => handleSend("text")}
          className='items-center justify-center px-4 py-2 ml-2 rounded-full bg-primary'>
          <Feather name='send' size={24} color='white' />
        </Pressable>
      </View>
      {showEmojiSelector && (
        <EmojiSelector
          // style={{ height: 250 }}
          onEmojiSelected={(emoji) =>
            setMessage((prevMessage) => prevMessage + emoji)
          }
        />
      )}
    </KeyboardAvoidingView>
  );
};

export default Messages;
