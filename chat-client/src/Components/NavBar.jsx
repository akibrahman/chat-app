import MenuIcon from "@mui/icons-material/Menu";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { useContext } from "react";
import { Link } from "react-router-dom";
import useUser from "../Hooks/useUser";
import { AuthContext } from "./AuthProvider";

export const NavBar = () => {
  const { user: DBuser } = useUser();
  const { user, logout, conversationOpen, setConversationOpen } =
    useContext(AuthContext);
  // const data = useUser();
  // console.log(data);
  const logoutUser = async () => {
    const res = await logout();
    console.log(res);
  };
  return (
    <Box sx={{ flexGrow: 1, backgroundColor: "#333333" }}>
      <AppBar position="static" sx={{ backgroundColor: "#333333" }}>
        <Toolbar>
          <IconButton
            onClick={() => setConversationOpen(!conversationOpen)}
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Link to="/">
            <Typography
              variant="h6"
              sx={{ marginRight: "20px", flexGrow: 0 }}
              component="div"
            >
              Home
            </Typography>
          </Link>
          <Typography
            variant="h6"
            component="div"
            sx={{ flexGrow: 1, color: "#1976D2" }}
          >
            {DBuser?.name}
          </Typography>
          <Link to="/chat">
            <Button color="inherit">Chat</Button>
          </Link>
          {user ? (
            <Button onClick={logoutUser} color="inherit">
              Logout
            </Button>
          ) : (
            <Link to="/login">
              <Button color="inherit">Login</Button>
            </Link>
          )}
        </Toolbar>
      </AppBar>
    </Box>
  );
};
