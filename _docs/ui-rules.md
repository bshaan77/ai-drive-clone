# UI Rules: Google Drive Clone

This document outlines the core design principles and UI rules for the Google Drive clone application, ensuring consistency across all user interfaces.

## Core Design Philosophy

### **Minimalistic Approach**

- **Inspired by**: Notion and Grammarly
- **Focus**: Content over decoration, clean interfaces, purposeful design
- **Principle**: Every element serves a function, no unnecessary visual noise

### **Mobile-First Design**

- **Primary Target**: Mobile devices and tablets
- **Secondary**: Desktop optimization
- **Approach**: Design for touch interactions first, then enhance for mouse/keyboard

## Design Principles

### 1. **Clarity & Hierarchy**

- **Visual Hierarchy**: Clear distinction between primary, secondary, and tertiary information
- **Information Density**: Balance between showing enough info and avoiding clutter
- **Progressive Disclosure**: Show essential info first, details on demand
- **White Space**: Generous use of spacing to create breathing room

### 2. **Efficiency & Speed**

- **Quick Actions**: Context menus, keyboard shortcuts, drag-and-drop
- **Visual Feedback**: Immediate response to user interactions
- **Reduced Cognitive Load**: Familiar patterns, predictable interactions
- **Performance**: Smooth animations that don't hinder functionality

### 3. **Accessibility & Inclusivity**

- **Keyboard Navigation**: Full keyboard accessibility
- **Screen Reader Support**: Proper ARIA labels and semantic HTML
- **Color Contrast**: WCAG AA compliance (4.5:1 ratio minimum)
- **Touch Targets**: Minimum 44px for touch interactions
- **Focus States**: Clear, visible focus indicators

### 4. **Responsive & Adaptive**

- **Breakpoints**: Mobile (320px), Tablet (768px), Desktop (1024px+)
- **Flexible Layouts**: Grid/list views that adapt to content and screen size
- **Cross-Platform Consistency**: Similar experience across devices
- **Orientation Support**: Portrait and landscape layouts

### 5. **Trust & Security**

- **Clear Permissions**: Visual indicators for shared files and access levels
- **Confirmation Dialogs**: For destructive actions (delete, move)
- **Status Indicators**: Upload progress, sync status, error states
- **Loading States**: Clear feedback during async operations

## Component Design Rules

### **File & Folder Cards**

- **Size**: Consistent card dimensions (mobile: 100% width, desktop: grid)
- **Spacing**: 16px padding, 8px margins between cards
- **Hover States**: Subtle elevation (2px shadow) and color changes
- **Selection**: Clear visual feedback with accent color borders
- **Icons**: Consistent file type icons with proper sizing

### **Navigation & Layout**

- **Sidebar**: Collapsible on mobile, always visible on desktop
- **Header**: Fixed position with search and user controls
- **Breadcrumbs**: Horizontal on desktop, stacked on mobile
- **Context Menus**: Touch-friendly on mobile, right-click on desktop

### **Forms & Inputs**

- **Input Fields**: Clear labels, proper spacing, validation states
- **Buttons**: Consistent sizing, clear hierarchy (primary/secondary/tertiary)
- **File Upload**: Drag-and-drop zones with clear visual feedback
- **Search**: Prominent placement, real-time results, clear filters

## Animation & Interaction Rules

### **Animation Principles**

- **Purpose**: Enhance usability, not decoration
- **Duration**: 150-300ms for micro-interactions
- **Easing**: Smooth, natural curves (ease-out for enter, ease-in for exit)
- **Performance**: Use transform and opacity for smooth animations

### **Micro-Interactions**

- **Hover Effects**: Subtle color changes and elevation
- **Click Feedback**: Ripple effects or scale changes
- **Loading States**: Skeleton screens or spinners
- **Transitions**: Smooth state changes between views

### **Page Transitions**

- **Navigation**: Fade transitions between routes
- **Modal Open/Close**: Scale and fade animations
- **List Updates**: Staggered animations for new items
- **Error States**: Gentle shake or highlight animations

## Iconography Rules

### **Icon System**

- **Style**: Consistent line weight and style
- **Size**: 16px, 20px, 24px, 32px variants
- **Color**: Inherit text color, accent colors for actions
- **Accessibility**: Proper alt text and ARIA labels

### **File Type Icons**

- **Consistency**: Same style across all file types
- **Recognition**: Clear visual distinction between types
- **Scalability**: Vector-based for crisp rendering
- **Fallbacks**: Generic file icon for unknown types

### **Action Icons**

- **Clarity**: Unambiguous meaning
- **Grouping**: Related actions grouped together
- **Hierarchy**: Primary actions more prominent
- **Labels**: Text labels for complex actions

## Responsive Design Rules

### **Mobile (320px - 767px)**

- **Single Column**: Stack all elements vertically
- **Touch-Friendly**: Large touch targets (44px minimum)
- **Simplified Navigation**: Bottom navigation or hamburger menu
- **Optimized Typography**: Readable font sizes (16px minimum)

### **Tablet (768px - 1023px)**

- **Two Column**: Sidebar + main content
- **Touch + Mouse**: Support both interaction methods
- **Medium Density**: Balance between mobile and desktop
- **Orientation**: Support both portrait and landscape

### **Desktop (1024px+)**

- **Multi-Column**: Full sidebar + main content + details panel
- **Mouse + Keyboard**: Optimized for precise interactions
- **High Density**: More information visible at once
- **Advanced Features**: Keyboard shortcuts, right-click menus

## Accessibility Standards

### **Color & Contrast**

- **Text Contrast**: 4.5:1 minimum for normal text, 3:1 for large text
- **Interactive Elements**: Clear focus states with 3:1 contrast
- **Color Independence**: Information not conveyed by color alone
- **Dark Mode**: High contrast alternative theme

### **Keyboard Navigation**

- **Tab Order**: Logical, predictable tab sequence
- **Focus Indicators**: Visible focus rings on all interactive elements
- **Skip Links**: Skip to main content links
- **Keyboard Shortcuts**: Common shortcuts (Ctrl+S, Ctrl+A, etc.)

### **Screen Reader Support**

- **Semantic HTML**: Proper heading hierarchy and landmarks
- **ARIA Labels**: Descriptive labels for complex interactions
- **Live Regions**: Announce dynamic content changes
- **Alternative Text**: Meaningful alt text for images and icons

## Performance Guidelines

### **Loading Performance**

- **Skeleton Screens**: Show content structure while loading
- **Progressive Loading**: Load essential content first
- **Image Optimization**: Proper sizing and lazy loading
- **Bundle Optimization**: Code splitting and tree shaking

### **Interaction Performance**

- **Debounced Input**: Prevent excessive API calls
- **Optimistic Updates**: Update UI immediately, sync in background
- **Caching**: Cache frequently accessed data
- **Background Sync**: Sync changes when connection available

## Implementation with Shadcn/ui + Tailwind

### **Component Customization**

- **Theme Variables**: Use CSS custom properties for consistent theming
- **Tailwind Classes**: Leverage utility classes for rapid development
- **Shadcn Base**: Start with Shadcn components, customize as needed
- **Design Tokens**: Define spacing, colors, and typography tokens

### **Responsive Utilities**

- **Tailwind Breakpoints**: Use built-in responsive prefixes
- **Container Queries**: For component-specific responsive behavior
- **Flexible Grids**: CSS Grid and Flexbox for layouts
- **Viewport Units**: Use vh/vw for viewport-relative sizing

### **Animation Implementation**

- **Tailwind Transitions**: Use built-in transition utilities
- **CSS Animations**: Custom keyframes for complex animations
- **Framer Motion**: For advanced animations (if needed)
- **Performance**: Use will-change and transform3d for hardware acceleration

## Quality Assurance

### **Design Review Checklist**

- [ ] Mobile-first approach implemented
- [ ] All interactive elements have proper focus states
- [ ] Color contrast meets WCAG AA standards
- [ ] Animations enhance usability without hindering performance
- [ ] Icons are consistent and properly labeled
- [ ] Responsive behavior works across all breakpoints
- [ ] Loading states provide clear feedback
- [ ] Error states are informative and actionable

### **Testing Guidelines**

- **Cross-Browser**: Test on Chrome, Firefox, Safari, Edge
- **Device Testing**: Test on various mobile devices and screen sizes
- **Accessibility**: Use screen readers and keyboard navigation
- **Performance**: Monitor Core Web Vitals and interaction metrics
