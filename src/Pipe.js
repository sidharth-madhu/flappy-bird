import React from 'react';

function Pipe({ top, height, left, isBottom }) {
    const pipeStyle = {
        position: 'absolute',
        left: left,
        top: top,
        width: '70px',
        height: height,
        background: isBottom 
            ? 'linear-gradient(to top, #32CD32, #228B22)' 
            : 'linear-gradient(to bottom, #32CD32, #228B22)', 
        boxShadow: '0 4px 10px rgba(0, 0, 0, 0.5)', 
        border: '2px solid #000', 
    };

    return <div style={pipeStyle} />;
}

export default Pipe;
