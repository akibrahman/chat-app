import { Container } from "@mui/material";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { AuthContext } from "./AuthProvider";

const LoginForm = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      await login(username, password);
      navigate("/");
      toast.success("Login Successfull");
    } catch (error) {
      console.log(error);
      if (error.code == "auth/invalid-credential") {
        toast.error("Wrong Username or Password");
      } else {
        toast.error("Invalid Input");
      }
    }
  };

  return (
    <div className="mt-10">
      <Container maxWidth="sm">
        <p className="text-4xl mb-4">Login From</p>
        <form>
          <TextField
            label="Username"
            variant="outlined"
            fullWidth
            margin="normal"
            value={username}
            InputProps={{
              style: { color: "white" },
            }}
            InputLabelProps={{
              style: { color: "white" },
            }}
            onChange={(e) => setUsername(e.target.value)}
          />
          <TextField
            label="Password"
            type="password"
            variant="outlined"
            fullWidth
            InputProps={{
              style: { color: "white" },
            }}
            InputLabelProps={{
              style: { color: "white" },
            }}
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <div className="flex items-center justify-between">
            <Button variant="contained" color="primary" onClick={handleLogin}>
              Login
            </Button>
            <Link to="/registration">
              <p className="font-semibold">Or, Register</p>
            </Link>
          </div>
        </form>
      </Container>
    </div>
  );
};

export default LoginForm;
