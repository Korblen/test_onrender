import React, { useState, useEffect } from 'react';
import AccessibilityPanel from './AccessibilityPanel';
import { useSwipeable } from 'react-swipeable'; 
import '../../index.css';

const AccessibilityIcon = ({ setDarkMode }) => {
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState(null);

  const [position, setPosition] = useState({ x: 4, y: 4 }); // Position initiale fixe
  const [isMobile, setIsMobile] = useState(false);
  const [startTouch, setStartTouch] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const userAgent =
      typeof window.navigator === "undefined" ? "" : navigator.userAgent;
    setIsMobile(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent));
  }, []);

  const handlers = useSwipeable({
    onSwipeStart: (eventData) => {
      const touch = eventData.event.touches[0];
      setStartTouch({
        x: touch.clientX - position.x,
        y: touch.clientY - position.y,
      });
    },
    onSwiping: (eventData) => {
      const touch = eventData.event.touches[0];
      const newX = touch.clientX - startTouch.x;
      const newY = touch.clientY - startTouch.y;

      // Aucune limite de contrôle, position mise à jour directement
      setPosition({
        x: newX,
        y: newY,
      });
    },
});


  useEffect(() => {
    const savedFilter = localStorage.getItem('activeFilter');
    if (savedFilter) {
      document.body.classList.add(savedFilter);
      setActiveFilter(savedFilter);
    }

    const darkMode = localStorage.getItem('darkMode') === 'true';
    setDarkMode(darkMode);

    const openDyslexic = localStorage.getItem('openDyslexic') === 'true';
    if (openDyslexic) {
      document.body.classList.add('open-dyslexic');
    }

    const textSize = localStorage.getItem('textSize');
    if (textSize) {
      document.body.style.fontSize = textSize;
    }
  }, [setDarkMode]);

  const togglePanel = () => {
    setIsPanelOpen(!isPanelOpen);
  };

  const toggleFilter = (filterClass) => {
    if (activeFilter === filterClass) {
      document.body.classList.remove(filterClass);
      setActiveFilter(null);
      localStorage.removeItem('activeFilter');
    } else {
      document.body.classList.remove(activeFilter);
      document.body.classList.add(filterClass);
      setActiveFilter(filterClass);
      localStorage.setItem('activeFilter', filterClass);
    }
  };

  const toggleDarkMode = () => {
    const isDarkMode = document.body.classList.toggle('dark-mode');
    setDarkMode(isDarkMode);
    localStorage.setItem('darkMode', isDarkMode);
  };

  const toggleOpenDyslexic = () => {
    document.body.classList.toggle('open-dyslexic');
    const openDyslexic = document.body.classList.contains('open-dyslexic');
    localStorage.setItem('openDyslexic', openDyslexic);
  };

  const increaseTextSize = () => {
    document.body.style.fontSize = 'larger';
    localStorage.setItem('textSize', 'larger');
  };

  const decreaseTextSize = () => {
    document.body.style.fontSize = 'smaller';
    localStorage.setItem('textSize', 'smaller');
  };

  return (
    <div {...handlers} style={{ touchAction: 'none' }}>  
      <div
        className="accessibility-icon fixed bottom-4 left-4 bg-blue-500 text-white p-4 rounded-full cursor-pointer z-50 flex items-center justify-center"
        style={{
          transform: `translate(${position.x}px, ${position.y}px)`,
        }}
        onClick={togglePanel}
      >
        <i className="fas fa-universal-access text-2xl"></i>
      </div>
      {isPanelOpen && (
        <AccessibilityPanel
          onClose={togglePanel}
          activeFilter={activeFilter}
          toggleFilter={toggleFilter}
          toggleDarkMode={toggleDarkMode}
          toggleOpenDyslexic={toggleOpenDyslexic}
          increaseTextSize={increaseTextSize}
          decreaseTextSize={decreaseTextSize}
        />
      )}
    </div>
  );
};

export default AccessibilityIcon;