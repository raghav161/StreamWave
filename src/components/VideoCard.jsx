import React, { useState } from 'react';
import { Link } from "react-router-dom";
import { Typography, Card, CardContent, CardMedia, Avatar, IconButton, Menu, MenuItem, Box, Button, Snackbar } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import MoreVertIcon from '@mui/icons-material/MoreVert';

import { demoVideoUrl, demoVideoTitle, demoChannelUrl, demoChannelTitle } from "../utils/constants";

const formatViewCount = (viewCount) => {
  if (viewCount >= 1000000000) {
    return (viewCount / 1000000000).toFixed(1) + 'B views';
  } else if (viewCount >= 1000000) {
    return (viewCount / 1000000).toFixed(1) + 'M views';
  } else if (viewCount >= 1000) {
    return (viewCount / 1000).toFixed(1) + 'K views';
  }
  return viewCount.toString() + ' views';
};

const timeAgo = (publishedAt) => {
  const date = new Date(publishedAt);
  const now = new Date();
  const seconds = Math.floor((now - date) / 1000);

  let interval = Math.floor(seconds / 31536000);
  if (interval >= 1) return interval === 1 ? "1 year ago" : interval + " years ago";
  interval = Math.floor(seconds / 2592000);
  if (interval >= 1) return interval === 1 ? "1 month ago" : interval + " months ago";
  interval = Math.floor(seconds / 86400);
  if (interval >= 1) return interval === 1 ? "1 day ago" : interval + " days ago";
  interval = Math.floor(seconds / 3600);
  if (interval >= 1) return interval === 1 ? "1 hour ago" : interval + " hours ago";
  interval = Math.floor(seconds / 60);
  if (interval >= 1) return interval === 1 ? "1 minute ago" : interval + " minutes ago";
  return seconds === 1 ? "1 second ago" : seconds + " seconds ago";
};

const formatDuration = (duration, liveBroadcastContent) => {
  if (!duration && liveBroadcastContent === "live") {
    return 'LIVE';
  }

  if (!duration) return '';

  const match = duration.match(/PT(\d+H)?(\d+M)?(\d+S)?/);
  if (!match) return '';

  const hours = match[1] ? parseInt(match[1].replace('H', '')) : 0;
  const minutes = match[2] ? parseInt(match[2].replace('M', '')) : 0;
  const seconds = match[3] ? parseInt(match[3].replace('S', '')) : 0;

  let formattedDuration = '';

  if (hours > 0) {
    formattedDuration += `${hours}:`;
  }

  if (minutes > 0 || (hours === 0 && minutes === 0 && seconds > 0)) {
    formattedDuration += `${String(minutes).padStart(2, '0')}:`;
  } else if (hours === 0 && minutes === 0 && seconds === 0) {
    formattedDuration += '00:';
  }

  formattedDuration += `${String(seconds).padStart(2, '0')}`;

  return formattedDuration;
};

const VideoCard = ({ video: { id: { videoId }, snippet, statistics, contentDetails }, channelThumbnail }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [isNotInterested, setIsNotInterested] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleNotInterested = () => {
    setIsNotInterested(true);
    handleClose();
  };

  const handleUndo = () => {
    setIsNotInterested(false);
  };

  const handleShareClick = () => {
    const videoUrl = `https://stream-wave-project.vercel.app/video/${videoId}`;
    navigator.clipboard.writeText(videoUrl)
      .then(() => {
        setSnackbarOpen(true);
      })
      .catch((error) => {
        console.error("Error copying URL:", error);
      });
    handleClose();
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  return (
    <>
    <Card
      sx={{
        boxShadow: "none",
        borderRadius: '20px',
        width: '100%',
        maxWidth: '380px',
        margin: '2px',
        position: 'relative',
        overflow: 'hidden',
        backgroundColor: '#1E1E1E',
        color: isNotInterested ? 'white' : 'inherit',
        display: 'flex',
        flexDirection: 'column'
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {!isNotInterested ? (
        <>
          <Link to={videoId ? `/video/${videoId}` : `/video/cV2gBU6hKfY`}>
            <CardMedia
              component="img"
              image={snippet?.thumbnails?.high?.url}
              alt={snippet?.title}
              sx={{ width: '100%', height: 'auto', aspectRatio: '16/9' }}
            />
            {isHovered && (
              <iframe
                title={snippet?.title}
                src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
                allow="autoplay; encrypted-media"
                allowFullScreen
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '67%',
                  objectFit: 'cover'
                }}
              />
            )}
          </Link>
          <CardContent sx={{ backgroundColor: "#1E1E1E", padding: '10px', height: '120px', position: 'relative' }}>
            <Link to={videoId ? `/video/${videoId}` : demoVideoUrl}>
              <Typography sx={{ fontSize: '0.875rem', fontWeight: 'bold', color: '#FFF', paddingRight: '10px' }}>
                {snippet?.title.slice(0, 60) || demoVideoTitle.slice(0, 60)}
              </Typography>
            </Link>
            <Link to={snippet?.channelId ? `/channel/${snippet?.channelId}` : demoChannelUrl}>
              <Box display="flex" alignItems="center">
                <Avatar src={channelThumbnail} alt={snippet?.channelTitle} sx={{ width: 35, height: 35, m: 1, ml: 0 }} />
                <Typography variant="subtitle2" color="gray">
                  {snippet?.channelTitle || demoChannelTitle}
                  <CheckCircleIcon sx={{ fontSize: "12px", color: "gray", ml: "5px" }} />
                </Typography>
              </Box>
            </Link>
            <Typography variant="body2" sx={{ position: 'absolute', bottom: '5px', left: '10px' }} color="gray">
              {statistics ? formatViewCount(parseInt(statistics.viewCount)) : ''}
              {' - '}
              {timeAgo(snippet?.publishedAt)}
            </Typography>
            <Typography variant="body2" sx={{ position: 'absolute', bottom: '5px', right: '10px' }} color="gray">
              {contentDetails?.duration ? formatDuration(contentDetails?.duration, snippet?.liveBroadcastContent) : ''}
            </Typography>
            <IconButton
              onClick={handleClick}
              sx={{ position: 'absolute', top: '2px', right: '-10px', color: '#FFF' }}
            >
              <MoreVertIcon />
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleClose}
              sx={{ color: '#1E1E1E' }}
            >
              <MenuItem onClick={handleShareClick}>Share</MenuItem>
              <MenuItem onClick={handleNotInterested}>Not Interested</MenuItem>
            </Menu>
          </CardContent>
        </>
      ) : (
        <CardContent sx={{ backgroundColor: "#1E1E1E", padding: '10px', height: '332px', width: '360px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
          <Typography sx={{ fontSize: '0.875rem', fontWeight: 'bold', color: '#FFF', paddingBottom: '10px' }}>
            Video marked as not interested.
          </Typography>
          <Button onClick={handleUndo} sx={{ color: '#3ea6ff' }}>Undo</Button>
        </CardContent>

      )}
    </Card>
    <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        message="Link copied to clipboard"
        action={
          <Button color="inherit" onClick={handleSnackbarClose}>Close</Button>
        }
      />
    </>
  );
};

export default VideoCard;
