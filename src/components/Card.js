import React from 'react';
import '../styling/card.css';

function Card(props) {
  const { img, text } = props; // Destructure props to get img and text
  return (
    <div className='card-body'>
      <div style={{ width: '100%', height: '70%' }}>
        <img className='card-img' src={img} alt="" /> {/* Use img prop */}
      </div>
      <div className='card-bottom'>
        <p>{text}</p> {/* Use text prop */}
      </div>
    </div>
  );
}

export default Card;
