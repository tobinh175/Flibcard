import { useState, useRef, useEffect } from 'react';
import styles from '~/styles/flipcard.css?url';

export default function FlipCard() {
  const [isFlipped, setIsFlipped] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const cardRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!cardRef.current) return;

      const rect = cardRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const progress = 1 - rect.top / windowHeight;
      
      // Clamp between 0 and 1
      setScrollProgress(Math.max(0, Math.min(1, progress)));
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  // Zoom effect based on scroll (0.8 to 1.1)
  const zoomScale = 0.8 + scrollProgress * 0.3;

  return (
    <section className="flipcard-section">
      <div className="flipcard-container">
        <h2 className="flipcard-title">Discover Our Innovation</h2>
        <p className="flipcard-subtitle">Scroll down to reveal the magic — Click to flip the card</p>

        <div
          ref={cardRef}
          className={`flipcard ${isFlipped ? 'flipped' : ''}`}
          onClick={toggleFlip}
          style={{
            transform: `scale(${zoomScale})`,
            transition: 'transform 0.3s ease-out',
          }}
        >
          {/* Front side */}
          <div className="flipcard-front">
            <div className="card-content">
              <div className="card-icon">🚀</div>
              <h3>Front Side</h3>
              <p>Click to flip and discover more</p>
              <div className="flip-hint">↻ Click to flip</div>
            </div>
          </div>

          {/* Back side */}
          <div className="flipcard-back">
            <div className="card-content">
              <h3>Back Side</h3>
              <p>✨ Amazing Features</p>
              <ul className="feature-list">
                <li>🎨 Beautiful Design</li>
                <li>⚡ Lightning Fast</li>
                <li>📱 Fully Responsive</li>
                <li>🔥 Smooth Animations</li>
              </ul>
              <div className="flip-hint">↻ Click to flip back</div>
            </div>
          </div>
        </div>

        {/* Progress indicator */}
        <div className="scroll-progress">
          <div 
            className="progress-bar"
            style={{ width: `${scrollProgress * 100}%` }}
          ></div>
        </div>
      </div>
    </section>
  );
}
