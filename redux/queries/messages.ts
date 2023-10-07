import { messageType } from "./../../utils/types";
import { createApi } from "@reduxjs/toolkit/query/react";
import { axiosBaseQuery } from "../../utils/axios";
import ApiInstance from "../../utils/api";
import { MessagesEnum } from "../../utils/reduxEnums";

export const messagesApi = createApi({
  baseQuery: axiosBaseQuery(undefined, ApiInstance),
  endpoints: (builder) => ({
    getMessages: builder.query<any, any>({
      query: ({ userId, recepientId }) => ({
        url: `/messages/${userId}/${recepientId}`,
        method: "GET",
      }),

      providesTags: [{ type: MessagesEnum.MESSAGES as never }],
    }),
    // sendMessages: builder.mutation<messageType, any>({
    //   query: ({}) => ({}),
    // }),
  }),
});

messagesApi.enhanceEndpoints({
  addTagTypes: [...Object.values(MessagesEnum)],
});

export const { useGetMessagesQuery, useLazyGetMessagesQuery } = messagesApi;
