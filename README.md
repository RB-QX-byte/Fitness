# AI Fitness Coach App

An AI-powered fitness assistant built with Next.js 15 that generates personalized workout and diet plans using LLMs.

![AI.COACH Dashboard](./preview.png)

## ✨ Features

- 🏋️ **AI Workout Plans** - Personalized exercise routines with sets, reps, and tips
- 🥗 **Smart Diet Plans** - Meal plans with macro breakdowns
- 🎤 **Voice Narration** - Listen to your plans with ElevenLabs TTS
- 🖼️ **AI Images** - Generate visuals for exercises and meals
- 📄 **PDF Export** - Download your plans
- 💾 **Local Storage** - Plans persist across sessions
- ⚡ **Stunning UI** - Cyber-Performance theme with Framer Motion animations

## 🚀 Quick Start

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   Add your API keys (optional - app works with mock data)

3. **Run the development server**
   ```bash
   npm run dev
   ```

4. **Open** [http://localhost:3000](http://localhost:3000)

## 🔑 API Keys (Optional)

The app works without API keys using mock data. For full functionality:

| Feature | Provider | Get API Key |
|---------|----------|-------------|
| AI Plans | OpenAI | [platform.openai.com](https://platform.openai.com) |
| AI Plans | Gemini | [aistudio.google.com](https://aistudio.google.com) |
| AI Plans | Claude | [console.anthropic.com](https://console.anthropic.com) |
| Voice | ElevenLabs | [elevenlabs.io](https://elevenlabs.io) |
| Images | Replicate | [replicate.com](https://replicate.com) |

## 🛠️ Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4.1
- **Animations**: Framer Motion
- **UI Components**: Custom Shadcn-style
- **Icons**: Lucide React
- **PDF**: jsPDF

## 📁 Project Structure

```
src/
├── app/
│   ├── api/           # API routes (generate, voice, image)
│   ├── onboarding/    # Multi-step setup wizard
│   └── page.tsx       # Main dashboard
├── components/
│   ├── dashboard/     # Bento grid components
│   ├── shared/        # Header, ExportPDF
│   └── ui/           # Button, Card, Progress, etc.
├── lib/              # Utils, prompts, storage
└── types/            # TypeScript interfaces
```

## Design System

- **Colors**: Brand Dark (#0B0B0B), Brand Lime (#CCFF00), Brand Blue (#00F0FF)
- **Theme**: Cyber-Performance with glassmorphism
- **Layout**: Bento Grid Dashboard

## License

MIT
