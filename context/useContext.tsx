import { createContext, useState } from "react";

export const UserState = createContext(
  {} as {
    userId: string | any;
    setUserId: any;
  }
);

export const UserContext = ({ children }: { children: React.ReactNode }) => {
  const [userId, setUserId] = useState();

  return (
    <UserState.Provider value={{ userId, setUserId }}>
      {children}
    </UserState.Provider>
  );
};
