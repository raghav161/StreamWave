import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import ReactPlayer from "react-player";
import { Typography, Box, Stack, Avatar, Button } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { Videos, Loader } from "./";
import { fetchFromAPI } from "../utils/fetchFromAPI";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

const formatsubsCount = (subscriberCount) => {
  if (subscriberCount >= 1000000000) {
    return (subscriberCount / 1000000000).toFixed(1) + 'B';
  } else if (subscriberCount >= 1000000) {
    return (subscriberCount / 1000000).toFixed(1) + 'M';
  } else if (subscriberCount >= 1000) {
    return (subscriberCount / 1000).toFixed(1) + 'K';
  }
  return subscriberCount.toString() + ' ';
};

const VideoDetail = () => {
  const [videoDetail, setVideoDetail] = useState(null);
  const [channelDetail, setChannelDetail] = useState(null);
  const [videos, setVideos] = useState(null);
  const { id } = useParams();

  useEffect(() => {
    fetchFromAPI(`videos?part=snippet,statistics&id=${id}`)
      .then((data) => setVideoDetail(data.items[0]))
      .catch((error) => console.error("Error fetching video details:", error));

    fetchFromAPI(`search?part=snippet&relatedToVideoId=${id}&type=video`)
      .then((data) => setVideos(data.items))
      .catch((error) => console.error("Error fetching related videos:", error));
  }, [id]);

  useEffect(() => {
    if (videoDetail?.snippet?.channelId) {
      fetchFromAPI(`channels?part=snippet,statistics&id=${videoDetail.snippet.channelId}`)
        .then((data) => setChannelDetail(data.items[0]))
        .catch((error) => console.error("Error fetching channel details:", error));
    }
  }, [videoDetail]);

  if (!videoDetail?.snippet) return <Loader />;

  const { snippet: { title, channelId, channelTitle }, statistics: { viewCount, likeCount } } = videoDetail;
  const channelLogo = channelDetail?.snippet?.thumbnails?.default?.url;
  const subscriberCount = channelDetail?.statistics?.subscriberCount;

  const handleShareClick = () => {
    const videoUrl = `https://stream-wave-project.vercel.app/video/${id}`;
    navigator.clipboard.writeText(videoUrl)
      .then(() => {
        toast.success("URL is copied to clipboard");
      })
      .catch((error) => {
        toast.error("Failed to copy URL");
        console.error("Error copying URL:", error);
      });
  };

  return (
    <Box style={{ margin: '25px' }}>
      <Stack direction={{ xs: "column", md: "row" }}>
        <Box flex={1}>
          <Box sx={{ height: '60%', width: "93%", position: "sticky", top: "86px" }}>
            <ReactPlayer url={`https://www.youtube.com/watch?v=${id}`} className="react-player" controls playing />
            <Typography color="#fff" variant="h5" fontWeight="bold" p={2}>
              {title}
            </Typography>
            <Stack direction="row" justifyContent="space-between" sx={{ color: "#fff" }} py={1} px={2} marginTop="-10px">
              <Link to={`/channel/${channelId}`} style={{ display: 'flex', alignItems: 'center' }}>
                <Avatar src={channelLogo} alt={channelTitle} sx={{ width: 40, height: 40, marginRight: '8px' }} />
                <Box>
                  <Typography variant={{ sm: "subtitle1", md: 'h10' }} color="#fff">
                    {channelTitle}
                    <CheckCircleIcon sx={{ fontSize: "12px", color: "gray", ml: "5px" }} />
                  </Typography>
                  <Typography variant="body2" color="#aaa">
                    {formatsubsCount(parseInt(subscriberCount))} subscribers
                  </Typography>
                </Box>
              </Link>
              <Stack direction="row" gap="20px" alignItems="center">
                <Typography variant="body1" sx={{ opacity: 0.7 }}>
                  {parseInt(viewCount).toLocaleString()} views
                </Typography>
                <Typography variant="body1" sx={{ opacity: 0.7 }}>
                  {parseInt(likeCount).toLocaleString()} likes
                </Typography>
                <Button style={{backgroundColor: 'Red'}} variant="contained" color="primary" onClick={handleShareClick}>
                  Share
                </Button>
              </Stack>
            </Stack>
          </Box>
        </Box>
        <Box px={2} py={{ md: 1, xs: 5 }} justifyContent="center" alignItems="center">
          <Videos videos={videos} direction="column" />
        </Box>
      </Stack>
      <ToastContainer position="bottom-right" />
    </Box>
  );
};

export default VideoDetail;
