// Bird.jsx
import React from 'react';
import birdImage from './bird.png'; 

const Bird = ({ position }) => {
    return (
        <img
            src={birdImage}
            alt="Bird"
            style={{
                position: 'absolute',
                top: position,
                left: 50, 
                width: '245px', 
                height: '140px', 
                zIndex: 1, 
            }}
        />
    );
};

export default Bird;
