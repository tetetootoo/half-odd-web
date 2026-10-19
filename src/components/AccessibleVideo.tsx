import type { VideoHTMLAttributes } from 'react';

// Use the same silent, continuous playback for every project video.
export function AccessibleVideo(props: VideoHTMLAttributes<HTMLVideoElement>) {
  return <video aria-label="Project video preview" {...props} controls={false} autoPlay muted loop playsInline />;
}
