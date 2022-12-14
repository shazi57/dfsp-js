import Cookies from 'cookies';
import LitJsSdk from 'lit-js-sdk';
import { useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import VideoJS from 'pages/components/elements/VideoJS';
import useProvider from 'hooks/useProvider';
import useSigner from '../../../../hooks/useSigner';
import checkIfAdmin from '../../../../lit/checkIfAdmin';
import checkIfSubscriber from '../../../../lit/checkIfSubscriber';

export default function Stream(props) {
  const provider = useProvider();
  const playerRef = useRef(null);
  const { signer, signerAddr } = useSigner(provider);
  const router = useRouter();
  useEffect(() => {
    if (!signerAddr) {
      return;
    }
    const checkSignerChanged = async () => {
      if (signerAddr !== props.litSigner) {
        let jwt = await checkIfAdmin(props.contractAddr);
        if (!jwt) {
          jwt = await checkIfSubscriber(props.contractAddr);
        }

        if (!jwt) {
          router.push('/unauthorized');
        } else {
          router.push(`/channels/${props.contractAddr}/stream/${props.playbackId}`);
        }
      }
    };
    checkSignerChanged();
  }, [signer, signerAddr]);

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
  if (!verified || (payload.role !== 'subscriber' && payload.role !== 'admin')) {
    return {
      redirect: {
        permanent: false,
        destination: '/unauthorized',
      },
    };
  }
  if (payload.baseUrl !== process.env.NEXT_PUBLIC_BASE_URL || (payload.path !== `channels/${params.pid}` && payload.path !== `/channels/${params.pid}`)) {
    return {
      redirect: {
        permanent: false,
        destination: '/unauthorized',
      },
    };
  }

  return {
    props: {
      contractAddr: params.pid,
      litSigner: payload.sub,
      playbackId: params.pbid,
      role: payload.role,
    },
  };
}
