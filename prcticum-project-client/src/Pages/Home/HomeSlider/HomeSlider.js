import React, { useState, useEffect } from 'react';
import img1 from '../../../assets/newsletter-parallax.png';
import img2 from '../../../assets/Mask_group.png';

import './animations.css';
import PrimaryButton from '../../../Component/PrimaryButton';

const HomeSlider = () => {
  const [backgroundImage, setBackgroundImage] = useState(img1);
  const [title, setTitle] = useState('Happy Winter');
  const [paragraph, setParagraph] = useState('Welcome Offer is on going');
  const [showAnimation, setShowAnimation] = useState(true); // Initially set to true



  const interval = 5000;

  useEffect(() => {
    const imageList = [
      { image: img2, title: 'Free Delivery', text: 'Starting at ৳ 999' },
      { image: img1, title: `Happy Winter`, text: 'Welcome Offer is on going' },
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
      className="bg-cover bg-center relative h-[400px]"
      style={{
        backgroundImage: `url(${backgroundImage})`,
        opacity: 0.9
      }}
    >
      <div className="absolute inset-0 bg-black opacity-10"></div>

      <div className="absolute inset-0 flex items-center justify-center bg-slate-400 bg-opacity-10">
        <div className={`text-white text-center ${showAnimation ? 'animate-fade-in' : ''}`}>
          <h1 className={`text-3xl font-bold ${showAnimation ? 'animate-slide-in-up' : ''}`}>{title}</h1>
          <p className={`mt-2 ${showAnimation ? 'animate-slide-in-up' : ''}`}>{paragraph}</p>
          <PrimaryButton>Shop Now</PrimaryButton>
        </div>
      </div>
    </div>
  );
};

export default HomeSlider;
