import React, { useState } from 'react';
import { Link } from "react-router-dom";
import { Typography, Card, CardContent, CardMedia, Avatar } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { Box } from "@mui/material";

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
  if (interval > 1) return interval + " years ago";
  interval = Math.floor(seconds / 2592000);
  if (interval > 1) return interval + " months ago";
  interval = Math.floor(seconds / 86400);
  if (interval > 1) return interval + " days ago";
  interval = Math.floor(seconds / 3600);
  if (interval > 1) return interval + " hours ago";
  interval = Math.floor(seconds / 60);
  if (interval > 1) return interval + " minutes ago";
  return Math.floor(seconds) + " seconds ago";
};

const formatDuration = (duration, liveBroadcastContent) => {
  if (!duration && liveBroadcastContent === "live") {
    return 'LIVE';
  }

  if (!duration) return ''; // Return empty string if duration is falsy (null, undefined, etc.)

  const match = duration.match(/PT(\d+H)?(\d+M)?(\d+S)?/);
  if (!match) return ''; // Return empty string if no match found

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

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  return (
    <Card
      sx={{
        boxShadow: "none",
        borderRadius: '20px',
        width: '100%',
        maxWidth: '360px',
        margin: '2px',
        position: 'relative',
        overflow: 'hidden'
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
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
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '70%',
            objectFit: 'cover'
          }}
        />
      )}
      </Link>
      <CardContent sx={{ backgroundColor: "#1E1E1E", padding: '10px', height: '100px', position: 'relative' }}>
        <Link to={videoId ? `/video/${videoId}` : demoVideoUrl}>
          <Typography sx={{ fontSize: '0.875rem', fontWeight: 'bold', color: '#FFF' }}>
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
        <Typography variant="body2" color="gray">
          {statistics ? formatViewCount(parseInt(statistics.viewCount)) : ''}
          {' - '}
          {timeAgo(snippet?.publishedAt)}
        </Typography>
        <Typography variant="body2" sx={{ position: 'absolute', bottom: '5px', right: '10px' }} color="gray">
          {contentDetails?.duration ? formatDuration(contentDetails?.duration, snippet?.liveBroadcastContent) : ''}
        </Typography>
      </CardContent>
      
    </Card>
  );
};

export default VideoCard;
