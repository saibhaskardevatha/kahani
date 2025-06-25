"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { SignInButton, SignedIn, SignedOut } from '@clerk/nextjs'
import Link from "next/link";

const galleryImages = [
  { src: "/ss1.png", alt: "Kahani App Screenshot 1" },
  { src: "/ss2.png", alt: "Kahani App Screenshot 2" },
  { src: "/ss3.png", alt: "Kahani App Screenshot 3" },
  { src: "/ss4.png", alt: "Kahani App Screenshot 4" },
  { src: "/ss5.png", alt: "Kahani App Screenshot 5" },
];

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-white font-[family-name:var(--font-geist-sans)]">
      <main className="flex-1 flex flex-col items-center justify-center px-4">
        <div className="w-full max-w-xl rounded-3xl bg-white/80  py-16 px-8 flex flex-col items-center gap-6">
          <Image src="/logo.png" alt="Kahani Logo" width={64} height={64} className="w-16 h-16 mb-4" />
          <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 text-center leading-tight tracking-tight">Immersive Audio Stories <span className="text-[#D94F3A]">for Bharat</span></h1>
          <p className="text-xl text-gray-700 text-center max-w-lg">Create, listen, and share magical stories in your language. Powered by AI, voiced by you.</p>
          <SignedOut>
            <SignInButton mode="modal" forceRedirectUrl="/chat">
              <button className="mt-2 bg-[#D94F3A] text-white font-bold px-10 py-4 rounded-full shadow-xl hover:bg-[#b63b28] transition-all text-xl hover:cursor-pointer" >
                Try it now!
              </button>
            </SignInButton>
          </SignedOut>
          <SignedIn>
            <Link href="/chat">
              <button className="mt-2 bg-[#D94F3A] text-white font-bold px-10 py-4 rounded-full shadow-xl hover:bg-[#b63b28] transition-all text-xl hover:cursor-pointer" >
                Try it now!
              </button>
            </Link>
          </SignedIn>
        </div>
      </main>

      {/* Modern Embedded Gallery Section */}
      <section className="w-full flex flex-col items-center mt-16">
        <GalleryWithModal images={galleryImages} />
      </section>
    </div>
  );
}

function GalleryWithModal({ images }: { images: { src: string; alt: string }[] }) {
  const containerRef = useRef<HTMLDivElement>(null);
  
  const [expandedImage, setExpandedImage] = useState<null | { src: string; alt: string }>(null);

  // Continuous auto-scroll logic
  useEffect(() => {
    const container = containerRef.current;
    if (!container || expandedImage) return;

    let raf: number;
    const speed = 1; // px per frame ~60px/s at 60fps

    const loop = () => {
      container.scrollLeft += speed;
      if (container.scrollLeft >= container.scrollWidth - container.clientWidth) {
        container.scrollLeft = 0; // reset for infinite loop
      }
      raf = requestAnimationFrame(loop);
    };

    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [expandedImage]);



  // Modal close logic
  useEffect(() => {
    if (!expandedImage) return;
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") setExpandedImage(null);
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [expandedImage]);

  // Collage effect helpers
  const collageTransforms = [
    "rotate-2 -translate-y-3 z-10",
    "-rotate-2 translate-y-2 z-20",
    "rotate-1 -translate-y-1 z-0",
    "-rotate-1 translate-y-3 z-10",
    "rotate-3 -translate-y-2 z-20",
  ];

  return (
    <>
      <div
        ref={containerRef}
        className="w-full max-w-5xl flex overflow-x-hidden gap-8 py-6 px-2 scrollbar-hide"
        style={{ pointerEvents: expandedImage ? "none" : "auto" }}
      >
        {images.map((img, idx) => (
          <div
            key={img.src}
            className={`min-w-[350px] snap-center rounded-3xl bg-white/70 backdrop-blur-md shadow-lg p-2 hover:scale-105 transition-transform cursor-pointer ${collageTransforms[idx % collageTransforms.length]}`}
            onClick={() => setExpandedImage(img)}
          >
            <Image src={img.src} alt={img.alt} width={350} height={200} className="rounded-2xl w-full" />
          </div>
        ))}
      </div>
      {/* Modal */}
      {expandedImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
          onClick={() => setExpandedImage(null)}
        >
          <Image
            src={expandedImage.src}
            alt={expandedImage.alt}
            width={900}
            height={600}
            className="max-w-[90vw] max-h-[85vh] rounded-3xl shadow-2xl border-4 border-white"
            onClick={(e)=>e.stopPropagation()}
          />
        </div>
      )}
    </>
  );
}


