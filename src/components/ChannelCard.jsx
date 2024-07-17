import React from 'react';
import { Box, CardContent, CardMedia, Typography } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { Link } from 'react-router-dom';
import { demoProfilePicture } from '../utils/constants';

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

const ChannelCard = ({ channelDetail, marginTop }) => (
  <Box
    sx={{
      boxShadow: 'none',
      borderRadius: '20px',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      width: { xs: '95%', md: '300px' },
      height: '326px',
      marginLeft: '50px',
      marginRight: '14px'
    }}
  >
    <Link to={`/channel/${channelDetail?.id?.channelId}`}>
      <CardContent sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', textAlign: 'center', color: '#fff' }}>
        <CardMedia
          image={channelDetail?.snippet?.thumbnails?.high?.url || demoProfilePicture}
          alt={channelDetail?.snippet?.title}
          sx={{ borderRadius: '50%', height: '180px', width: '180px', mb: 2, border: '1px solid #e3e3e3' }}
        />
        <Typography variant="h6">
          {channelDetail?.snippet?.title}{' '}
          <CheckCircleIcon sx={{ fontSize: '14px', color: 'gray', ml: '5px' }} />
        </Typography>
        {channelDetail?.statistics?.subscriberCount && (
          <Typography sx={{ fontSize: '15px', fontWeight: 500, color: 'gray' }}>
            {formatsubsCount(parseInt(channelDetail?.statistics?.subscriberCount))} Subscribers
          </Typography>
        )}
         {channelDetail?.statistics?.videoCount && (
          <Typography sx={{ fontSize: '15px', fontWeight: 500, color: 'gray', mt: 1 }}>
            {channelDetail?.statistics?.videoCount.toLocaleString()} Videos
          </Typography>
        )}
      </CardContent>
    </Link>
  </Box>
);

export default ChannelCard;
