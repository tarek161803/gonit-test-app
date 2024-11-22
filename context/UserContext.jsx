import { createContext, useState } from "react";

export const UserContext = createContext(null);

const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [question, setQuestion] = useState(null);

  return <UserContext.Provider value={{ user, setUser, question, setQuestion }}>{children}</UserContext.Provider>;
};

export default UserProvider;
