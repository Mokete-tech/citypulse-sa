import React, { useEffect, useRef } from 'react';
import QRCodeLib from 'qrcode';
import { cn } from '@/lib/utils';

interface QRCodeProps {
  value: string;
  size?: number;
  bgColor?: string;
  fgColor?: string;
  level?: 'L' | 'M' | 'Q' | 'H';
  includeMargin?: boolean;
  className?: string;
  imageSettings?: {
    src: string;
    height: number;
    width: number;
    excavate?: boolean;
  };
}

/**
 * QR Code component for generating QR codes
 */
export function QRCode({
  value,
  size = 128,
  bgColor = '#FFFFFF',
  fgColor = '#000000',
  level = 'M',
  includeMargin = false,
  className,
  imageSettings,
}: QRCodeProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    const generateQRCode = async () => {
      try {
        // Generate QR code on canvas
        await QRCodeLib.toCanvas(canvasRef.current, value, {
          width: size,
          margin: includeMargin ? 4 : 0,
          color: {
            dark: fgColor,
            light: bgColor,
          },
          errorCorrectionLevel: level,
        });

        // If image settings are provided, add the image to the center of the QR code
        if (imageSettings && canvasRef.current) {
          const ctx = canvasRef.current.getContext('2d');
          if (ctx) {
            // Create image element
            const img = new Image();
            img.src = imageSettings.src;
            imgRef.current = img;

            img.onload = () => {
              // Calculate position to center the image
              const x = (size - imageSettings.width) / 2;
              const y = (size - imageSettings.height) / 2;

              // Clear the center area if excavate is true
              if (imageSettings.excavate) {
                ctx.fillStyle = bgColor;
                ctx.fillRect(x, y, imageSettings.width, imageSettings.height);
              }

              // Draw the image
              ctx.drawImage(
                img,
                x,
                y,
                imageSettings.width,
                imageSettings.height
              );
            };
          }
        }
      } catch (error) {
        console.error('Error generating QR code:', error);
      }
    };

    generateQRCode();

    // Cleanup function
    return () => {
      if (imgRef.current) {
        imgRef.current.onload = null;
        imgRef.current = null;
      }
    };
  }, [value, size, bgColor, fgColor, level, includeMargin, imageSettings]);

  return (
    <canvas
      ref={canvasRef}
      className={cn('rounded-md', className)}
      width={size}
      height={size}
    />
  );
}

export default QRCode;
