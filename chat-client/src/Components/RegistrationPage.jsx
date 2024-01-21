import { Container, Input } from "@mui/material";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import axios from "axios";
import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "./AuthProvider";

const RegistrationForm = () => {
  const { registration, UpdateProfile, authReloader, setAuthReloader } =
    useContext(AuthContext);
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);

  const handleRegistration = async () => {
    try {
      const imgData = new FormData();
      imgData.append("image", selectedFile);
      const res = await axios.post(
        "https://api.imgbb.com/1/upload?key=f8c09563e2c3334b8e3c08a6de7d30df",
        imgData
      );
      await registration(email, password);
      await UpdateProfile(username, res.data.data.display_url);
      setAuthReloader(!authReloader);
      // const userData = {
      //   name: username,
      //   profilePicture: res.data.data.display_url,
      //   email: email,
      // };
      // await axios.put(`http://localhost:5000/all-users/${email}`, userData);
      navigate("/");
    } catch (error) {
      console.log(error);
    }
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
  };

  return (
    <div className="mt-10">
      <Container maxWidth="sm">
        <p className="text-4xl mb-4">Registration From</p>
        <form>
          <TextField
            label="Name"
            variant="outlined"
            fullWidth
            InputProps={{
              style: { color: "white" },
            }}
            InputLabelProps={{
              style: { color: "white" },
            }}
            margin="normal"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <TextField
            label="E-mail"
            variant="outlined"
            fullWidth
            InputProps={{
              style: { color: "white" },
            }}
            InputLabelProps={{
              style: { color: "white" },
            }}
            margin="normal"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <div>
            <Input
              accept="image/*" // Set the accepted file types (optional)
              id="file-input"
              type="file"
              style={{ display: "none" }}
              onChange={handleFileChange}
              inputProps={{ "aria-label": "upload file" }}
            />
            <label htmlFor="file-input" className="flex items-center gap-4">
              <Button variant="contained" component="span" className={""}>
                Choose File
              </Button>
              <p>Profile Picture</p>
            </label>
            {selectedFile && (
              <div>
                <p>Selected File: {selectedFile.name}</p>
              </div>
            )}
          </div>

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
            <Button
              variant="contained"
              color="primary"
              onClick={handleRegistration}
            >
              Register
            </Button>
            <Link to="/login">
              <p className="font-semibold">Or, Login</p>
            </Link>
          </div>
        </form>
      </Container>
    </div>
  );
};

export default RegistrationForm;
