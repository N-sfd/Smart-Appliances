# Smart Applications

A modern React application built with Material-UI (MUI) for smart appliance solutions and professional repair services.

## Features

- **Modern Design**: Clean and professional interface using Material-UI components
- **Responsive Layout**: Optimized for desktop, tablet, and mobile devices
- **Custom Theme**: Branded color scheme with custom typography
- **Component-Based Architecture**: Modular components for easy maintenance and scalability

## Color Scheme

- **Primary Dark Blue**: #022F49
- **Light Blue**: #22B1FB
- **Light Gray**: #D9D9D9
- **White**: #FFFFFF
- **Black**: #000000

## Typography

- **Body Text**: DM Sans (Google Fonts)
- **Headings**: Wasted Vindey (Google Fonts)

## Components

### TopBar
- Company logo and branding
- Contact information (phone, email, location)
- Professional dark blue background

### NavigationBar
- Main navigation menu
- Links to: Home, About Us, Appliances, Repair Services, Contact Us
- Light gray background with hover effects

### Home
- Hero section with gradient background
- Services overview with interactive cards
- Call-to-action buttons

## Getting Started

### Prerequisites

- Node.js (version 14 or higher)
- npm or yarn package manager

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd smart-applications
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

4. Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

### Available Scripts

- `npm start` - Runs the app in development mode
- `npm test` - Launches the test runner
- `npm run build` - Builds the app for production
- `npm run eject` - Ejects from Create React App (one-way operation)

## Project Structure

```
src/
├── components/
│   ├── TopBar.tsx          # Top navigation bar with contact info
│   ├── NavigationBar.tsx   # Main navigation menu
│   └── Home.tsx           # Home page component
├── theme.ts               # MUI theme configuration
├── App.tsx               # Main application component
├── index.tsx             # Application entry point
└── index.css             # Global styles and font imports
```

## Technologies Used

- **React 18** - JavaScript library for building user interfaces
- **TypeScript** - Typed JavaScript for better development experience
- **Material-UI (MUI)** - React component library for faster UI development
- **Emotion** - CSS-in-JS library for styling
- **Create React App** - React application boilerplate

## Customization

### Adding New Components

1. Create a new component file in the `src/components/` directory
2. Follow the existing component structure and naming conventions
3. Import and use the component in `App.tsx` or other components

### Modifying the Theme

Edit `src/theme.ts` to customize:
- Color palette
- Typography settings
- Component default styles
- Spacing and breakpoints

### Styling

The project uses Material-UI's `sx` prop for styling. This provides:
- Type-safe styling
- Theme integration
- Responsive design utilities
- Consistent design tokens

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Contact

For questions or support, please contact:
- Email: info@smartapplications.com
- Phone: +1 (555) 123-4567
- Location: New York, NY
