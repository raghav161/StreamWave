import React, { useEffect, useState } from "react";
import { Box, Stack } from "@mui/material";
import { ChannelCard, Loader, VideoCard } from "./";
import { fetchFromAPI } from "../utils/fetchFromAPI";

const Videos = ({ videos, direction }) => {
  const [videoDetails, setVideoDetails] = useState([]);
  const [channelThumbnails, setChannelThumbnails] = useState({});

  useEffect(() => {
    const fetchVideoDetails = async () => {
      if (!videos) return;

      const videoIds = videos.map(video => video.id.videoId).filter(videoId => videoId);
      if (videoIds.length > 0) {
        try {
          const videoResponse = await fetchFromAPI(`videos?part=contentDetails,snippet,statistics&id=${videoIds.join(',')}`);
          setVideoDetails(videoResponse.items || []);

          const channelIds = [...new Set(videos.map(video => video.snippet.channelId))];
          const channelResponse = await fetchFromAPI(`channels?part=snippet&id=${channelIds.join(',')}`);
          const thumbnails = channelResponse.items.reduce((acc, channel) => {
            acc[channel.id] = channel.snippet.thumbnails.default.url;
            return acc;
          }, {});
          setChannelThumbnails(thumbnails);
        } catch (error) {
          console.error("Error fetching video or channel details:", error);
        }
      }
    };

    fetchVideoDetails();
  }, [videos]);

  if (!videos?.length) return <Loader />;

  const mergedVideos = videos.map(video => {
    const videoDetail = videoDetails.find(detail => detail.id === video.id.videoId);
    return videoDetail ? { ...video, statistics: videoDetail.statistics, contentDetails: videoDetail.contentDetails } : video;
  });

  return (
    <Stack direction={direction || "row"} flexWrap="wrap" justifyContent="start" alignItems="start" gap={2}>
      {mergedVideos.map((item, idx) => {
        const thumbnailUrl = item?.snippet?.thumbnails?.high?.url;
        const channelThumbnail = channelThumbnails[item.snippet.channelId];
        return (
          <Box key={idx}>
            {item.id.videoId && thumbnailUrl && <VideoCard video={item} channelThumbnail={channelThumbnail} />}
            {item.id.channelId && <ChannelCard channelDetail={item} />}
          </Box>
        );
      })}
    </Stack>
  );
};

export default Videos;
