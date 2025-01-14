import { useState, useEffect } from 'react';
import { Check } from 'lucide-react';

const App = () => {
  const [progress, setProgress] = useState(0);
  const [state, setState] = useState('loading');
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    let animationFrame;
    const startTime = Date.now();
    const duration = 2000;

    const animate = () => {
      const currentTime = Date.now();
      const elapsed = currentTime - startTime;
      const nextProgress = Math.min((elapsed / duration) * 100, 100);

      setProgress(nextProgress);

      if (nextProgress < 100) {
        animationFrame = requestAnimationFrame(animate);
      } else {
        handleCompletion();
      }
    };

    const handleCompletion = () => {
      setTimeout(() => {
        setIsAnimating(true);
        setState('ready');
        setTimeout(() => {
          setState('start');
        }, 2000);
      }, 500);
    };

    animationFrame = requestAnimationFrame(animate);

    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, []);

  const radius = 80;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  const gradientText = {
    background: 'linear-gradient(135deg, #FF8C00 0%, #D35400 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
    filter: 'drop-shadow(0 0 15px rgba(255,140,0,0.5))',
  };

  const transitionClasses = 'transition-all duration-700 ease-in-out';
  const fadeClasses = isAnimating ? 'opacity-100 scale-100' : 'opacity-0 scale-95';

  return (
    <div className="h-screen w-screen flex items-center justify-center bg-black overflow-hidden">
      <svg width="300" height="300" className="-rotate-90 relative">
        {/* Background circle */}
        <circle
          cx="150"
          cy="150"
          r={radius}
          fill="none"
          stroke="rgba(0,0,0,0.2)"
          strokeWidth="12"
        />
        {/* Progress circle */}
        <circle
          cx="150"
          cy="150"
          r={radius}
          fill="none"
          stroke="url(#progressGradient)"
          strokeWidth="12"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          style={{
            transition: 'stroke-dashoffset 16ms linear',
            filter: 'drop-shadow(-10px 0px 15px rgba(255,100,0,0.6)) drop-shadow(10px 0px 15px rgba(255,165,0,0.6))',
          }}
        />
        <defs>
          <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FF4500" /> {/* Dark Orange */}
            <stop offset="50%" stopColor="#FF8C00" /> {/* Orange */}
            <stop offset="100%" stopColor="#FFD700" /> {/* Yellow */}
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        {state === 'loading' && (
          <div className={`text-2xl font-medium absolute inset-0 flex items-center justify-center ${transitionClasses}`} style={gradientText}>
            {Math.round(progress)}%
          </div>
        )}
        {state === 'ready' && (
          <div className={`flex flex-col items-center gap-1 absolute inset-0 flex items-center justify-center ${transitionClasses} ${fadeClasses}`} style={gradientText}>
            <Check
              className="w-6 h-6"
              style={{
                stroke: '#FF8C00',
                filter: 'drop-shadow(0 0 15px rgba(255,140,0,0.6))',
                strokeWidth: 3,
              }}
            />
            <span className="text-2xl font-medium">Ready</span>
          </div>
        )}
        {state === 'start' && (
          <div className={`text-3xl font-medium absolute inset-0 flex items-center justify-center ${transitionClasses}`} style={gradientText}>
            Start
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
