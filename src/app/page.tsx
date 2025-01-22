'use client';

import { useState } from 'react';
import { FileUpload } from '@/components/ui/file-upload';
import dynamic from 'next/dynamic';

// Dynamically import chart components with ssr disabled
const DynamicMessageTimeDistribution = dynamic(
  () => import('@/components/charts/MessageTimeDistribution'),
  { ssr: false, loading: () => (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Messages by Time of Day</h2>
      <div className="h-64 flex items-center justify-center">
        <div className="animate-pulse">Loading chart...</div>
      </div>
    </div>
  )}
);

const DynamicSentimentOverTime = dynamic(
  () => import('@/components/charts/SentimentOverTime'),
  { ssr: false, loading: () => (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Sentiment Over Time</h2>
      <div className="h-64 flex items-center justify-center">
        <div className="animate-pulse">Loading chart...</div>
      </div>
    </div>
  )}
);

const DynamicConversationInitiation = dynamic(
  () => import('@/components/charts/ConversationInitiation'),
  { ssr: false, loading: () => (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Conversation Initiation</h2>
      <div className="h-64 flex items-center justify-center">
        <div className="animate-pulse">Loading chart...</div>
      </div>
    </div>
  )}
);

interface Analysis {
  messageStats: {
    totalMessages: Record<string, number>;
    averageResponseTime: Record<string, string>;
    messagesByTimeOfDay: Record<string, number>;
    longestConversation: {
      date: string;
      messageCount: number;
      duration: string;
    };
  };
  relationshipInsights: {
    compliments: Record<string, number>;
    redFlags: string[];
    redFlagAnalysis: string;
    attachmentStyles: Record<string, string>;
    relationshipType: string;
    relationshipStrength: string;
    breakupReasons: string[];
    relationshipStatus: string;
    positiveIndicators: string[];
    communicationStyle: Record<string, string>;
    emotionalExpression: Record<string, string>;
    mutualUnderstanding: {
      level: string;
      description: string;
    };
  };
  languageAnalysis: {
    topWords: Record<string, string[]>;
    mostUsedEmojis: Record<string, string[]>;
    sentimentOverTime: SentimentData;
    commonPhrases: Record<string, string[]>;
    emotionalSupport: Record<string, string[]>;
  };
  timeAnalysis: {
    messagesPerMonth: {
      dates: string[];
      [key: string]: string[] | number[];
    };
    averageMessagesPerDay: Record<string, number>;
    responsePatterns: {
      quickResponses: Record<string, number>;
      delayedResponses: Record<string, number>;
    };
    conversationInitiation: Record<string, number>;
    conversationQuality: {
      meaningfulDiscussions: number;
      casualChats: number;
      deepConversations: number;
    };
  };
}

type AnalysisStep = 'extracting' | 'sanitizing' | 'analyzing' | null;

interface SentimentData {
  dates: string[];
  [key: string]: string[] | number[];
}

const dummyAnalysis: Analysis = {
  messageStats: {
    totalMessages: {
      "Alice": 1250,
      "Bob": 1180
    },
    averageResponseTime: {
      "Alice": "8 minutes",
      "Bob": "12 minutes"
    },
    messagesByTimeOfDay: {
      morning: 580,
      afternoon: 850,
      evening: 720,
      night: 280
    },
    longestConversation: {
      date: "2024-02-14",
      messageCount: 145,
      duration: "2 hours 30 minutes"
    }
  },
  relationshipInsights: {
    compliments: {
      "AliceToOther": 45,
      "BobToOther": 38
    },
    redFlags: [],
    redFlagAnalysis: "No significant red flags detected. The relationship shows healthy communication patterns.",
    attachmentStyles: {
      "Alice": "Secure",
      "Bob": "Secure"
    },
    relationshipType: "Romantic",
    relationshipStrength: "Strong",
    breakupReasons: [],
    relationshipStatus: "Active and healthy relationship with strong emotional connection",
    positiveIndicators: [
      "Regular meaningful conversations",
      "Mutual emotional support",
      "Balanced communication",
      "Shared interests and activities",
      "Respectful disagreements"
    ],
    communicationStyle: {
      "Alice": "Direct and empathetic",
      "Bob": "Thoughtful and supportive"
    },
    emotionalExpression: {
      "Alice": "Open and expressive",
      "Bob": "Balanced and sincere"
    },
    mutualUnderstanding: {
      level: "High",
      description: "Both partners show deep understanding and respect for each other's perspectives and feelings"
    }
  },
  languageAnalysis: {
    topWords: {
      "Alice": ["love", "together", "happy", "excited", "miss"],
      "Bob": ["care", "amazing", "beautiful", "fun", "wonderful"]
    },
    mostUsedEmojis: {
      "Alice": ["❤️", "😊", "🥰", "✨", "🌟"],
      "Bob": ["😊", "❤️", "🤗", "👍", "😄"]
    },
    sentimentOverTime: {
      dates: ["Jan", "Feb", "Mar", "Apr", "May"],
      "Alice": [0.8, 0.85, 0.9, 0.88, 0.92],
      "Bob": [0.75, 0.82, 0.88, 0.85, 0.9]
    },
    commonPhrases: {
      "Alice": ["I miss you", "Can't wait to see you", "Have a great day", "Love you lots"],
      "Bob": ["You're amazing", "Miss you too", "Sweet dreams", "Take care love"]
    },
    emotionalSupport: {
      "Alice": ["Offers encouragement during challenges", "Celebrates partner's achievements", "Shows empathy"],
      "Bob": ["Provides comfort in difficult times", "Actively listens", "Validates feelings"]
    }
  },
  timeAnalysis: {
    messagesPerMonth: {
      dates: ["Jan", "Feb", "Mar", "Apr", "May"],
      "Alice": [280, 310, 290, 320, 300],
      "Bob": [260, 290, 285, 300, 295]
    },
    averageMessagesPerDay: {
      "Alice": 42,
      "Bob": 39
    },
    responsePatterns: {
      quickResponses: {
        "Alice": 850,
        "Bob": 780
      },
      delayedResponses: {
        "Alice": 120,
        "Bob": 140
      }
    },
    conversationInitiation: {
      "Alice": 320,
      "Bob": 290
    },
    conversationQuality: {
      meaningfulDiscussions: 180,
      casualChats: 420,
      deepConversations: 95
    }
  }
};

export default function Home() {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisStep, setAnalysisStep] = useState<AnalysisStep>(null);
  const [error, setError] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [showDemo, setShowDemo] = useState(true);

  const handleFileSelect = async (file: File) => {
    setShowDemo(false);
    setIsAnalyzing(true);
    setError(null);
    setAnalysis(null);
    setAnalysisStep('extracting');

    try {
      const formData = new FormData();
      formData.append('file', file);

      setAnalysisStep('sanitizing');
      const response = await fetch('/api/analyze', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to analyze chat');
      }

      setAnalysisStep('analyzing');
      const result = await response.json();
      setAnalysis(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to analyze chat');
    } finally {
      setIsAnalyzing(false);
      setAnalysisStep(null);
    }
  };

  const getAnalysisStepMessage = () => {
    switch (analysisStep) {
      case 'extracting':
        return 'Extracting chat from ZIP file...';
      case 'sanitizing':
        return 'Removing sensitive information...';
      case 'analyzing':
        return 'Analyzing chat patterns and relationships...';
      default:
        return 'Processing...';
    }
  };

  const toggleDemo = () => {
    setShowDemo(!showDemo);
    setAnalysis(null);
    setError(null);
  };

  const displayAnalysis = showDemo ? dummyAnalysis : analysis;

  return (
    <main className="min-h-screen p-8 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white">Relationship Analysis</h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Upload your WhatsApp chat export and get insights about your relationship
          </p>
          <button
            onClick={toggleDemo}
            className="px-4 py-2 text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors"
          >
            {showDemo ? "Hide Demo" : "Show Demo Analysis"}
          </button>
        </div>
        
        <FileUpload onFileSelect={handleFileSelect} />

        <div className="bg-yellow-50 dark:bg-yellow-900/30 border border-yellow-200 dark:border-yellow-700 rounded-lg p-4 text-sm text-yellow-800 dark:text-yellow-200">
          <p>🔒 Your privacy is important to us:</p>
          <ul className="list-disc list-inside mt-2 space-y-1">
            <li>All processing is done securely</li>
            <li>No chat data is stored on our servers</li>
            <li>Sensitive information is automatically removed</li>
          </ul>
        </div>

        {showDemo && (
          <div className="bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-700 rounded-lg p-4 text-sm text-blue-800 dark:text-blue-200">
            <p>👋 This is a demo analysis showing you what insights you&apos;ll get after uploading your chat history.</p>
            <p className="mt-2">Upload your WhatsApp chat export to get your personalized analysis!</p>
          </div>
        )}

        {isAnalyzing && (
          <div className="text-center space-y-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 dark:border-blue-400 mx-auto"></div>
            <div className="space-y-2">
              <p className="text-gray-600 dark:text-gray-400">{getAnalysisStepMessage()}</p>
              <p className="text-sm text-gray-500 dark:text-gray-500">This may take a few moments...</p>
            </div>
          </div>
        )}

        {error && (
          <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-700 rounded-lg p-4 text-sm text-red-800 dark:text-red-200">
            {error}
          </div>
        )}

        {displayAnalysis && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Message Stats */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Message Statistics</h2>
                <div className="space-y-4">
                  {Object.entries(displayAnalysis.messageStats.totalMessages).map(([person, count]) => (
                    <div key={person} className="flex justify-between items-center">
                      <span className="text-gray-700 dark:text-gray-300">{person}</span>
                      <span className="font-semibold text-gray-900 dark:text-white">{count} messages</span>
                    </div>
                  ))}
                </div>
                <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <h3 className="text-lg font-semibold mb-2">Longest Conversation</h3>
                  <p className="text-gray-700 dark:text-gray-300">Date: {displayAnalysis.messageStats.longestConversation.date}</p>
                  <p className="text-gray-700 dark:text-gray-300">Messages: {displayAnalysis.messageStats.longestConversation.messageCount}</p>
                  <p className="text-gray-700 dark:text-gray-300">Duration: {displayAnalysis.messageStats.longestConversation.duration}</p>
                </div>
              </div>

              {/* Relationship Type and Status */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Relationship Insights</h2>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-gray-800 dark:text-gray-200">Type</h3>
                    <p className="text-gray-700 dark:text-gray-300">{displayAnalysis.relationshipInsights.relationshipType}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800 dark:text-gray-200">Strength</h3>
                    <p className="text-gray-700 dark:text-gray-300">{displayAnalysis.relationshipInsights.relationshipStrength}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800 dark:text-gray-200">Status</h3>
                    <p className="text-gray-700 dark:text-gray-300">{displayAnalysis.relationshipInsights.relationshipStatus}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Red Flags */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Relationship Health</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">Red Flags</h3>
                  {displayAnalysis.relationshipInsights.redFlags.length > 0 ? (
                    <ul className="list-disc list-inside space-y-2">
                      {displayAnalysis.relationshipInsights.redFlags.map((flag, index) => (
                        <li key={index} className="text-red-600 dark:text-red-400">{flag}</li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-green-600 dark:text-green-400">{displayAnalysis.relationshipInsights.redFlagAnalysis}</p>
                  )}
                </div>
                
                <div>
                  <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">Positive Indicators</h3>
                  <ul className="list-disc list-inside space-y-2">
                    {displayAnalysis.relationshipInsights.positiveIndicators.map((indicator, index) => (
                      <li key={index} className="text-green-600 dark:text-green-400">{indicator}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Breakup Reasons */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Relationship Status</h2>
              {displayAnalysis.relationshipInsights.breakupReasons.length > 0 ? (
                <div>
                  <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">Reasons for Separation</h3>
                  <ul className="list-disc list-inside space-y-2">
                    {displayAnalysis.relationshipInsights.breakupReasons.map((reason, index) => (
                      <li key={index} className="text-gray-700 dark:text-gray-300">{reason}</li>
                    ))}
                  </ul>
                </div>
              ) : (
                <p className="text-green-600 dark:text-green-400">No separation indicators found. The relationship shows strong positive dynamics!</p>
              )}
            </div>

            {/* Charts and Visualizations */}
            {displayAnalysis.messageStats.messagesByTimeOfDay && (
              <DynamicMessageTimeDistribution data={displayAnalysis.messageStats.messagesByTimeOfDay} />
            )}

            {displayAnalysis.languageAnalysis.sentimentOverTime && (
              <DynamicSentimentOverTime 
                data={displayAnalysis.languageAnalysis.sentimentOverTime} 
                participants={Object.keys(displayAnalysis.messageStats.totalMessages)}
              />
            )}

            {displayAnalysis.timeAnalysis.conversationInitiation && (
              <DynamicConversationInitiation data={displayAnalysis.timeAnalysis.conversationInitiation} />
            )}

            {/* Language Analysis */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(displayAnalysis.languageAnalysis.topWords).map(([person, words]) => (
                <div key={person} className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                  <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">{person}&apos;s Communication</h2>
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">Top Words</h3>
                      <div className="flex flex-wrap gap-2">
                        {words.map((word, index) => (
                          <span key={index} className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded">
                            {word}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">Most Used Emojis</h3>
                      <div className="text-2xl space-x-2">
                        {displayAnalysis.languageAnalysis.mostUsedEmojis[person].map((emoji, index) => (
                          <span key={index}>{emoji}</span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">Common Phrases</h3>
                      <ul className="space-y-2">
                        {displayAnalysis.languageAnalysis.commonPhrases[person].map((phrase, index) => (
                          <li key={index} className="text-gray-700 dark:text-gray-300">&ldquo;{phrase}&rdquo;</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Communication and Emotional Analysis */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(displayAnalysis.relationshipInsights.communicationStyle).map(([person, style]) => (
                <div key={person} className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                  <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">{person}&apos;s Style</h2>
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-semibold text-gray-800 dark:text-gray-200">Communication Style</h3>
                      <p className="text-gray-700 dark:text-gray-300">{style}</p>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800 dark:text-gray-200">Emotional Expression</h3>
                      <p className="text-gray-700 dark:text-gray-300">{displayAnalysis.relationshipInsights.emotionalExpression[person]}</p>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800 dark:text-gray-200">Emotional Support</h3>
                      <ul className="list-disc list-inside space-y-1">
                        {displayAnalysis.languageAnalysis.emotionalSupport[person].map((support, index) => (
                          <li key={index} className="text-gray-700 dark:text-gray-300">{support}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Mutual Understanding */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Mutual Understanding</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-gray-800 dark:text-gray-200">Level</h3>
                  <p className="text-gray-700 dark:text-gray-300">{displayAnalysis.relationshipInsights.mutualUnderstanding.level}</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 dark:text-gray-200">Description</h3>
                  <p className="text-gray-700 dark:text-gray-300">{displayAnalysis.relationshipInsights.mutualUnderstanding.description}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
