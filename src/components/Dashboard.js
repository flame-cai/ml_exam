import { useEffect, useState, useRef } from 'react';
import logo from '../logo.svg';
import McqSection from './McqSection';
import CodingSection from './CodingSection';

const Dashboard = (prop) => {
  const [progress, setProgress] = useState(prop.data.progress);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const isFullScreenRef = useRef(isFullScreen);
  const [activeStream, setActiveStream] = useState();
  const [isSharing, setIsSharing] = useState(false);
  const [isExamCompleted, setIsExamCompleted] = useState();

  // Listen for fullscreen change
  useEffect(() => {
    const handleFullScreenChange = () => {
      setIsFullScreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullScreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullScreenChange);
    }
  }, []);

  // Update isFullscreenRef
  useEffect(() => {
    isFullScreenRef.current = isFullScreen;
  }, [isFullScreen])

  const requestFullScreen = () => {
    const docEl = document.documentElement;
    if (docEl.requestFullscreen) {
      docEl.requestFullscreen();
    } else if (docEl.webkitRequestFullscreen) {
      docEl.webkitRequestFullscreen()
    } else if (docEl.msRequestFullscreen) {
      docEl.msRequestFullscreen()
    }
  }

  async function startScreenCapture() {
    try {

      let screenStream = await navigator.mediaDevices.getDisplayMedia({
        video: { cursor: "always", displaySurface: 'monitor' },
        audio: false
      });

      // Handle stream end (e.g., user stops sharing)
      screenStream.getVideoTracks()[0].addEventListener('ended', () => {
        setIsSharing(false);
        window.location.reload();
      });

      if (screenStream.getVideoTracks()[0].getSettings().displaySurface !== 'monitor') {
        alert('You must share entire screen');
        window.location.reload();
      }

      setActiveStream(screenStream);
      setIsSharing(true);
    } catch (err) {
      console.error("Error: " + err);
    }
  }

  // triggers request for screensharing
  useEffect(() => {
    if (!isSharing && !isExamCompleted) {
      startScreenCapture();
    }
  }, [isSharing, isExamCompleted])

  function dataURLToBlob(dataURL) {
    const byteString = atob(dataURL.split(',')[1]);
    const mimeString = dataURL.split(',')[0].split(':')[1].split(';')[0];
    const arrayBuffer = new ArrayBuffer(byteString.length);
    const uint8Array = new Uint8Array(arrayBuffer);

    for (let i = 0; i < byteString.length; i++) {
      uint8Array[i] = byteString.charCodeAt(i);
    }

    return new Blob([arrayBuffer], { type: mimeString });
  }

  async function captureScreenshots() {
    if (!activeStream) {
      console.error("Screen capture not started.");
      return;
    }

    function sleep(ms) {
      return new Promise(resolve => setTimeout(resolve, ms));
    }

    while (!isFullScreenRef.current || document.hidden) {
      try {
        const videoTrack = activeStream.getVideoTracks()[0];
        const imageCapture = new ImageCapture(videoTrack);
        const bitmap = await imageCapture.grabFrame();
        const canvas = document.createElement('canvas');
        canvas.width = bitmap.width;
        canvas.height = bitmap.height;
        const context = canvas.getContext('2d');
        context.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
        const imgDataUrl = canvas.toDataURL('image/png');

        // Convert to Blob
        const imgBlob = dataURLToBlob(imgDataUrl);

        // API call to backend
        const formData = new FormData();
        formData.append('file', imgBlob, 'screenshot.png');

        const response = await fetch('https://asia-south1-ppt-tts.cloudfunctions.net/ml-quiz1/log', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${prop.token}`
          },
          body: formData
        });
        const result = await response.json();
        console.log(result);

        // Clean up
        bitmap.close();
        await sleep(5000);
        if (isFullScreenRef.current && !document.hidden) {
          return
        }
      } catch (err) {
        console.error('Error capturing screenshot: ', err);
        window.location.reload();
        return
      }
    }
  }

  // Start screenshots if not fullscreen
  useEffect(() => {
    if (!isFullScreen) {
      captureScreenshots();
    }
  }, [isFullScreen])

  useEffect(() => {
    const tabSwitch = () => {
      if (document.hidden) {
        captureScreenshots()
      }
    }
    document.addEventListener('visibilitychange', tabSwitch);
    return () => {
      document.removeEventListener('fullscreenchange', tabSwitch);
    }
  }, [activeStream]);

  function stopScreenCapture() {
    if (activeStream) {
      activeStream.getTracks().forEach(track => track.stop());
      setActiveStream(null);
    }
  }

  // exit fullscreen if exam is over
  useEffect(() => {
    if (progress === 2) {
      stopScreenCapture();
      if (document.fullscreenElement) document.exitFullscreen();
    }
  }, [progress])

  const renderBody = () => {
    if (!isSharing && !isExamCompleted) {
      return <h4>Share your screen to continue</h4>
    }
    if (isSharing && !isFullScreen && progress !== 2) {
      return <button onClick={requestFullScreen} style={{ height: "30px" }}>Go Fullscreen</button>
    }
    if (progress == 0) {
      return <McqSection setProgress={setProgress} token={prop.token} questions={prop.data.questions.mcq} mcq={prop.data.mcq} email={prop.data.email} />
    } else if (progress == 1) {
      return <CodingSection setProgress={setProgress} token={prop.token} questions={prop.data.questions.code} setIsExamCompleted={setIsExamCompleted} code={prop.data.code} email={prop.data.email} />
    } else if (progress == 2) {
      console.log(activeStream);
      return <h4>
        The exam has been successfully completed. You may now close this tab.
      </h4>
    }
  };
  return (
    <main>
      <header className="header">
        <div className="banner">
          <img src={logo} className="logo" alt="logo" />&nbsp;
          <h2>ML Exam</h2>
        </div>
        <div className="user">
          <div className="name">{prop.data.name}</div>
          <div className="email">[{prop.data.email}]</div>
        </div>
      </header>
      <div className="body">
        {renderBody()}
      </div>
      <footer className="footer">
        <p>All the Best ~ CAI</p>
      </footer>
    </main>
  );
}

export default Dashboard;