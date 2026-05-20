"use client";

import { useEffect, useRef } from 'react';

/**
 * A client component that applies a canvas-based film grain effect.
 * This is designed to be used for the 'horror' theme.
 */
export const FilmGrain = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let w = window.innerWidth;
        let h = window.innerHeight;
        canvas.width = w;
        canvas.height = h;

        let animationFrameId: number;
        let noiseData: ImageData[] = [];

        const createNoise = () => {
            for (let i = 0; i < 10; i++) {
                const idata = ctx.createImageData(w, h);
                const buffer32 = new Uint32Array(idata.data.buffer);
                const len = buffer32.length;

                for (let j = 0; j < len; j++) {
                    if (Math.random() < 0.05) { // Adjust density of grain
                        buffer32[j] = 0xffffffff; // white grain
                    }
                }
                noiseData.push(idata);
            }
        };

        let frame = 0;
        const loop = () => {
            frame = (frame + 1) % noiseData.length;
            if (noiseData[frame]) {
                ctx.putImageData(noiseData[frame], 0, 0);
            }
            animationFrameId = window.requestAnimationFrame(loop);
        };

        const handleResize = () => {
            w = window.innerWidth;
            h = window.innerHeight;
            canvas.width = w;
            canvas.height = h;
            noiseData = [];
            createNoise();
        };

        createNoise();
        loop();

        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
            window.cancelAnimationFrame(animationFrameId);
        };

    }, []);

    return (
        <canvas
            ref={canvasRef}
            className="fixed top-0 left-0 w-full h-full z-50 opacity-10 pointer-events-none"
        />
    );
};
