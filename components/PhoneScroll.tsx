"use client";

import { useEffect, useRef, useState } from "react";
import { useScroll, useMotionValueEvent, useTransform, motion } from "framer-motion";

const FRAME_COUNT = 192;

interface PhoneScrollProps {
    immersive: boolean;
    onReset: () => void;
}

export default function PhoneScroll({ immersive, onReset }: PhoneScrollProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [images, setImages] = useState<HTMLImageElement[]>([]);
    const [imagesLoaded, setImagesLoaded] = useState(false);
    const { scrollYProgress } = useScroll();

    // Bounds state
    const [imgBounds, setImgBounds] = useState({ x: 0, y: 0, w: 0, h: 0 });

    // Helper to Calculate Bounds (Only calls state if changed significantly)
    const updateBounds = (canvas: HTMLCanvasElement, img: HTMLImageElement) => {
        const canvasWidth = canvas.width;
        const canvasHeight = canvas.height;
        const imgWidth = img.width;
        const imgHeight = img.height;

        const scale = Math.min(canvasWidth / imgWidth, canvasHeight / imgHeight);
        const x = (canvasWidth / 2) - (imgWidth / 2) * scale;
        const y = (canvasHeight / 2) - (imgHeight / 2) * scale;
        const w = imgWidth * scale;
        const h = imgHeight * scale;

        setImgBounds(prev => {
            if (Math.abs(x - prev.x) > 1 || Math.abs(w - prev.w) > 1) {
                return { x, y, w, h };
            }
            return prev;
        });

        return { x, y, w, h, scale };
    };

    // Preload images
    useEffect(() => {
        let loadedCount = 0;
        const imgArray: HTMLImageElement[] = [];

        for (let i = 0; i < FRAME_COUNT; i++) {
            const img = new Image();
            // Adjust path if needed based on actual file location in public/frames
            img.src = `/frames/frame_${i}_delay-0.04s.webp`;
            img.onload = () => {
                // console.log(`Loaded frame ${i}`);
                loadedCount++;
                if (loadedCount === FRAME_COUNT) {
                    setImagesLoaded(true);
                }
            };
            imgArray.push(img);
        }
        setImages(imgArray);
    }, []);


    // Draw frame based on scroll
    const renderFrame = (index: number) => {
        const canvas = canvasRef.current;
        if (!canvas || !images[index]) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const img = images[index];

        const canvasWidth = canvas.width;
        const canvasHeight = canvas.height;
        const imgWidth = img.width;
        const imgHeight = img.height;

        const scale = Math.min(canvasWidth / imgWidth, canvasHeight / imgHeight);
        const x = (canvasWidth / 2) - (imgWidth / 2) * scale;
        const y = (canvasHeight / 2) - (imgHeight / 2) * scale;

        // NOTE: We do NOT update React state here anymore to avoid lag
        // Bounds are handled by the resize listener or initial load

        ctx.clearRect(0, 0, canvasWidth, canvasHeight);
        ctx.drawImage(img, x, y, imgWidth * scale, imgHeight * scale);
    };

    // Initial Bounds Calculation (Once images load)
    useEffect(() => {
        if (imagesLoaded && images.length > 0 && canvasRef.current) {
            updateBounds(canvasRef.current, images[0]);
            renderFrame(0);
        }
    }, [imagesLoaded, images]);

    // Scroll Logic with Reassembly (0 -> 0.85 -> 1.0)
    useMotionValueEvent(scrollYProgress, "change", (latest) => {
        if (!imagesLoaded) return;
        if (immersive) return; // Handled by immersive effect

        let frameIndex = 0;
        if (latest <= 0.85) {
            // Explode: 0 -> 0.85 maps to 0 -> 79
            frameIndex = Math.floor((latest / 0.85) * (FRAME_COUNT - 1));
        } else {
            // Reassemble: 0.85 -> 1.0 maps to 79 -> 0
            const reassemblyProgress = (latest - 0.85) / 0.15;
            frameIndex = Math.floor((1 - reassemblyProgress) * (FRAME_COUNT - 1));
        }

        frameIndex = Math.max(0, Math.min(FRAME_COUNT - 1, frameIndex));
        requestAnimationFrame(() => renderFrame(frameIndex));
    });

    // Immersive Mode Trigger
    useEffect(() => {
        if (immersive && imagesLoaded) {
            // Force frame 0 (Assembled)
            renderFrame(0);
        }
    }, [immersive, imagesLoaded]);

    // Handle Resize
    useEffect(() => {
        const handleResize = () => {
            if (canvasRef.current && images.length > 0) {
                canvasRef.current.width = window.innerWidth;
                canvasRef.current.height = window.innerHeight;

                // Recalculate bounds on resize
                updateBounds(canvasRef.current, images[0]);

                // Redraw current frame
                if (imagesLoaded) {
                    const latest = scrollYProgress.get();
                    let frameIndex = 0;
                    if (latest <= 0.85) {
                        frameIndex = Math.floor((latest / 0.85) * (FRAME_COUNT - 1));
                    } else {
                        const reassemblyProgress = (latest - 0.85) / 0.15;
                        frameIndex = Math.floor((1 - reassemblyProgress) * (FRAME_COUNT - 1));
                    }
                    renderFrame(frameIndex);
                }
            }
        };

        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, [imagesLoaded, images]);

    // Effect Opacity Transforms
    // Camera: 25-40%
    const cameraOpacity = useTransform(scrollYProgress, [0.25, 0.3, 0.35, 0.40], [0, 0.4, 0.4, 0]);

    // Battery: 45-65%
    const batteryOpacity = useTransform(scrollYProgress, [0.45, 0.5, 0.6, 0.65], [0, 0.2, 0.2, 0]);

    // Chipset: 70-85%
    const chipOpacity = useTransform(scrollYProgress, [0.70, 0.75, 0.8, 0.85], [0, 0.6, 0.6, 0]);
    const chipScale = useTransform(scrollYProgress, [0.70, 0.77], [0.9, 1.1]);

    return (
        <motion.div
            className="sticky top-0 h-screen w-full flex items-center justify-center overflow-hidden bg-[#050505]"
            animate={{ scale: immersive ? 1.1 : 1 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
        >
            <canvas
                ref={canvasRef}
                className="block"
                width={1920}
                height={1080}
            />

            {/* Overlays Container - Matches Image Size */}
            <div
                className="absolute pointer-events-none"
                style={{
                    left: imgBounds.x,
                    top: imgBounds.y,
                    width: imgBounds.w,
                    height: imgBounds.h,
                }}
            >
                {/* Visual Accents (Disabled in Immersive Mode) */}
                {!immersive && (
                    <>
                        <motion.div
                            style={{ opacity: cameraOpacity }}
                            className="absolute top-[15%] left-1/2 -translate-x-1/2 w-[20%] h-[10%] bg-radial-gradient-camera blur-xl"
                        >
                            <div className="w-full h-full bg-cyan-500/30 rounded-full blur-2xl mix-blend-screen" />
                        </motion.div>

                        <motion.div
                            style={{ opacity: batteryOpacity }}
                            className="absolute top-[40%] left-[25%] w-[50%] h-[35%]"
                        >
                            <div className="w-full h-full bg-gradient-to-tr from-orange-500/10 via-amber-500/10 to-transparent rounded-lg blur-xl filter" />
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-amber-400/20 to-transparent w-[200%] h-full animate-heat-flow opacity-30 mix-blend-overlay" />
                        </motion.div>

                        <motion.div
                            style={{ opacity: chipOpacity, scale: chipScale }}
                            className="absolute top-[28%] left-1/2 -translate-x-1/2 w-[15%] h-[8%]"
                        >
                            <div className="absolute inset-0 border border-white/40 rounded-sm shadow-[0_0_15px_rgba(255,255,255,0.3)] animate-pulse-slow" />
                            <div className="absolute inset-0 bg-white/10 blur-md rounded-full" />
                        </motion.div>
                    </>
                )}

                {/* Immersive Mode Hotspots */}
                {immersive && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5, duration: 0.5 }}
                        className="absolute inset-0 pointer-events-auto"
                    >
                        {/* Camera Hotspot */}
                        <div className="absolute top-[15%] left-1/2 -translate-x-1/2 group cursor-pointer">
                            <div className="w-8 h-8 rounded-full border border-white/60 bg-white/10 animate-pulse flex items-center justify-center">
                                <div className="w-2 h-2 bg-white rounded-full" />
                            </div>
                            <div className="absolute left-10 top-0 w-48 opacity-0 group-hover:opacity-100 transition-opacity bg-black/80 backdrop-blur-md p-3 rounded-lg border border-white/10 shadow-xl">
                                <h4 className="text-white text-sm font-bold">64MP AI Quad Camera</h4>
                                <p className="text-white/60 text-xs">Professional grade sensor array.</p>
                            </div>
                        </div>

                        {/* Chipset Hotspot */}
                        <div className="absolute top-[30%] left-[45%] group cursor-pointer">
                            <div className="w-8 h-8 rounded-full border border-white/60 bg-white/10 animate-pulse flex items-center justify-center">
                                <div className="w-2 h-2 bg-white rounded-full" />
                            </div>
                            <div className="absolute left-10 top-0 w-48 opacity-0 group-hover:opacity-100 transition-opacity bg-black/80 backdrop-blur-md p-3 rounded-lg border border-white/10 shadow-xl z-10">
                                <h4 className="text-white text-sm font-bold">Helio G90T</h4>
                                <p className="text-white/60 text-xs">Gaming processor with LiquidCool technology.</p>
                            </div>
                        </div>

                        {/* Battery Hotspot */}
                        <div className="absolute bottom-[20%] left-[55%] group cursor-pointer">
                            <div className="w-8 h-8 rounded-full border border-white/60 bg-white/10 animate-pulse flex items-center justify-center">
                                <div className="w-2 h-2 bg-white rounded-full" />
                            </div>
                            <div className="absolute right-10 top-0 w-48 opacity-0 group-hover:opacity-100 transition-opacity bg-black/80 backdrop-blur-md p-3 rounded-lg border border-white/10 shadow-xl text-right">
                                <h4 className="text-white text-sm font-bold">4500mAh Battery</h4>
                                <p className="text-white/60 text-xs">2-day battery life with 18W fast charge.</p>
                            </div>
                        </div>
                    </motion.div>
                )}
            </div>

            {!imagesLoaded && (
                <div className="absolute inset-0 flex items-center justify-center bg-[#050505] z-50">
                    <div className="w-8 h-8 border-t-2 border-white/50 rounded-full animate-spin"></div>
                </div>
            )}

            {immersive && (
                <button
                    onClick={onReset}
                    className="fixed bottom-10 left-1/2 -translate-x-1/2 bg-white/10 hover:bg-white/20 text-white px-6 py-2 rounded-full backdrop-blur-md border border-white/10 pointer-events-auto transition-colors z-50"
                >
                    Exit Experience
                </button>
            )}
        </motion.div>
    );
}
