# Design Guidelines for Startup Validation Tool

## Design Approach
**Selected Approach**: Reference-Based (Marketing/Landing)  
**Primary References**: Stripe, Notion, Linear (landing pages)  
**Justification**: Conversion-focused tool requiring vibrant "highlighter" theme with energetic SaaS aesthetics for startup entrepreneurs

## Core Design Elements

### A. Color Palette
**Highlighter Theme** (bright, energetic):
- **Primary Highlighters**: 
  - Electric Blue: 217 100% 65%
  - Neon Green: 142 84% 55% 
  - Hot Pink: 330 85% 65%
  - Bright Orange: 25 95% 60%
- **Background**: 220 6% 8% (dark) / 0 0% 98% (light)
- **Surface**: 220 8% 12% (dark) / 0 0% 100% (light)
- **Text Primary**: 210 20% 98% (dark) / 222 84% 8% (light)
- **Text Secondary**: 215 16% 70% (dark) / 215 16% 40% (light)

**Strategic Color Usage**:
- CTAs use Electric Blue with high contrast
- Success states use Neon Green
- Feature highlights use Hot Pink accents
- Warning/urgency uses Bright Orange

### B. Typography
- **Display Font**: Inter 700/800 for headlines (conversion-focused weight)
- **Body Font**: Inter 400/500 for readability
- **CTA Text**: Inter 600 for button text
- **Metrics**: JetBrains Mono 500 for data emphasis

### C. Layout System
**Mobile-First Spacing**: 4, 6, 8, 12, 16, 20, 24
- Hero sections: py-20, px-6
- Feature sections: py-16, px-6  
- Card components: p-6, gap-8
- CTA sections: py-12

### D. Landing Page Sections (Maximum 4 sections)

**1. Hero Section** (Single viewport):
- Bold headline with highlighter text effects
- Subheadline explaining core value
- Primary CTA (Electric Blue) + Secondary CTA (outline)
- Trust indicators (customer logos, testimonials)

**2. Core Value Proposition** (Problem/Solution):
- Split layout: Problem (left) vs Solution (right)
- Pain point cards with Hot Pink accents
- Solution benefits with Neon Green highlights
- Embedded demo preview

**3. Social Proof + Features**:
- Customer testimonials with profile images
- 3-column feature grid with highlighter icons
- Usage statistics with animated counters
- Feature comparison table

**4. Final CTA Section**:
- Urgency-driven headline with Bright Orange accents
- Multiple CTA variations (free trial, demo request)
- Risk-free guarantees and trust badges
- Footer with minimal links

### E. Component Library

**CTAs**: 
- Primary: Electric Blue background, white text, shadow-lg
- Secondary: Outline with Electric Blue border
- Urgent: Bright Orange with pulsing animation

**Cards**: 
- Elevated with shadow-xl
- Rounded corners (rounded-xl)
- Highlighter accent borders on hover

**Data Displays**:
- Metric cards with large numbers
- Progress bars with gradient fills
- Chart overlays with highlighter themes

**Interactive Elements**:
- Hover effects with color shifts
- Scroll-triggered animations
- Progressive disclosure patterns

### F. Visual Hierarchy
- **Hero Headlines**: text-5xl/6xl font-bold with highlighter effects
- **Section Headers**: text-3xl font-bold 
- **Feature Titles**: text-xl font-semibold
- **Body Text**: text-lg for conversion copy
- **CTA Text**: text-lg font-semibold

### G. Mobile Responsiveness
- Stack sections vertically on mobile
- Larger touch targets (min 44px)
- Simplified navigation drawer
- Full-width CTAs on mobile
- Optimized font sizes (base text-base, headings scale down)

## Images
**Hero Section**: Large hero image showcasing dashboard interface with gradient overlay (colors: 217 100% 65% to 330 85% 65%)

**Feature Sections**: 
- Product screenshots with highlighter UI elements
- Abstract geometric backgrounds with gradient treatments
- Customer avatar photos for testimonials
- Icon illustrations using highlighter color scheme

**Visual Treatments**:
- Gradient overlays on hero backgrounds
- Subtle pattern backgrounds using highlighter colors at 10% opacity
- Animated gradient borders on key elements

The design balances conversion optimization with professional credibility through strategic use of vibrant highlighter colors, clear CTAs, and engaging visual hierarchy that drives users toward signup/trial actions.