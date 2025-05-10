import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import useAuth from "./useAuth";

const UseSender = () => {
  const { user } = useAuth();

  const { data: isSender, isPending: isSenderLoading } = useQuery({
    queryKey: [user?.email, "isSender"],
    queryFn: async () => {
      const res = await axios.get(
        `http://localhost:9000/users/sender/${user?.email}`
      );

      return res.data?.sender;
    },
  });

  return [isSender, isSenderLoading];
};

export default UseSender;