# CLIP React Frontend

A modern React application that uses CLIP (Contrastive Language-Image Pre-Training) to analyze images and determine color probabilities.

## 🚀 Technologies Used

- **React**: UI library for building user interfaces
- **TypeScript**: For type-safe code
- **Vite**: Fast build tool and development server
- **Tailwind CSS**: Utility-first CSS framework
- **shadcn/ui**: High-quality React components
- **Jest & React Testing Library**: For comprehensive testing

## 🛠️ Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

The app will be available at `http://localhost:5173`

## 🧪 Testing

We use Jest and React Testing Library for testing. Our tests cover:
- Component rendering
- User interactions
- API integration
- Error handling

Run tests with:
```bash
npm test
```

Run tests in watch mode:
```bash
npm test:watch
```

## 📁 Project Structure

```
src/
├── components/           # React components
│   ├── ModelInterface/  # Main interface component
│   └── ...
├── styles/              # Global styles and Tailwind config
├── types/               # TypeScript type definitions
└── __tests__/          # Test files
```

## 🔍 Component Documentation

### ModelInterface

The main component that handles:
- Image upload and preview
- API integration with CLIP backend
- Result display
- Error handling

See the component's JSDoc comments for detailed documentation.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Write or update tests
5. Submit a pull request

## 📝 Development Guidelines

- Write TypeScript interfaces for all props and state
- Add JSDoc comments for components and functions
- Write tests for new features
- Follow the existing code style
- Use Tailwind CSS for styling
- Utilize shadcn/ui components when possible

## 🐛 Troubleshooting

Common issues and solutions:

1. **Image upload not working**
   - Check file size and type
   - Ensure backend server is running

2. **Tests failing**
   - Run `npm clean-install`
   - Check Jest configuration
   - Ensure all dependencies are installed

## 📚 Additional Resources

- [React Documentation](https://react.dev)
- [TypeScript Documentation](https://www.typescriptlang.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [shadcn/ui Documentation](https://ui.shadcn.com)
- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [React Testing Library Documentation](https://testing-library.com/docs/react-testing-library/intro/)
