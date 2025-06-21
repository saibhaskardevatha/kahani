# 🚀 Kahani

**Transform your story ideas into immersive audio experiences**

Kahani takes user story prompts and generates complete audio narratives with multiple Indian languages support. The platform features a sophisticated workflow system that creates story outlines, generates characters, scripts, and produces audio content.

## ✨ Features

### 🎭 Story Generation
- **Multi-language Support**: Hindi, Marathi, Telugu, and Punjabi
- **Interactive Workflow**: Step-by-step story creation process
- **Smart Suggestions**: Pre-built story prompts to get you started
- **Writing Tips**: Helpful guidance for better storytelling

### 🎵 Audio Production
- **Immersive Audio**: Generated audio with ambient soundscapes
- **Character Voices**: Synthesized character voices
- **Original Score**: Composed background music
- **Audio Player**: Built-in player with waveform visualization

### 🎨 User Experience
- **Responsive Design**: Works on all devices
- **Accessibility**: WCAG compliant with keyboard navigation
- **Real-time Feedback**: Interactive improvement system

## 🏗️ Architecture

### Tech Stack
- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **State Management**: React Hooks
- **Font**: Geist Sans

### Project Structure
```
src/
├── app/                    # Next.js App Router pages
│   ├── page.tsx           # Home page with story input
│   └── chat/[id]/         # Dynamic chat/workflow pages
├── components/            # Reusable UI components
│   ├── ui/               # Base UI components
│   ├── chat/             # Chat-specific components
│   └── icons/            # Icon components
├── hooks/                # Custom React hooks
├── types/                # TypeScript type definitions
├── constants/            # Application constants
└── utils/                # Utility functions
```

### Key Components
- **LanguageDropdown**: Custom dropdown with language selection
- **WorkflowStep**: Individual workflow step with animations
- **AudioPlayer**: Audio playback with waveform visualization
- **FeedbackForm**: User feedback collection system
- **useWorkflow**: Custom hook for workflow state management

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm, yarn, pnpm, or bun

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/saibhaskardevatha/kahani.git
   cd kahani
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🎯 How to Use

1. **Enter Your Story**: Type your story idea in the text area
2. **Select Language**: Choose from Hindi, Marathi, Telugu, or Punjabi
3. **Generate**: Click "Create" to start the workflow
4. **Follow the Process**: Watch as the system creates your story
5. **Listen**: Enjoy your generated audio experience

### Story Suggestions
Try these example prompts:
- A time traveler wakes up in 1920s Paris with no memory
- A world where dreams are recorded and sold as entertainment
- A small-town radio DJ receives a call from the future

## 🤝 Contributing

We welcome contributions! Here's how you can help:

### 🐛 Reporting Bugs
1. Check existing issues first
2. Create a new issue with:
   - Clear description of the problem
   - Steps to reproduce
   - Expected vs actual behavior
   - Browser/device information

### 💡 Feature Requests
1. Check existing feature requests
2. Create a new issue with:
   - Detailed feature description
   - Use case explanation
   - Mockups if applicable

### 🔧 Code Contributions

1. **Fork the repository**
   ```bash
   git clone https://github.com/your-username/kahani.git
   ```

2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   # or
   git checkout -b fix/bug-fix
   ```

3. **Make your changes**
   - Follow the existing code style
   - Add TypeScript types where needed
   - Include proper accessibility attributes
   - Test your changes thoroughly

4. **Commit your changes**
   ```bash
   git commit -m "feat: add amazing new feature"
   # or
   git commit -m "fix: resolve bug in workflow"
   ```

5. **Push to your fork**
   ```bash
   git push origin feature/amazing-feature
   ```

6. **Create a Pull Request**
   - Provide a clear description of changes
   - Include screenshots for UI changes
   - Reference related issues

### 📋 Development Guidelines

#### Code Style
- Use TypeScript for all new code
- Follow existing naming conventions
- Use functional components with hooks
- Implement proper error handling
- Add accessibility attributes

#### Component Structure
```typescript
// Example component structure
import React from 'react';
import { ComponentProps } from '../types';

interface MyComponentProps {
  // Define props interface
}

export const MyComponent: React.FC<MyComponentProps> = ({ prop1, prop2 }) => {
  // Component logic
  return (
    // JSX with proper accessibility
  );
};
```

#### Testing
- Test components in different browsers
- Verify accessibility with screen readers
- Test responsive design on various devices
- Ensure dark/light mode works correctly

### 🎨 Design Contributions
- Follow the existing design system
- Use Tailwind CSS classes
- Maintain consistency with current UI
- Consider accessibility in design decisions

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- Styled with [Tailwind CSS](https://tailwindcss.com/)
- Icons from [Lucide React](https://lucide.dev/)
- Font from [Geist](https://vercel.com/font)

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/saibhaskardevatha/kahani/issues)
- **Discussions**: [GitHub Discussions](https://github.com/saibhaskardevatha/kahani/discussions)

---

**Made with ❤️ by the Kahani Team**
