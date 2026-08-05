"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { motion, AnimatePresence, PanInfo } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { fluidLayout } from "@/lib/motion";

interface ProductGalleryProps {
  images?: string[];
  productName: string;
}

export function ProductGallery({ images, productName }: ProductGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovering, setIsHovering] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });
  const [direction, setDirection] = useState(0); // 1 for right, -1 for left

  // Fallback if no images are provided
  const galleryImages = images && images.length > 0 
    ? images 
    : ["/images/placeholder-main.jpg"]; // Using a generic placeholder array if empty

  const handleNext = useCallback(() => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % galleryImages.length);
  }, [galleryImages.length]);

  const handlePrev = useCallback(() => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + galleryImages.length) % galleryImages.length);
  }, [galleryImages.length]);

  const swipeConfidenceThreshold = 10000;
  const swipePower = (offset: number, velocity: number) => {
    return Math.abs(offset) * velocity;
  };

  const handleDragEnd = (e: MouseEvent | TouchEvent | PointerEvent, { offset, velocity }: PanInfo) => {
    const swipe = swipePower(offset.x, velocity.x);

    if (swipe < -swipeConfidenceThreshold) {
      handleNext();
    } else if (swipe > swipeConfidenceThreshold) {
      handlePrev();
    }
  };

  const variants = {
    enter: (direction: number) => {
      return {
        x: direction > 0 ? 300 : -300,
        opacity: 0
      };
    },
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1
    },
    exit: (direction: number) => {
      return {
        zIndex: 0,
        x: direction < 0 ? 300 : -300,
        opacity: 0
      };
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") handleNext();
      if (e.key === "ArrowLeft") handlePrev();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleNext, handlePrev]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isHovering) return;
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setMousePos({ x, y });
  };

  return (
    <div className="flex flex-col gap-4 select-none">
      {/* Main Featured Image Container */}
      <div 
        className="relative w-full bg-brand-light rounded-2xl overflow-hidden group cursor-crosshair border border-brand-gray/10"
        style={{ aspectRatio: '16/9' }}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => {
          setIsHovering(false);
          setMousePos({ x: 50, y: 50 }); // Reset on leave
        }}
        onMouseMove={handleMouseMove}
      >
        <AnimatePresence initial={false} custom={direction} mode="popLayout">
          <motion.div
            key={currentIndex}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={fluidLayout}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={1}
            onDragEnd={handleDragEnd}
            className="absolute inset-0 flex items-center justify-center bg-[#F6F3EC] cursor-grab active:cursor-grabbing"
          >
            {/* We don't have actual images yet, so we build a premium placeholder that supports zoom */}
            <div 
              className="relative w-full h-full flex items-center justify-center transition-transform duration-200 ease-out"
              style={{
                transform: isHovering ? `scale(1.5)` : "scale(1)",
                transformOrigin: `${mousePos.x}% ${mousePos.y}%`
              }}
            >
              {galleryImages[currentIndex].includes("placeholder") ? (
                <div className="flex flex-col items-center justify-center text-brand-gray/30">
                  <div className="w-24 h-24 rounded-full bg-white/50 flex items-center justify-center mb-4 shadow-sm backdrop-blur-sm border border-white/20">
                    <span className="font-heading font-medium text-4xl text-brand-gray/40">SK</span>
                  </div>
                  <span className="text-xs uppercase tracking-[0.2em] font-medium opacity-50">
                    {productName} - View {currentIndex + 1}
                  </span>
                </div>
              ) : (
                <Image
                  src={galleryImages[currentIndex]}
                  alt={`${productName} - Image ${currentIndex + 1}`}
                  fill
                  className="object-cover"
                  priority={currentIndex === 0}
                />
              )}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Navigation Arrows (Desktop overlay) */}
        {galleryImages.length > 1 && (
          <>
            <button 
              onClick={(e) => { e.stopPropagation(); handlePrev(); }}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 backdrop-blur-md flex items-center justify-center text-brand-blue opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white hover:shadow-md"
              aria-label="Previous Image"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button 
              onClick={(e) => { e.stopPropagation(); handleNext(); }}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 backdrop-blur-md flex items-center justify-center text-brand-blue opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white hover:shadow-md"
              aria-label="Next Image"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </>
        )}
      </div>

      {/* Thumbnail Strip */}
      {galleryImages.length > 1 && (
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
          {galleryImages.map((src, idx) => (
            <motion.button
              key={idx}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                setDirection(idx > currentIndex ? 1 : -1);
                setCurrentIndex(idx);
              }}
              className={`relative w-20 h-24 shrink-0 rounded-lg overflow-hidden border-2 transition-all duration-300 ${
                currentIndex === idx 
                  ? "border-brand-green shadow-sm" 
                  : "border-transparent opacity-60 hover:opacity-100"
              }`}
            >
              <div className="absolute inset-0 bg-[#F6F3EC] flex items-center justify-center">
                {src.includes("placeholder") ? (
                   <span className="font-heading font-medium text-sm text-brand-gray/30">SK</span>
                ) : (
                  <Image
                    src={src}
                    alt={`${productName} thumbnail ${idx + 1}`}
                    fill
                    className="object-cover"
                  />
                )}
              </div>
            </motion.button>
          ))}
        </div>
      )}
    </div>
  );
}
