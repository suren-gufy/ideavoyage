# Design Guidelines for Reddit Idea Validator Tool

## Design Approach
**Selected Approach**: Reference-Based (Productivity Tools)  
**Primary References**: Notion, Linear, Ahrefs  
**Justification**: Data-heavy analytics tool requiring clear information hierarchy and professional dashboard aesthetics

## Core Design Elements

### A. Color Palette
**Dark Mode Primary** (default):
- Background: 222 8% 12%
- Surface: 222 10% 16% 
- Primary: 217 91% 60% (Reddit-inspired blue)
- Text Primary: 210 20% 98%
- Text Secondary: 215 16% 65%
- Border: 215 14% 20%

**Light Mode**:
- Background: 0 0% 98%
- Surface: 0 0% 100%
- Primary: 217 91% 50%
- Text Primary: 222 84% 5%
- Text Secondary: 215 16% 45%

**Accent Colors**:
- Success: 142 71% 45% (for positive sentiment)
- Warning: 38 92% 50% (for neutral/mixed)
- Destructive: 0 84% 60% (for negative sentiment)

### B. Typography
- **Primary**: Inter (400, 500, 600)
- **Headings**: Inter 600 for dashboard titles
- **Body**: Inter 400 for content, 500 for emphasis
- **Code/Data**: JetBrains Mono for metrics and technical data

### C. Layout System
**Spacing Units**: 2, 4, 6, 8, 12, 16 (Tailwind units)
- Component padding: p-4, p-6
- Section margins: m-8, m-12
- Card spacing: gap-4, gap-6
- Dashboard grid: grid with gap-8

### D. Component Library

**Navigation**:
- Clean sidebar with search functionality
- Breadcrumb navigation for research sessions
- Tab system for different analysis views

**Data Display**:
- **Cards**: Elevated surfaces (shadow-sm) for pain points, solutions, app ideas
- **Charts**: Clean data visualizations using Chart.js with consistent color mapping
- **Tables**: Sortable data tables for detailed Reddit post analysis
- **Metrics Cards**: Large number displays with trend indicators

**Forms**:
- Search input with autocomplete for subreddit/topic selection
- Filter controls with checkbox groups and range sliders
- Export options dropdown

**Interactive Elements**:
- Hover states with subtle color shifts
- Loading states with skeleton screens
- Progressive disclosure for detailed analysis

### E. Dashboard Layout Sections

**Header**: Search bar, filters, export controls
**Sidebar**: Navigation, saved searches, recent analyses  
**Main Content Grid**:
1. **Overview Metrics** (4-card row): Total posts, sentiment score, top subreddit, timeframe
2. **Sentiment Analysis** (2-column): Donut chart + trending sentiment over time
3. **Pain Points & Solutions** (2-column): Ranked lists with frequency indicators
4. **Generated App Ideas** (3-column grid): Cards with feasibility scores
5. **Raw Data Table**: Expandable section with original Reddit posts

### F. Visual Hierarchy
- **Level 1**: Dashboard title (text-3xl font-semibold)
- **Level 2**: Section headers (text-xl font-medium) 
- **Level 3**: Card titles (text-lg font-medium)
- **Level 4**: Metrics/data (text-sm font-medium)
- **Body**: Analysis text (text-sm)

### G. Interactive States
- **Loading**: Skeleton screens maintaining layout structure
- **Empty States**: Friendly illustrations with clear call-to-action
- **Error States**: Clear error messages with retry options
- **Success States**: Subtle confirmation animations

## Images
No large hero image required. Use:
- **Icon System**: Heroicons for UI elements, Reddit icon for branding
- **Data Visualizations**: Custom charts with consistent color coding
- **Placeholder States**: Simple line illustrations for empty states
- **Export Previews**: Small thumbnail previews of generated reports

The design prioritizes data clarity and professional aesthetics suitable for entrepreneurs and product managers conducting market research.