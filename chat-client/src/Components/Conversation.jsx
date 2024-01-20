import { useEffect, useState } from "react";
import useAxios from "../Hooks/useAxios";

const Conversation = ({ data, currentUserId, online }) => {
  const axiosInstance = useAxios();
  const [userData, setUserData] = useState(null);
  useEffect(() => {
    const getUserData = async () => {
      try {
        const userId = data.members.find((id) => id != currentUserId);
        const tempUserData = await axiosInstance.get(`/get-userr/${userId}`);
        setUserData(tempUserData.data);
      } catch (error) {
        console.log(error);
      }
    };
    getUserData();
  }, [currentUserId, data, axiosInstance]);
  if (!userData) return <p>Loading......</p>;
  return (
    <>
      <div className="relative flex justify-between items-center p-2 hover:bg-[#80808038] cursor-pointer text-white">
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
      {/* </div> */}
      <hr />
    </>
  );
};

export default Conversation;
