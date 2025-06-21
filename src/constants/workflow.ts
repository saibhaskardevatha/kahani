import { WorkflowStepData } from '../types/chat';

export const WORKFLOW_STEPS_DATA: WorkflowStepData[] = [
  {
    title: "Story Outline",
    content: `🎬 *Cue dramatic music* \n\nPlotting the next blockbuster...\n\n🎭 "In a world where..." (let me think of something epic)\n\n📝 Crafting the perfect story arc that will make audiences go "WOW!"\n\n🌟 This is going to be bigger than Avengers, more emotional than Titanic, and funnier than The Office!\n\n⏳ Just a few more plot twists and character motivations...`,
    loaderContent: [
      "🎬 Plotting the next blockbuster...",
      "🎭 Crafting an epic story arc...",
      "📝 Weaving plot threads like a master storyteller...",
      "🌟 Creating a tale that will define a generation...",
      "🎪 Building the perfect narrative foundation...",
      "⏳ Assembling plot twists and character motivations..."
    ],
  },
  {
    title: "Characters",
    content: `🎭 *Character creation mode activated*\n\n🎪 "It's showtime!" - Creating characters that will steal the show\n\n🎨 Designing protagonists with more depth than a Christopher Nolan film\n\n🤖 Building antagonists so compelling, you'll almost root for them (almost!)\n\n🎪 Adding supporting characters that will have their own fan clubs\n\n🌟 These characters will be more memorable than your favorite childhood cartoon!`,
    loaderContent: [
      "🎭 Creating characters that will steal the show...",
      "🎨 Designing protagonists with cinematic depth...",
      "🤖 Building compelling antagonists...",
      "🎪 Adding supporting characters with their own fan clubs...",
      "🌟 Crafting characters more memorable than childhood cartoons...",
      "⏳ Breathing life into legendary personalities..."
    ],
  },
  {
    title: "Narrative",
    content: `📖 *Story weaving in progress*\n\n🎪 "Once upon a time..." (but make it epic)\n\n🎬 Crafting scenes that will make Spielberg proud\n\n🎭 Building tension like a Hitchcock thriller\n\n🌟 Creating moments that will be quoted for generations\n\n🎪 This narrative will have more twists than a pretzel factory!\n\n⏳ Assembling the perfect story structure...`,
    loaderContent: [
      "📖 Weaving an epic narrative tapestry...",
      "🎬 Crafting scenes that will make Spielberg proud...",
      "🎭 Building tension like a Hitchcock thriller...",
      "🌟 Creating moments that will be quoted for generations...",
      "🎪 Adding more twists than a pretzel factory...",
      "⏳ Assembling the perfect story structure..."
    ],
  },
  {
    title: "Audio Assets",
    content: `[INFO] Generating ambient soundscapes...\n[INFO] Synthesizing character voices...\n[INFO] Composing original score...\n[SUCCESS] Audio assets generated. Mixing and mastering in progress...\n[COMPLETE] Your immersive audio experience is ready.`,
    loaderContent: [
      "🎵 Composing the soundtrack of your dreams...",
      "🎤 Synthesizing voices smoother than butter...",
      "🎧 Mixing audio so crisp you'll hear every detail...",
      "🎪 Creating sound effects that make speakers dance...",
      "🌟 Building immersive audio that transports you...",
      "⏳ Final audio touches and mastering..."
    ],
  },
];

export const WORKFLOW_CONFIG = {
  planningDelay: 1000,
  stepRevealDelay: 200,
  stepStartDelay: 300,
  streamingSpeed: 10,
  completionDelay: 300,
  collapseDelay: 1000,
} as const;

export const WORKFLOW_STATUS = {
  PENDING: 'pending',
  IN_PROGRESS: 'in-progress',
  COMPLETED: 'completed',
} as const;

export const AUDIO_WAVEFORM_CONFIG = {
  waves: [
    {
      color: 'rgb(59 130 246 / 0.8)', // blue-500
      dur: '1.5s',
      values: 'M 0 12 C 25 0, 75 24, 100 12; M 0 12 C 25 24, 75 0, 100 12; M 0 12 C 25 0, 75 24, 100 12'
    },
    {
      color: 'rgb(99 102 241 / 0.6)', // indigo-500
      dur: '2s',
      values: 'M 0 12 C 20 24, 40 0, 60 12 C 80 24, 100 12, 100 12; M 0 12 C 20 0, 40 24, 60 12 C 80 0, 100 12, 100 12; M 0 12 C 20 24, 40 0, 60 12 C 80 24, 100 12, 100 12'
    },
    {
      color: 'rgb(236 72 153 / 0.5)', // pink-500
      dur: '1.2s',
      values: 'M 0 12 C 30 18, 70 6, 100 12; M 0 12 C 30 6, 70 18, 100 12; M 0 12 C 30 18, 70 6, 100 12'
    }
  ]
} as const; 