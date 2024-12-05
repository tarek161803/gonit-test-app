import { useSelector } from "react-redux";

const useGetUserRole = () => {
  const { user } = useSelector((state) => state.auth);
  const UserRole = user?.user.role;
  return UserRole;
};

export default useGetUserRole;
