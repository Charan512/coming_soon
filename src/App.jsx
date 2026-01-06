import { useState, useEffect } from 'react'
import Confetti from 'react-confetti'
import { Theme } from '@radix-ui/themes'
import posterImage from './assets/poster.jpg'
import Hyperspeed from './Hyperspeed'
import './App.css'

const COUNTDOWN_DURATION = 12 * 60 * 60 * 1000; // 12 hours in milliseconds

function App() {
  const [timeLeft, setTimeLeft] = useState(null);
  const [showPoster, setShowPoster] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
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

  useEffect(() => {
    // Initialize countdown
    const storedEndTime = localStorage.getItem('countdownEndTime');
    const now = Date.now();

    if (!storedEndTime) {
      // First visit - set end time
      const endTime = now + COUNTDOWN_DURATION;
      localStorage.setItem('countdownEndTime', endTime.toString());
      setTimeLeft(COUNTDOWN_DURATION);
    } else {
      // Calculate remaining time
      const endTime = parseInt(storedEndTime);
      const remaining = endTime - now;

      if (remaining <= 0) {
        // Countdown finished
        setTimeLeft(0);
        setShowPoster(true);
        setShowConfetti(true);

        // Stop confetti after 5 seconds
        setTimeout(() => setShowConfetti(false), 5000);
      } else {
        setTimeLeft(remaining);
      }
    }
  }, []);

  useEffect(() => {
    if (timeLeft === null || timeLeft <= 0) return;

    const interval = setInterval(() => {
      const storedEndTime = parseInt(localStorage.getItem('countdownEndTime'));
      const now = Date.now();
      const remaining = storedEndTime - now;

      if (remaining <= 0) {
        setTimeLeft(0);
        setShowPoster(true);
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 5000);
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

  if (timeLeft === null) {
    return (
      <Theme appearance="dark">
        <div className="app">
          <div className="loading">Loading...</div>
        </div>
      </Theme>
    );
  }

  const time = formatTime(timeLeft);

  return (
    <Theme appearance="dark">
      <div className="app">
        {/* Hyperspeed 3D Background */}
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

        {showConfetti && (
          <Confetti
            width={windowSize.width}
            height={windowSize.height}
            colors={['#EC4899', '#F472B6', '#06B6D4', '#22D3EE', '#DB2777', '#0891B2']}
            numberOfPieces={300}
            recycle={false}
          />
        )}

        {!showPoster ? (
          <div className="countdown-container">
            <div className="mysterious-text">
              <div className="glitch-text">SOMETHING IS COMING</div>
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
        ) : (
          <div className="poster-reveal">
            <div className="poster-container">
              <img src={posterImage} alt="Event Poster" className="poster-image" />
            </div>
          </div>
        )}
      </div>
    </Theme>
  );
}

export default App;
