import React, { useContext } from "react";

export const UserContext = React.createContext(null);

export function useUser() {
  return useContext(UserContext);
}
