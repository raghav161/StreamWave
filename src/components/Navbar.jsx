import { Stack } from "@mui/material";
import { Link } from "react-router-dom";
import { Typography } from "@mui/material";
import { logo } from "../utils/constants";
import { SearchBar } from "./";

const Navbar = () => (
  <Stack direction="row" alignItems="center" p={2} sx={{ zIndex: 130, position:  "sticky", background: '#000', top: 0, justifyContent: "space-between" }}>
    <Link to="/" style={{ display: "flex", alignItems: "center" }}>
      <img src={logo} alt="logo" height={45} />
      <Typography variant="body2" sx={{ color: '#fff', marginLeft: 2, fontSize: '2em' }}>
        StreamWave
      </Typography>
    </Link>
    <SearchBar />
  </Stack>
);

export default Navbar;
