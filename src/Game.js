import React, { useState, useEffect, useRef } from 'react';
import Bird from './Bird';
import Pipe from './Pipe';
import backgroundImage from './bg.jpg'; // Replace with your image path

function Game() {
    const [birdPosition, setBirdPosition] = useState(100);
    const [birdVelocity, setBirdVelocity] = useState(0);
    const [pipes, setPipes] = useState([]);
    const [isGameOver, setIsGameOver] = useState(false);
    const [score, setScore] = useState(0);
    const [pipeSpeed, setPipeSpeed] = useState(4);
    const [isBirdVisible, setIsBirdVisible] = useState(true); // State for bird visibility

    const gravity = 0.09;
    const jumpForce = -2.9;
    const damping = 0.99;
    const pipeWidth = 50;
    const pipeGap = 200;
    const birdWidth = 40;
    const animationFrameId = useRef(null);
    const lastPassedPipeId = useRef(null);

    const gameLoop = () => {
        // Update bird position
        setBirdPosition((prevPosition) => Math.min(prevPosition + birdVelocity, window.innerHeight - birdWidth));

        // Update bird velocity with gravity
        setBirdVelocity((prevVelocity) => {
            const newVelocity = prevVelocity + gravity;
            return newVelocity * damping;
        });

        // Update pipes and check for collisions
        setPipes((prevPipes) => {
            const updatedPipes = prevPipes
                .map((pipe) => ({ ...pipe, left: pipe.left - pipeSpeed }))
                .filter((pipe) => pipe.left > -pipeWidth);

            const birdTop = birdPosition;
            const birdBottom = birdPosition + birdWidth;

            for (let pipe of updatedPipes) {
                const pipeLeft = pipe.left;
                const pipeRight = pipe.left + pipeWidth;
                const pipeTop = pipe.top;
                const pipeBottom = pipe.top + pipe.height;

                // Bird's bounding box
                const birdLeft = 0; // Bird is always at the leftmost position
                const birdRight = birdWidth;

                // Check for collision
                const isColliding =
                    pipeLeft < birdRight &&
                    pipeRight > birdLeft &&
                    ((birdTop < pipeBottom && !pipe.isBottom) ||
                        (birdBottom > pipeTop && pipe.isBottom));

                if (isColliding) {
                    setIsGameOver(true);
                    setIsBirdVisible(false); // Hide the bird on collision
                    cancelAnimationFrame(animationFrameId.current);
                    return prevPipes;
                }
            }

            // Check if the bird hits the ground
            if (birdPosition + birdWidth >= window.innerHeight) {
                setIsGameOver(true);
                setIsBirdVisible(false); // Hide the bird when it hits the ground
                cancelAnimationFrame(animationFrameId.current);
            }

            if (!isGameOver) {
                if (updatedPipes.length < prevPipes.length) {
                    const passedPipe = prevPipes.find(pipe => pipe.left > birdWidth);
                    if (passedPipe && lastPassedPipeId.current !== passedPipe.id) {
                        setScore(prevScore => {
                            const newScore = prevScore + 1;

                            if (newScore % 10 === 0) {
                                setPipeSpeed(prevSpeed => prevSpeed + 0.5);
                            }

                            lastPassedPipeId.current = passedPipe.id;
                            return newScore;
                        });
                    }
                }
            }

            return updatedPipes;
        });

        if (!isGameOver) {
            animationFrameId.current = requestAnimationFrame(gameLoop);
        }
    };


    useEffect(() => {
        animationFrameId.current = requestAnimationFrame(gameLoop);
        return () => cancelAnimationFrame(animationFrameId.current);
    }, [isGameOver, birdPosition, birdVelocity]);

    const handleJump = () => {
        if (!isGameOver) {
            setBirdVelocity(jumpForce);
        }
    };

    const resetGame = () => {
        setBirdPosition(100);
        setBirdVelocity(0);
        setPipes([]);
        setIsGameOver(false);
        setScore(0);
        setPipeSpeed(4);
        setIsBirdVisible(true); 
        lastPassedPipeId.current = null;
    };

    useEffect(() => {
        const pipeInterval = setInterval(() => {
            const topPipeHeight = Math.floor(Math.random() * 200) + 50;
            setPipes((prevPipes) => [
                ...prevPipes,
                { id: Date.now(), top: 0, height: topPipeHeight, left: window.innerWidth, isBottom: false },
                { id: Date.now() + 1, top: topPipeHeight + pipeGap, height: 500, left: window.innerWidth, isBottom: true }
            ]);
        }, 1500);

        return () => clearInterval(pipeInterval);
    }, []);

    return (
        <div
            onClick={handleJump}
            style={{
                position: 'relative',
                width: '100%',
                height: '100vh',
                overflow: 'hidden',
            }}
        >
            <div
                style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    backgroundImage: `url(${backgroundImage})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    filter: 'blur(4px)', 
                    zIndex: -1, 
                }}
            />

            {/* Game content */}
            {isBirdVisible && <Bird position={birdPosition} />}
            {pipes.map((pipe) => (
                <Pipe key={pipe.id} top={pipe.top} height={pipe.height} left={pipe.left} />
            ))}
            {isGameOver && (
                <>
                    <h1
                        style={{
                            position: 'absolute',
                            top: '40%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            color: 'red',
                            fontSize: '48px',
                            textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)',
                        }}
                    >
                        Game Over
                    </h1>
                    <h2
                        style={{
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            color: 'white',
                            fontSize: '32px',
                            textShadow: '1px 1px 2px rgba(0, 0, 0, 0.5)',
                        }}
                    >
                        Your Score: {score}
                    </h2>
                    <div
                        onClick={resetGame}
                        style={{
                            position: 'absolute',
                            top: '60%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            padding: '12px 24px',
                            fontSize: '20px',
                            backgroundColor: '#ffcc00',
                            color: '#000',
                            borderRadius: '10px',
                            cursor: 'pointer',
                            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.3)',
                            textAlign: 'center',
                            userSelect: 'none',
                            transition: 'background-color 0.3s',
                        }}
                        onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#ffd700'}
                        onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#ffcc00'}
                    >
                        Try Again
                    </div>
                </>
            )}
            <h2
                style={{
                    position: 'absolute',
                    top: 20,
                    left: 20,
                    color: 'white',
                    fontSize: '24px',
                }}
            >
                Score: {score}
            </h2>
        </div>
    );
}

export default Game;
