export interface FormValues {
  name: string;
  email: string;
  password: string;
  isCheck?: boolean;
  image: any;
}

export type UserType = {
  _id: string;
  name: string;
  email: string;
  image: string;
  friends: Friends[];
  friendRequests: FriendRequest[];
  sentFriendRequests: any;
};

export interface Friends {}

export interface FriendRequest {
  userId: string;
  selectedUserId: string;
}

export type messageType = "image" | "text";