# AI Yoga Pose Estimation System

A real-time yoga pose analysis and feedback system built with Next.js, TypeScript, and Tailwind CSS.

## Features

- **Real-time Pose Detection**: AI-powered pose analysis using webcam feed
- **Pose Comparison**: Side-by-side comparison with reference poses
- **Progress Tracking**: Visual indicators for completed and active poses
- **Interactive Instructions**: Collapsible instruction panels with audio support
- **Performance Metrics**: Real-time match percentage and timing
- **Responsive Design**: Modern, clean UI optimized for different screen sizes

## UI Components

### 1. Pose Navigation
- Top navigation bar with yoga pose selection
- Visual indicators for completed (✓) and active poses
- Analytics & Settings button

### 2. Pose Details Bar
- Current pose name (e.g., "Surya Namaskar Pose 2")
- Performance metrics (sets, reps, timing, match percentage)
- Media controls (play/pause, gallery, frame)
- Difficulty level indicator

### 3. Pose Viewer
- **Left Panel**: AI Analyzed Pose with webcam feed and skeleton overlay
- **Right Panel**: Reference pose image for comparison
- Real-time AI timer display

### 4. Instructions Panel
- Collapsible instruction text
- Audio playback controls
- Detailed pose guidance

## Technology Stack

- **Frontend**: Next.js 15.5.0 with React 19.1.0
- **Styling**: Tailwind CSS 4.0
- **Language**: TypeScript
- **Architecture**: Component-based with TypeScript interfaces

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Run the development server:
   ```bash
   npm run dev
   ```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

```
src/
├── app/
│   ├── layout.tsx          # Root layout
│   ├── page.tsx           # Main application page
│   └── globals.css        # Global styles
└── components/
    ├── PoseNavigation.tsx # Top navigation component
    ├── PoseDetails.tsx    # Pose information bar
    ├── PoseViewer.tsx     # Main pose display area
    └── Instructions.tsx   # Instructions panel
```

## Future Enhancements

- Integration with MediaPipe for real-time pose detection
- Webcam access and video stream processing
- Firebase integration for data persistence
- Advanced pose comparison algorithms
- User progress tracking and analytics

## Development Notes

This is an MVP version focusing on the UI/UX. The actual AI pose detection functionality will be implemented in future iterations using MediaPipe and webcam integration.
