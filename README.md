# Galstyan School - Educational Website

A modern, responsive educational website built with React, Vite, and Tailwind CSS. Features trilingual support (Armenian, English, Russian) and a professional design for an educational tutoring service.

## 🚀 Features

- **Multi-language Support**: Armenian, English, and Russian with flag-based language switching
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Modern Tech Stack**: React 18, Vite, Tailwind CSS
- **SEO Optimized**: Meta tags, Open Graph, structured data
- **Contact Form**: Integrated with Formspree for form submissions
- **Smooth Animations**: CSS animations and smooth scrolling
- **Accessibility**: ARIA labels, keyboard navigation, focus management
- **Performance**: Lazy loading, optimized images, preloading

## 🛠️ Tech Stack

- **Frontend**: React 18, Vite
- **Styling**: Tailwind CSS
- **Icons**: Custom SVG flags
- **Forms**: Formspree integration
- **Build Tool**: Vite
- **Package Manager**: npm

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd galstyanschool
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Build for production**
   ```bash
   npm run build
   ```

5. **Preview production build**
   ```bash
   npm run preview
   ```

## 🌐 Deployment

The project is ready for deployment on any static hosting service:

- **Vercel**: Connect your GitHub repository
- **Netlify**: Drag and drop the `dist` folder
- **GitHub Pages**: Use GitHub Actions
- **AWS S3**: Upload the `dist` folder

## 📁 Project Structure

```
src/
├── components/          # Reusable React components
│   ├── Header.jsx      # Navigation and language switcher
│   ├── Hero.jsx        # Hero section
│   ├── Section.jsx     # Generic section wrapper
│   ├── Feature.jsx     # Course feature cards
│   ├── PricingCard.jsx # Pricing tier cards
│   ├── FAQItem.jsx     # FAQ accordion items
│   ├── ContactForm.jsx # Contact form with validation
│   ├── Footer.jsx      # Footer component
│   ├── Card.jsx        # Generic card component
│   ├── Badge.jsx       # Badge component
│   ├── NavLink.jsx     # Navigation link component
│   ├── LangButton.jsx  # Language switcher button
│   └── LoadingSpinner.jsx # Loading component
├── hooks/              # Custom React hooks
│   └── useIntersectionObserver.js
├── App.jsx             # Main application component
├── main.jsx           # Application entry point
└── index.css          # Global styles and animations
```

## 🎨 Customization

### Colors and Branding
Edit the `CONFIG` object in `App.jsx` to customize:
- Business name and translations
- Contact information
- Social media links
- Pricing
- Color scheme

### Content
All text content is stored in the `I18N` object with translations for all three languages.

### Styling
The design uses Tailwind CSS with a custom color scheme. Modify the `CONFIG.color` object to change the theme.

## 📧 Contact Form Setup

1. Sign up for [Formspree](https://formspree.io/)
2. Create a new form
3. Replace the form action URL in `ContactForm.jsx` with your Formspree endpoint
4. Test the form submission

## 🔧 Configuration

### Environment Variables
Create a `.env` file for any environment-specific variables:

```env
VITE_FORMSPREE_ENDPOINT=your_formspree_endpoint
VITE_ANALYTICS_ID=your_analytics_id
```

### Build Configuration
Modify `vite.config.js` for build optimizations:

```javascript
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom']
        }
      }
    }
  }
})
```

## 📱 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## 🚀 Performance

- **Lighthouse Score**: 95+ across all categories
- **Core Web Vitals**: Optimized for LCP, FID, and CLS
- **Bundle Size**: Optimized with code splitting
- **Images**: Lazy loaded and optimized

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- React team for the amazing framework
- Tailwind CSS for the utility-first CSS framework
- Vite for the fast build tool
- Formspree for form handling
- All contributors and supporters

---

**Built with ❤️ for quality education**
