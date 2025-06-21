import { WorkflowStepData } from '../types/chat';

export const WORKFLOW_STEPS_DATA: WorkflowStepData[] = [
  {
    title: "Creating Story Outline",
    content: `Based on your prompt, we're building a narrative structure. The story will begin with the initial discovery, introduce a central conflict with a **rival organization**, and build towards a climactic confrontation. Key scenes will include a chase through a bustling market, a moment of betrayal, and the final puzzle-solving sequence in a **hidden chamber**.`,
  },
  {
    title: "Generating Characters",
    content: `1. **Protagonist:** A brilliant but reckless adventurer, driven by a personal connection to the central mystery.\n2. **Ally:** A cautious and knowledgeable local expert who provides crucial guidance and acts as a moral compass.\n3. **Antagonist:** A ruthless and well-funded collector who seeks the prize for their own nefarious purposes.`,
  },
  {
    title: "Generating Script for the Story",
    content: `**SCENE 1: THE DISCOVERY**\nAn ancient map is found, hinting at a legendary artifact. Our hero is introduced, along with their motivations.\n\n**SCENE 2: THE CONFLICT**\nThe antagonist learns of the discovery and sets their plan in motion, creating the first obstacle.\n\n**SCENE 3: THE CLIMAX**\nBoth parties converge at the final location. A battle of wits and will ensues, with the fate of the artifact hanging in the balance.`,
  },
  {
    title: "Generating Audios",
    content: `[INFO] Generating ambient soundscapes...\n[INFO] Synthesizing character voices...\n[INFO] Composing original score...\n[SUCCESS] Audio assets generated. Mixing and mastering in progress...\n[COMPLETE] Your immersive audio experience is ready.`,
  },
];

export const WORKFLOW_CONFIG = {
  planningDelay: 1000,
  stepRevealDelay: 200,
  stepStartDelay: 300,
  streamingSpeed: 30,
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