# Redmi Note 8 Pro Scrollytelling Landing Page

A high-end, interactive scrollytelling experience showcasing the internal engineering of the Redmi Note 8 Pro. This project uses a sticky canvas animation driven by scroll position to "explode" and "reassemble" the device, highlighting key features like the 64MP Camera, Battery, and LiquidCool technology.

## 🌟 Features

*   **Cinematic Scrollytelling**: Smooth, scroll-linked animation of the phone dissembling into its core components.
*   **Sticky Canvas Rendering**: High-performance `<canvas>` rendering of 80 frames synced perfectly to scroll progress.
*   **Ping-Pong Animation Logic**:
    *   **0% - 85%**: Phone explodes/disassembles.
    *   **85% - 100%**: Phone elegantly reassembles into its final form.
*   **Visual Accents**:
    *   **Camera Lens Glow**: Subtle cyan/emerald glow when the 64MP camera is revealed.
    *   **Battery Heat-Flow**: Amber thermal gradiants visualizing heat dissipation during the battery section.
    *   **Chipset Spotlight**: Pulsing rim light on the Helio G90T processor.
*   **Immersive Mode**:
    *   "Experience Now" CTA triggers a seamless transition.
    *   Phone zooms in, UI fades out.
    *   Interactive hotspots reveal detailed specs on hover.
*   **Responsive Design**: "Contain" logic ensures the phone scales perfectly on all screen sizes.

## 🛠️ Tech Stack

*   **Framework**: [Next.js 14](https://nextjs.org/) (App Router)
*   **Styling**: [Tailwind CSS](https://tailwindcss.com/)
*   **Animation**: [Framer Motion](https://www.framer.com/motion/)
*   **Key Hooks**: `useScroll`, `useTransform`, `useMotionValueEvent`
*   **Asset Type**: WebP Image Sequence

## 🚀 Getting Started

### 1. Installation

Clone the repository and install dependencies:

```bash
npm install
```

### 2. Asset Setup

The project relies on a sequence of 80 WebP images in `public/frames`. If you need to re-process the source images (from `Frames` directory), run the included Python script:

```bash
python3 process_images.py
```
*This script renames and moves files from `Frames/*.jpg` to `public/frames/*.webp` (ensure logic matches your source).*

### 3. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the experience.

## 📂 Project Structure

*   `app/page.tsx`: Main page layout. Handles the text overlays and "Immersive Mode" state.
*   `components/PhoneScroll.tsx`: The core component.
    *   Manages the HTML5 Canvas.
    *   Handles image preloading.
    *   Maps scroll progress to frame index (Explosion & Reassembly logic).
    *   Renders the "Visual Effects Layer" (Glows, Heat flow).
    *   Renders the "Immersive overlay" (Hotspots).
*   `app/globals.css`: Global styles, custom animations (`heat-flow`, `pulse-slow`), and base colors (`#050505`).
*   `process_images.py`: Utility script to organize frame assets.

## 🎨 Visual Direction

*   **Background**: `#050505` (Deep Gamma Green/Black)
*   **Typography**: Inter / Sans-serif, clean and tracking-tight.
*   **Lighting**: Cool emerald rim lighting with cyan accents.

---
Built as a demonstration of advanced frontend engineering and creative web design.
