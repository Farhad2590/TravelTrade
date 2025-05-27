import { useQuery } from "@tanstack/react-query";
import axios from "axios"; // Import axios
import useAuth from "./useAuth";

const UseTraveler = () => {
  const { user } = useAuth();

  const { data: isTraveler, isPending: isTravelerLoading } = useQuery({
    queryKey: [user?.email, "isTraveler"],
    queryFn: async () => {
      const res = await axios.get(
        `http://localhost:9000/users/traveler/${user?.email}`
      );

      return res.data?.traveler;
    },
  });

  return [isTraveler, isTravelerLoading];
};

export default UseTraveler;
