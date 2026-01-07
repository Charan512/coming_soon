import { useState, useEffect, useRef } from 'react'
import Confetti from 'react-confetti'
import { Theme } from '@radix-ui/themes'
// Video file is in public folder, no import needed
import Hyperspeed from './Hyperspeed'
import LightRays from './LightRays'
import ElectricBorder from './ElectricBorder'
import './App.css'
import './AnimeLoader.css'

// 🎯 COUNTDOWN TARGET DATE - TESTING
// Set to a future time for testing (Jan 8, 2026, 1:00 AM)
const TARGET_DATE = new Date(2026, 0, 8, 10, 30, 0); // Jan 8, 2026, 1:00 AM

function App() {
  const [timeLeft, setTimeLeft] = useState(null);
  const [showPoster, setShowPoster] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [showAnimeLoader, setShowAnimeLoader] = useState(false);
  const [videoEnded, setVideoEnded] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showPlayButton, setShowPlayButton] = useState(false);
  const videoRef = useRef(null);
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    // Handle window resize for confetti
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Handle video loaded - show play button for user interaction
  const handleVideoLoaded = () => {
    if (videoRef.current && !videoEnded) {
      // Always show play button for better browser compatibility
      setShowPlayButton(true);
    }
  };

  const handlePlayClick = () => {
    if (videoRef.current) {
      videoRef.current.muted = false;
      videoRef.current.volume = 1.0;
      videoRef.current.play();
      setShowPlayButton(false);
    }
  };

  useEffect(() => {
    // Clear any old localStorage data
    localStorage.clear();

    // Simulate loading time (3 seconds for lightning effect)
    const loadingTimer = setTimeout(() => {
      setIsLoading(false);
    }, 3000);

    // Initialize countdown with fixed target date
    const now = Date.now();
    const targetTime = TARGET_DATE.getTime();
    const remaining = targetTime - now;

    if (remaining <= 0) {
      // Countdown already finished
      setTimeLeft(0);
      setShowPoster(true);
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 5000);
    } else {
      setTimeLeft(remaining);
    }

    return () => clearTimeout(loadingTimer);
  }, []);

  useEffect(() => {
    if (timeLeft === null || timeLeft <= 0) return;

    const interval = setInterval(() => {
      const now = Date.now();
      const targetTime = TARGET_DATE.getTime();
      const remaining = targetTime - now;

      if (remaining <= 0) {
        setTimeLeft(0);
        setShowAnimeLoader(true);
        // Show anime loader for 2 seconds, then reveal poster
        setTimeout(() => {
          setShowAnimeLoader(false);
          setShowPoster(true);
          setShowConfetti(true);
          setTimeout(() => setShowConfetti(false), 5000);
        }, 2000);
        clearInterval(interval);
      } else {
        setTimeLeft(remaining);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [timeLeft]);

  const formatTime = (ms) => {
    const totalSeconds = Math.floor(ms / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    return {
      hours: String(hours).padStart(2, '0'),
      minutes: String(minutes).padStart(2, '0'),
      seconds: String(seconds).padStart(2, '0'),
    };
  };

  // Show preloader with electric border effect
  if (isLoading || timeLeft === null) {
    return (
      <Theme appearance="dark">
        <div className="app">
          <div className="preloader">
            {/* Red Alert Borders */}
            <div className="red-alert-border red-alert-top"></div>
            <div className="red-alert-border red-alert-right"></div>
            <div className="red-alert-border red-alert-bottom"></div>
            <div className="red-alert-border red-alert-left"></div>

            <div className="preloader-content">
              <ElectricBorder
                color="#22D3EE"
                speed={2}
                chaos={0.25}
                borderRadius={15}
                className="preloader-border"
              >
                <div className="preloader-text-container">
                  <h1 className="mystery-text">INTRUDER ALERT</h1>
                  <p className="warning-text">You shouldn't have scanned that...</p>
                </div>
              </ElectricBorder>
              <div className="flash-overlay"></div>
            </div>
          </div>
        </div>
      </Theme>
    );
  }

  const time = formatTime(timeLeft);

  return (
    <Theme appearance="dark">
      <div className="app">
        {/* Hyperspeed 3D Background - only show during countdown */}
        {!showPoster && (
          <Hyperspeed
            effectOptions={{
              distortion: 'turbulentDistortion',
              length: 400,
              roadWidth: 10,
              islandWidth: 2,
              lanesPerRoad: 3,
              fov: 90,
              fovSpeedUp: 150,
              speedUp: 2,
              carLightsFade: 0.4,
              totalSideLightSticks: 50,
              lightPairsPerRoadWay: 50,
              shoulderLinesWidthPercentage: 0.05,
              brokenLinesWidthPercentage: 0.1,
              brokenLinesLengthPercentage: 0.5,
              lightStickWidth: [0.12, 0.5],
              lightStickHeight: [1.3, 1.7],
              movingAwaySpeed: [60, 80],
              movingCloserSpeed: [-120, -160],
              carLightsLength: [400 * 0.05, 400 * 0.15],
              carLightsRadius: [0.05, 0.14],
              carWidthPercentage: [0.3, 0.5],
              carShiftX: [-0.2, 0.2],
              carFloorSeparation: [0.05, 1],
              colors: {
                roadColor: 0x000000,
                islandColor: 0x000000,
                background: 0x000000,
                shoulderLines: 0x22D3EE,
                brokenLines: 0x22D3EE,
                leftCars: [0xEC4899, 0xF472B6, 0xDB2777],
                rightCars: [0x06B6D4, 0x22D3EE, 0x0891B2],
                sticks: 0x06B6D4
              }
            }}
          />
        )}

        {showConfetti && (
          <Confetti
            width={windowSize.width}
            height={windowSize.height}
            colors={['#EC4899', '#F472B6', '#06B6D4', '#22D3EE', '#DB2777', '#0891B2']}
            numberOfPieces={300}
            recycle={false}
          />
        )}

        {/* Anime Loader - shows after countdown ends */}
        {showAnimeLoader && (
          <div className="anime-loader">
            <div className="anime-loader-content">
              <div className="anime-rings">
                <div className="anime-ring ring-1"></div>
                <div className="anime-ring ring-2"></div>
                <div className="anime-ring ring-3"></div>
              </div>
              <div className="anime-text">
                <div className="anime-kanji">解読中</div>
                <div className="anime-loading">DECRYPTING...</div>
              </div>
            </div>
          </div>
        )}

        {!showPoster && !showAnimeLoader ? (
          <div className="countdown-container">
            <div className="mysterious-text">
              <div className="glitch-text">DECRYPTION IN PROGRESS</div>
              <div className="subtitle-text">The wait is almost over...</div>
            </div>

            <div className="countdown-display">
              <div className="time-unit">
                <div className="time-value">{time.hours}</div>
                <div className="time-label">HOURS</div>
              </div>
              <div className="time-separator">:</div>
              <div className="time-unit">
                <div className="time-value">{time.minutes}</div>
                <div className="time-label">MINUTES</div>
              </div>
              <div className="time-separator">:</div>
              <div className="time-unit">
                <div className="time-value">{time.seconds}</div>
                <div className="time-label">SECONDS</div>
              </div>
            </div>

            <div className="speed-lines">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="speed-line" style={{
                  top: `${20 + i * 15}%`,
                  animationDelay: `${i * 0.2}s`
                }}></div>
              ))}
            </div>
          </div>
        ) : videoEnded ? (
          // Stage 5: "STAY TUNED" End Screen
          <div className="stay-tuned-screen">
            {/* Cyan Corner Glows */}
            <div className="cyan-glow-border cyan-glow-top"></div>
            <div className="cyan-glow-border cyan-glow-right"></div>
            <div className="cyan-glow-border cyan-glow-bottom"></div>
            <div className="cyan-glow-border cyan-glow-left"></div>

            <div className="stay-tuned-content">
              <h1 className="stay-tuned-text">STAY TUNED</h1>
              <p className="stay-tuned-subtitle">We're cooking something special...</p>
            </div>
          </div>
        ) : (
          // Stage 4: Video Reveal
          <div className="poster-reveal">
            {/* Cyan Corner Glows during video playback */}
            <div className="cyan-glow-border cyan-glow-top"></div>
            <div className="cyan-glow-border cyan-glow-right"></div>
            <div className="cyan-glow-border cyan-glow-bottom"></div>
            <div className="cyan-glow-border cyan-glow-left"></div>

            {/* Light Rays Background Animation */}
            <div style={{ position: 'absolute', width: '100%', height: '100%', top: 0, left: 0 }}>
              <LightRays
                raysSpeed={2.1}
                lightSpread={2}
                fadeDistance={2}
                saturation={1.1}
                mouseInfluence={0.9}
                raysOrigin="top-center"
                raysColor="#22D3EE"
                className="poster-rays"
              />
            </div>
            <div className="poster-container">
              {showPlayButton && (
                <div
                  onClick={handlePlayClick}
                  style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    zIndex: 1000,
                    cursor: 'pointer',
                    background: 'rgba(34, 211, 238, 0.15)',
                    border: '3px solid #22D3EE',
                    borderRadius: '50%',
                    width: '100px',
                    height: '100px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '50px',
                    color: '#22D3EE',
                    backdropFilter: 'blur(15px)',
                    boxShadow: '0 0 30px rgba(34, 211, 238, 0.5), inset 0 0 20px rgba(34, 211, 238, 0.2)',
                    transition: 'all 0.3s ease',
                    animation: 'pulse 2s infinite'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translate(-50%, -50%) scale(1.1)';
                    e.currentTarget.style.boxShadow = '0 0 50px rgba(34, 211, 238, 0.8), inset 0 0 30px rgba(34, 211, 238, 0.3)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translate(-50%, -50%) scale(1)';
                    e.currentTarget.style.boxShadow = '0 0 30px rgba(34, 211, 238, 0.5), inset 0 0 20px rgba(34, 211, 238, 0.2)';
                  }}
                >
                  <span style={{ marginLeft: '8px' }}>▶</span>
                </div>
              )}
              <video
                ref={videoRef}
                className="poster-video"
                loop={false}
                playsInline
                onLoadedData={handleVideoLoaded}
                onEnded={() => setVideoEnded(true)}
              >
                <source src="/teaser.mp4" type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>
          </div>
        )}
      </div>
    </Theme>
  );
}

export default App;
