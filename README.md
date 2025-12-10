# SweatSocial - Premium Interactive Landing Page

A highly interactive, conversion-focused landing page for SweatSocial - India's first experimental fitness platform that helps users connect, stay fit, and engage with the community through workouts and challenges.

## Features

### Navigation Bar
- Transparent navbar with glassmorphism effect
- Sticky navigation that appears on scroll
- SweatSocial logo integration
- Smooth scroll to sections
- Mobile responsive menu
- Quick access to Instagram

### Hero Section
- Premium animated background with gradient orbs
- Sophisticated color palette
- Cursor-responsive effects
- Smooth scroll animations
- Micro-interactions on CTA buttons

### Brand Promotion Section
- Large logo display
- Company statistics (5K+ members, 150+ groups, etc.)
- Key features showcase with icons
- Contact information (email, phone, Instagram)
- Direct CTA buttons

### Interactive Story Scroll
- Parallax storytelling with scroll-triggered animations
- Three-stage journey visualization
- Smooth fade-in effects and transitions

### Feature Showcase
- 3D flip cards with hover effects
- Interactive feature demonstrations
- Detailed benefit descriptions on card flip

### Community Section
- Live animated stat counters
- Real-time activity feed simulation
- Animated trust badges and social proof

### App Preview
- Phone mockup with rotating screen demos
- Auto-scroll app screenshots
- Smooth transitions between screens
- App store download buttons

### Testimonials Carousel
- Auto-scrolling testimonials
- Manual navigation controls
- Pause on hover functionality
- Trust badges and ratings

### Blog Section
- Featured blog post layout
- 6 latest articles from sweatsocial.club/blog
- Premium card design with glassmorphism
- Category badges
- Link to full blog

### Final CTA
- Animated gradient background
- Email signup form with validation
- App download buttons
- Social proof elements

### Footer
- SweatSocial logo
- Contact information (email, phone)
- Animated social media icons (Instagram, Twitter, Facebook, LinkedIn, YouTube)
- Newsletter subscription
- Comprehensive link sections
- Hover effects on all interactive elements

## Tech Stack

- **React 18** - UI framework
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Animation library
- **react-intersection-observer** - Scroll-based animations
- **react-countup** - Animated number counters

## Premium Design System

### Colors
- **Primary Purple**: #9b7eff, #7c5ce8, #6642c8, #5538a6, #442d85
- **Accent Rose**: #f43f5e, #e11d48, #be123c
- **Accent Gold**: #eab308, #ca8a04, #a16207
- **Background**: Deep blacks (gray-950, gray-900)
- Sophisticated gradient combinations

### Typography
- **Headings**: Kumbh Sans (Bold, 600-800)
- **Body**: Nunito Sans (400-700)
- **Display**: Plus Jakarta Sans (400-800)

## Getting Started

### Installation

```bash
# Install dependencies
npm install
```

### Development

```bash
# Start development server
npm run dev
```

The site will be available at `http://localhost:3000`

### Build

```bash
# Build for production
npm run build
```

### Preview Production Build

```bash
# Preview production build
npm run preview
```

## Deployment

### Deploy to Vercel (Recommended)

This project is configured for zero-config deployment to Vercel.

**Quick Deploy:**
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel --prod
```

**Or via Vercel Dashboard:**
1. Push code to GitHub/GitLab/Bitbucket
2. Import project on [vercel.com](https://vercel.com)
3. Deploy automatically

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed instructions.

## Project Structure

```
sweat-social-website/
├── src/
│   ├── components/
│   │   ├── Navbar.jsx             # Navigation with logo
│   │   ├── HeroSection.jsx        # Hero with animated background
│   │   ├── BrandSection.jsx       # Brand promotion & stats
│   │   ├── StoryScroll.jsx        # Parallax story section
│   │   ├── FeatureShowcase.jsx    # 3D flip cards
│   │   ├── CommunitySection.jsx   # Stats and live feed
│   │   ├── AppPreview.jsx         # Phone mockups
│   │   ├── Testimonials.jsx       # Carousel
│   │   ├── BlogSection.jsx        # Blog posts grid
│   │   ├── FinalCTA.jsx           # Email signup
│   │   ├── Footer.jsx             # Footer with contact info
│   │   ├── ScrollProgress.jsx     # Progress bar
│   │   └── ScrollToTop.jsx        # Scroll to top button
│   ├── App.jsx                    # Main app component
│   ├── main.jsx                   # App entry point
│   └── index.css                  # Global styles
├── index.html                     # HTML template
├── tailwind.config.js             # Tailwind configuration
├── vite.config.js                 # Vite configuration
└── package.json                   # Dependencies
```

## Key Features Implementation

### Scroll-Triggered Animations
Uses `react-intersection-observer` to trigger animations when elements enter viewport.

### Smooth Scrolling
Custom scroll behavior with smooth transitions between sections.

### Responsive Design
Mobile-first approach with breakpoints for tablet and desktop.

### Performance Optimizations
- Lazy loading of images
- Optimized animations with Framer Motion
- Minimal bundle size with Vite

## Conversion Strategy

1. **Scroll Progress Bar** - Shows user journey completion
2. **Multiple CTAs** - Strategic placement throughout the page
3. **Social Proof** - Live stats, testimonials, and trust badges
4. **Interactive Elements** - Hover effects and micro-interactions
5. **Clear Value Proposition** - Benefits highlighted at each section

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contact

- **Email**: hello@sweatsocial.club
- **Phone**: +91-9606464667
- **Instagram**: [@sweatsocial.club](https://www.instagram.com/sweatsocial.club/)
- **Website**: [sweatsocial.club](https://sweatsocial.club)

## License

© 2024 SweatSocial. All rights reserved.

## Credits

Built with passion and sweat for India's first experimental fitness platform.
