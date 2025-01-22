import { SentimentData } from '@/app/page';

declare module '@/components/charts/MessageTimeDistribution' {
  interface MessageTimeDistributionProps {
    data: Record<string, number>;
  }
  export default function MessageTimeDistribution(props: MessageTimeDistributionProps): JSX.Element;
}

declare module '@/components/charts/SentimentOverTime' {
  interface SentimentOverTimeProps {
    data: SentimentData;
    participants: string[];
  }
  export default function SentimentOverTime(props: SentimentOverTimeProps): JSX.Element;
}

declare module '@/components/charts/ConversationInitiation' {
  interface ConversationInitiationProps {
    data: Record<string, number>;
  }
  export default function ConversationInitiation(props: ConversationInitiationProps): JSX.Element;
} 