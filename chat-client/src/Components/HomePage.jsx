import { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "./AuthProvider";

const HomePage = () => {
  const { user } = useContext(AuthContext);
  return (
    <div className="w-full min-h-[calc(100vh-64px)] flex flex-col items-center justify-center gap-6">
      <p className="text-3xl">Welcome to my Chatting App</p>
      {user ? (
        <Link to="/chat">
          <button className="bg-primary px-8 py-3 rounded-md font-semibold text-lg text-white duration-300 active:scale-90">
            Chat
          </button>
        </Link>
      ) : (
        <Link to="/login">
          <button className="bg-primary px-8 py-3 rounded-md font-semibold text-lg text-white duration-300 active:scale-90">
            Login
          </button>
        </Link>
      )}
    </div>
  );
};

export default HomePage;
