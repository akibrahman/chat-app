import Container from "@mui/material/Container";
import Link from "@mui/material/Link";
import Typography from "@mui/material/Typography";
// import { makeStyles } from "@mui/styles";

// const useStyles = makeStyles((theme) => ({
//   footer: {
//     backgroundColor: theme.palette.background.paper,
//     padding: theme.spacing(6),
//     marginTop: "auto",
//   },
// }));

const Footer = () => {
  //   const classes = useStyles();
  //   const theme = useTheme();

  return (
    <footer>
      <Container
        sx={{ backgroundColor: "#333333", color: "#fff", paddingY: "50px" }}
        maxWidth="xl"
      >
        <Typography variant="h6" align="center" gutterBottom>
          Your Website Name
        </Typography>
        <Typography
          variant="subtitle1"
          align="center"
          color="#fff"
          component="p"
        >
          © {new Date().getFullYear()} Your Company Name
        </Typography>
        <Typography variant="body2" color="#fff" align="center">
          <Link color="inherit" href="#">
            Privacy Policy
          </Link>{" "}
          |{" "}
          <Link color="inherit" href="#">
            Terms & Conditions
          </Link>
        </Typography>
      </Container>
    </footer>
  );
};

export default Footer;
