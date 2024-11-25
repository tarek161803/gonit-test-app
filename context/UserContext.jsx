import { createContext, useState } from "react";

export const UserContext = createContext(null);

const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [question, setQuestion] = useState(null);
  const [totalPages, setTotalPages] = useState(0);

  return (
    <UserContext.Provider value={{ user, setUser, question, setQuestion, totalPages, setTotalPages }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserProvider;
