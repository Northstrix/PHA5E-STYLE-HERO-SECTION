// components/ImageGrid.tsx
import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { gsap } from "gsap";

interface ImageGridProps {
  hoveredImage: number | null;
  setHoveredImage: (index: number | null) => void;
  mousePosition: { x: number; y: number };
  setMousePosition: (position: { x: number; y: number }) => void;
}

interface ImageData {
  src: string;
  title: string;
  description: string;
}

const imageData: ImageData[] = [
  { src: "/Midbar.jpg", title: "MIDBAR", description: "DIY Hardware Data Vault" },
  { src: "/Lakhash.jpg", title: "LAKHASH", description: "Cloud storage service built with Next.js" },
  { src: "/Lantern.jpg", title: "LANTERN", description: "Addressable RGB LED strip controller." },
];

const ImageGrid: React.FC<ImageGridProps> = ({
  hoveredImage,
  setHoveredImage,
  setMousePosition,
}) => {
  const containerRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [targetPositions, setTargetPositions] = useState<{ x: number; y: number }[]>(
    imageData.map(() => ({ x: 0, y: 0 }))
  );

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
      checkImageHover(e.clientX, e.clientY);
    };

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [setMousePosition]);

  useEffect(() => {
    const animateImages = () => {
      containerRefs.current.forEach((ref, index) => {
        if (ref) {
          gsap.to(ref, {
            x: targetPositions[index].x,
            y: targetPositions[index].y,
            duration: 2,
            ease: "power2.out",
          });
        }
      });
    };

    animateImages();
  }, [targetPositions]);

  const checkImageHover = (x: number, y: number) => {
    let newHoveredIndex: number | null = null;
    containerRefs.current.forEach((ref, index) => {
      if (ref) {
        const rect = ref.getBoundingClientRect();
        if (x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom) {
          newHoveredIndex = index;
        }
      }
    });

    setHoveredImage(newHoveredIndex);
    updateTargetPositions(newHoveredIndex, x, y);
  };

  const updateTargetPositions = (hoveredIndex: number | null, cursorX: number, cursorY: number) => {
    const newTargetPositions = targetPositions.map((pos, index) => {
      if (index === hoveredIndex) {
        const containerRef = containerRefs.current[index];
        if (containerRef) {
          const rect = containerRef.getBoundingClientRect();
          const centerX = (rect.left + rect.right) / 2;
          const centerY = (rect.top + rect.bottom) / 2;

          // Increase movement range
          const maxMoveX = Math.min(window.innerWidth / 4, 100);
          const maxMoveY = Math.min(window.innerHeight / 4, 100);

          let dx = (cursorX - centerX) * 0.5; // Increase movement speed
          let dy = (cursorY - centerY) * 0.5;

          // Add bouncing effect
          if (Math.abs(dx) > maxMoveX) {
            dx = maxMoveX * Math.sign(dx) * (1 - Math.exp(-Math.abs(dx - maxMoveX) / 50));
          }
          if (Math.abs(dy) > maxMoveY) {
            dy = maxMoveY * Math.sign(dy) * (1 - Math.exp(-Math.abs(dy - maxMoveY) / 50));
          }

          return { x: dx, y: dy };
        }
      }
      return { x: 0, y: 0 };
    });
    setTargetPositions(newTargetPositions);
  };

  interface ImageComponentProps {
    image: {
      src: string;
      title: string;
      description: string;
    };
    index: number;
    hoveredImage: number | null; // Allow null for hover state
    setHoveredImage: (index: number | null) => void; // Function to set hover state
  }
  
  const ImageComponent: React.FC<ImageComponentProps> = ({ image, index, hoveredImage, setHoveredImage }) => (
    <div
      className="relative overflow-hidden"
      style={{
        width: '340px',
        height: '248px',
      }}
      onMouseEnter={() => setHoveredImage(index)} // Set hover state on mouse enter
      onMouseLeave={() => setHoveredImage(null)} // Reset hover state on mouse leave
    >
      {hoveredImage === null || hoveredImage === index ? (
        <Image
          src={image.src}
          layout="fill"
          objectFit="cover"
          alt={`Image ${index + 1}`}
        />
      ) : (
        <div className="absolute inset-0 flex justify-center items-center">
          <div className="relative" style={{ width: '340px', height: '248px' }}>
            {hoveredImage !== null && (
              <>
                {(() => {
                  const width = 340;
                  const height = 248;
                  const angle = Math.atan(height / width) * (180 / Math.PI);
                  return (
                    <>
                      <div className="absolute" style={{
                        width: `${Math.sqrt(width ** 2 + height ** 2)}px`,
                        height: '1px',
                        backgroundColor: '#616161',
                        top: '0',
                        left: '0',
                        transform: `rotate(${angle}deg)`,
                        transformOrigin: 'top left',
                        zIndex: '40'
                      }} />
                      <div className="absolute top-0 left-0 right-0 bottom-0 border border-[#616161]" />
                      <div className="absolute" style={{
                        width: `${Math.sqrt(width ** 2 + height ** 2)}px`,
                        height: '1px',
                        backgroundColor: '#616161',
                        top: '0',
                        right: '0',
                        transform: `rotate(-${angle}deg)`,
                        transformOrigin: 'top right',
                        zIndex: '40'
                      }} />
                    </>
                  );
                })()}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );

  interface TextComponentProps {
    image: {
      title: string;
      description: string;
    };
    index: number;
    hoveredImage: number | null; // Allow null for hover state
  }
  
  const TextComponent: React.FC<TextComponentProps> = ({ image, index, hoveredImage }) => (
    <div 
      className="absolute text-white"
      style={{ 
        zIndex: 40,
        width: '340px',
        bottom: '-95px', // Raised position
        left: '100%',
        opacity: hoveredImage === index ? 1 : 0,
        transition: 'opacity 0.3s ease',
        transform: 'translateX(-50%)',
        textAlign: 'left'
      }}
    >
      <h1 style={{ fontSize: '48px', fontWeight: 'bold' }}>{image.title}</h1>
      <p className="text-sm">{image.description}</p>
    </div>
  );

  return (
    <div>
      <style>
        {`
          .circular-layout {
            display: flex;
            justify-content: center;
            align-items: center;
            position: relative;
            width: 600px; /* Adjust as needed */
            height: 600px; /* Adjust as needed */
          }

          .circular-item {
            position: absolute;
            width: 340px; /* Size of the item */
            height: 210px; /* Size of the item */
            transform: translate(-50%, -50%);
          }

          .circular-item:nth-child(1) {
            top: 30%;
            left: 2%;
          }

          .circular-item:nth-child(2) {
            top: 12%;
            left: 100%;
          }

          .circular-item:nth-child(3) {
            top: 80%;
            left: 44%;
          }
        `}
      </style>

      <div className="circular-layout">
        {imageData.map((image, index) => {
          // Hardcoded links for each image
          const imageLinks = [
            "https://sourceforge.net/projects/midbar/",
            "https://sourceforge.net/projects/lakhash/",
            "https://sourceforge.net/projects/the-lantern-project/"
          ];

          return (
            <div 
              key={index}
              ref={(el) => {
                containerRefs.current[index] = el;
              }}
              className="circular-item"
              style={{
                zIndex: hoveredImage === null ? '10' : '30'
              }}
            >
              <a 
                href={imageLinks[index]} 
                target="_blank" 
                rel="noopener noreferrer"
                onMouseEnter={() => setHoveredImage(index)} // Optional hover state management
              >
                <ImageComponent 
                  image={image} 
                  index={index} 
                  hoveredImage={hoveredImage} 
                  setHoveredImage={setHoveredImage} 
                />
              </a>
              <TextComponent 
                image={image} 
                index={index} 
                hoveredImage={hoveredImage} 
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ImageGrid;