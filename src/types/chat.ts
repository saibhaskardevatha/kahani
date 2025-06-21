export interface WorkflowStep {
  title: string;
  content: string;
  status: 'pending' | 'in-progress' | 'completed';
  streamedContent: string;
  isExpanded: boolean;
  isVisible: boolean;
}

export interface WorkflowStepData {
  title: string;
  content: string;
}

export interface WorkflowStepProps {
  title: string;
  status: string;
  content: string;
  isLast: boolean;
  isExpanded: boolean;
  onToggleExpand: () => void;
  isVisible: boolean;
  onRetry: () => void;
  onContinue: () => void;
  onImprove: (feedback: string) => void;
}

export interface FeedbackFormProps {
  onSubmit: (feedback: string) => void;
}

export interface AudioWaveformProps {
  isPlaying: boolean;
}

export type AudioPlayerProps = Record<string, never>;
export type ChatPageProps = Record<string, never>; 