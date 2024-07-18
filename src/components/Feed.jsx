import React, { useEffect, useState } from "react";
import { Box, Stack, Typography, Link } from "@mui/material";
import GitHubIcon from '@mui/icons-material/GitHub';
import { fetchFromAPI } from "../utils/fetchFromAPI";
import { Videos, Sidebar } from "./";
const Feed = () => {
  const [selectedCategory, setSelectedCategory] = useState("New");
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    setVideos(null);

     fetchFromAPI(`search?part=snippet&q=${selectedCategory}`)
      .then((data) => setVideos(data.items))
    }, [selectedCategory]);

  return (
    <Stack sx={{ flexDirection: { sx: "column", md: "row" } }}>
      <Box sx={{ height: { sx: "auto", md: "92vh" }, borderRight: "1px solid #3d3d3d", px: { sx: 0, md: 2 } }}>
        <Sidebar selectedCategory={selectedCategory} setSelectedCategory={setSelectedCategory} />
        
        <Typography className="copyright" variant="body2" sx={{ mt: 1.5, color: "#fff", }}>
          <Link href="https://github.com/raghav161/" target="_blank" style={{color: 'white', display: 'flex', justifyContent: 'center'}}>
            <GitHubIcon style={{marginRight: '12px', marginTop: '-4px'}}/>
            Raghav Bansal 
          </Link>
        </Typography>
      </Box>

      <Box p={5} sx={{ overflowY: "auto", height: "90vh", flex: 2, marginLeft: '50px' }}>
        <Typography variant="h4" fontWeight="bold" mb={2} sx={{ color: "white" }}>
          {selectedCategory} <span style={{ color: "#FC1503" }}>videos</span>
        </Typography>

        <Videos videos={videos} />
      </Box>
    </Stack>
  );
};

export default Feed;
