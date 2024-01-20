import { useQuery } from "@tanstack/react-query";
import useAxios from "../Hooks/useAxios";

const Conversation = ({ data, currentUserId, online }) => {
  const axiosInstance = useAxios();
  const receiverId = data.members.find((id) => id != currentUserId);
  const { data: userData } = useQuery({
    queryKey: ["receiver", receiverId],
    queryFn: async ({ queryKey }) => {
      const data = await axiosInstance.get(`/get-userr/${queryKey[1]}`);
      return data.data;
    },
  });
  if (!userData) return <p>Loading......</p>;
  return (
    <>
      <div className="relative flex justify-between items-center p-4 hover:bg-[#80808038] cursor-pointer text-white">
        <div className="relative flex flex-col items-center gap-1 md:flex-row md:gap-4">
          {online ? (
            <div className="bg-green-400 rounded-full absolute top-0 left-0 w-4 h-4"></div>
          ) : (
            <div className="bg-orange-500 rounded-full absolute top-0 left-0 w-4 h-4"></div>
          )}
          <img
            className="w-12 h-12 rounded-full"
            src={userData?.profilePicture}
            alt=""
          />
          <div className="text-sm flex flex-col">
            <span className="font-semibold text-xs md:text-base">
              {userData.name}
            </span>
            <span className="font-semibold text-xs">
              {online ? "Online" : "Offline"}
            </span>
          </div>
        </div>
      </div>
    </>
  );
};

export default Conversation;
