import Cookies from 'cookies';
import LitJsSdk from 'lit-js-sdk';
import { useEffect, useRef } from 'react';
import VideoJS from 'pages/components/elements/VideoJS';
import JSONdb from 'simple-json-db';

export default function Stream(props) {
  const playerRef = useRef(null);

  const videoJsOptions = {
    autoplay: true,
    controls: true,
    responsive: true,
    fluid: true,
    sources: [{
      src: `https://livepeercdn.com/hls/${props.playbackId}/index.m3u8`,
      type: 'application/x-mpegURL',
    }],
  };

  const handlePlayerReady = (player) => {
    playerRef.current = player;
  };

  return (
    <>
      <div>Rest of app here</div>
      <VideoJS options={videoJsOptions} onReady={handlePlayerReady} />
      <div>Rest of app here</div>
    </>
  );
}

export async function getServerSideProps({
  req, res, params,
}) {
  const db = new JSONdb('db/storage.json');

  const cookies = new Cookies(req, res);
  const jwt = cookies.get('lit-auth');
  if (!jwt) {
    return {
      redirect: {
        permanent: false,
        destination: '/',
      },
    };
  }
  const { verified, payload } = LitJsSdk.verifyJwt({ jwt });
  console.log(verified);
  console.log(payload);
  console.log(params.pid);
  if (payload.baseUrl !== process.env.NEXT_PUBLIC_BASE_URL || payload.path !== `/channels/${params.pid}`) {
    return {
      redirect: {
        permanent: false,
        destination: '/',
      },
    };
  }

  return {
    props: {
      playbackId: params.pbid,
      role: payload.role,
    },
  };
}
