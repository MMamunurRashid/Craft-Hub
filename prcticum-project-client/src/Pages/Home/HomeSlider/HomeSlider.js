import React, { useState, useEffect } from 'react';
import img1 from '../../../assets/newsletter-parallax.png';
import img2 from '../../../assets/art-of-colors-e1614735388680.jpg';
import img3 from '../../../assets/markus-spiske-QRrZzqLTWig-unsplash-1024x683.jpg';

import './animations.css';

const DynamicBackgroundComponent = () => {
  const [backgroundImage, setBackgroundImage] = useState(img1);
  const [title, setTitle] = useState('Your Heading');
  const [paragraph, setParagraph] = useState('Your Paragraph Text');
  const [showAnimation, setShowAnimation] = useState(true); // Initially set to true



  const interval = 5000;

  useEffect(() => {
    const imageList = [
      { image: img1, title: 'Heading 1', text: 'Paragraph 1' },
      { image: img2, title: 'Heading 2', text: 'Paragraph 2' },
      { image: img3, title: 'Heading 3', text: 'Paragraph 3' },
    ];
    const imageChangeInterval = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * imageList.length);
      const { image, title, text } = imageList[randomIndex];

      setBackgroundImage(image);
      setTitle(title);
      setParagraph(text);
      setShowAnimation(true); // Trigger animation for each change

      // Clear the animation classes after a short delay
      setTimeout(() => {
        setShowAnimation(false);
      }, 1000);
    }, interval);

    return () => clearInterval(imageChangeInterval);
  }, []);

  return (
    <div
      className="bg-cover bg-center h-64 relative"
      style={{
        backgroundImage: `url(${backgroundImage})`,
      }}
    >
      <div className="absolute inset-0 bg-black opacity-10"></div>

      <div className="absolute inset-0 flex items-center justify-center bg-slate-400 bg-opacity-10">
        <div className={`text-white text-center ${showAnimation ? 'animate-fade-in' : ''}`}>
          <h1 className={`text-3xl font-bold ${showAnimation ? 'animate-slide-in-up' : ''}`}>{title}</h1>
          <p className={`mt-2 ${showAnimation ? 'animate-slide-in-up' : ''}`}>{paragraph}</p>
          <button className={`mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ${showAnimation ? 'animate-fade-in' : ''}`}>
            Change Background
          </button>
        </div>
      </div>
    </div>
  );
};

export default DynamicBackgroundComponent;
