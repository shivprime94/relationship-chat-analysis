'use client';

import { useState } from 'react';
import { FileUpload } from '@/components/ui/file-upload';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';

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

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

interface SentimentData {
  dates: string[];
  [key: string]: string[] | number[];
}

function MessageTimeDistribution({ data }: { data: Record<string, number> }) {
  const chartData = Object.entries(data).map(([time, count]) => ({
    time: time.charAt(0).toUpperCase() + time.slice(1),
    count
  }));

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Messages by Time of Day</h2>
      <div className="h-64">
        <BarChart width={400} height={250} data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="time" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="count" fill="#8884d8" />
        </BarChart>
      </div>
    </div>
  );
}

function SentimentOverTime({ data, participants }: { data: SentimentData, participants: string[] }) {
  if (!data.dates || data.dates.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Sentiment Over Time</h2>
        <p className="text-gray-500 dark:text-gray-400">No sentiment data available</p>
      </div>
    );
  }

  const chartData = data.dates.map((date, index) => ({
    date,
    [participants[0]]: (data[participants[0]] as number[])[index] || 0,
    [participants[1]]: (data[participants[1]] as number[])[index] || 0,
  }));

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Sentiment Over Time</h2>
      <div className="h-64">
        <LineChart width={600} height={250} data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis domain={[0, 1]} />
          <Tooltip />
          <Legend />
          <Line 
            type="monotone" 
            dataKey={participants[0]} 
            stroke="#8884d8" 
            name={`${participants[0]}'s Sentiment`}
          />
          <Line 
            type="monotone" 
            dataKey={participants[1]} 
            stroke="#82ca9d" 
            name={`${participants[1]}'s Sentiment`}
          />
        </LineChart>
      </div>
    </div>
  );
}

function ConversationInitiation({ data }: { data: Record<string, number> }) {
  if (!data || Object.keys(data).length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Conversation Initiation</h2>
        <p className="text-gray-500 dark:text-gray-400">No conversation initiation data available</p>
      </div>
    );
  }

  const chartData = Object.entries(data).map(([name, count]) => ({
    name,
    value: count
  }));

  const total = chartData.reduce((sum, item) => sum + item.value, 0);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Conversation Initiation</h2>
      <div className="h-64">
        <PieChart width={400} height={250}>
          <Pie
            data={chartData}
            cx={200}
            cy={125}
            labelLine={false}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
            label={({ name, value }) => `${name} (${((value / total) * 100).toFixed(0)}%)`}
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip formatter={(value) => `${value} conversations`} />
        </PieChart>
      </div>
      <div className="mt-4 grid grid-cols-2 gap-4">
        {chartData.map((item, index) => (
          <div key={item.name} className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
            <span className="text-sm text-gray-600 dark:text-gray-300">
              {item.name}: {item.value} starts
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Home() {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisStep, setAnalysisStep] = useState<AnalysisStep>(null);
  const [error, setError] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<Analysis | null>(null);

  const handleFileSelect = async (file: File) => {
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

  return (
    <main className="min-h-screen p-8 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white">Chat Analysis</h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Upload your WhatsApp chat export and get insights about your relationship
          </p>
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

        {analysis && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Message Stats */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Message Statistics</h2>
                <div className="space-y-4">
                  {Object.entries(analysis.messageStats.totalMessages).map(([person, count]) => (
                    <div key={person} className="flex justify-between items-center">
                      <span className="text-gray-700 dark:text-gray-300">{person}</span>
                      <span className="font-semibold text-gray-900 dark:text-white">{count} messages</span>
                    </div>
                  ))}
                </div>
                <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <h3 className="text-lg font-semibold mb-2">Longest Conversation</h3>
                  <p className="text-gray-700 dark:text-gray-300">Date: {analysis.messageStats.longestConversation.date}</p>
                  <p className="text-gray-700 dark:text-gray-300">Messages: {analysis.messageStats.longestConversation.messageCount}</p>
                  <p className="text-gray-700 dark:text-gray-300">Duration: {analysis.messageStats.longestConversation.duration}</p>
                </div>
              </div>

              {/* Relationship Type and Status */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Relationship Insights</h2>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-gray-800 dark:text-gray-200">Type</h3>
                    <p className="text-gray-700 dark:text-gray-300">{analysis.relationshipInsights.relationshipType}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800 dark:text-gray-200">Strength</h3>
                    <p className="text-gray-700 dark:text-gray-300">{analysis.relationshipInsights.relationshipStrength}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800 dark:text-gray-200">Status</h3>
                    <p className="text-gray-700 dark:text-gray-300">{analysis.relationshipInsights.relationshipStatus}</p>
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
                  {analysis.relationshipInsights.redFlags.length > 0 ? (
                    <ul className="list-disc list-inside space-y-2">
                      {analysis.relationshipInsights.redFlags.map((flag, index) => (
                        <li key={index} className="text-red-600 dark:text-red-400">{flag}</li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-green-600 dark:text-green-400">{analysis.relationshipInsights.redFlagAnalysis}</p>
                  )}
                </div>
                
                <div>
                  <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">Positive Indicators</h3>
                  <ul className="list-disc list-inside space-y-2">
                    {analysis.relationshipInsights.positiveIndicators.map((indicator, index) => (
                      <li key={index} className="text-green-600 dark:text-green-400">{indicator}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Breakup Reasons */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Relationship Status</h2>
              {analysis.relationshipInsights.breakupReasons.length > 0 ? (
                <div>
                  <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">Reasons for Separation</h3>
                  <ul className="list-disc list-inside space-y-2">
                    {analysis.relationshipInsights.breakupReasons.map((reason, index) => (
                      <li key={index} className="text-gray-700 dark:text-gray-300">{reason}</li>
                    ))}
                  </ul>
                </div>
              ) : (
                <p className="text-green-600 dark:text-green-400">No separation indicators found. The relationship shows strong positive dynamics!</p>
              )}
            </div>

            {/* Charts and Visualizations */}
            {analysis.messageStats.messagesByTimeOfDay && (
              <MessageTimeDistribution data={analysis.messageStats.messagesByTimeOfDay} />
            )}

            {analysis.languageAnalysis.sentimentOverTime && (
              <SentimentOverTime 
                data={analysis.languageAnalysis.sentimentOverTime} 
                participants={Object.keys(analysis.messageStats.totalMessages)}
              />
            )}

            {analysis.timeAnalysis.conversationInitiation && (
              <ConversationInitiation data={analysis.timeAnalysis.conversationInitiation} />
            )}

            {/* Language Analysis */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(analysis.languageAnalysis.topWords).map(([person, words]) => (
                <div key={person} className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                  <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">{person}'s Communication</h2>
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
                        {analysis.languageAnalysis.mostUsedEmojis[person].map((emoji, index) => (
                          <span key={index}>{emoji}</span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">Common Phrases</h3>
                      <ul className="space-y-2">
                        {analysis.languageAnalysis.commonPhrases[person].map((phrase, index) => (
                          <li key={index} className="text-gray-700 dark:text-gray-300">"{phrase}"</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Communication and Emotional Analysis */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(analysis.relationshipInsights.communicationStyle).map(([person, style]) => (
                <div key={person} className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                  <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">{person}'s Style</h2>
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-semibold text-gray-800 dark:text-gray-200">Communication Style</h3>
                      <p className="text-gray-700 dark:text-gray-300">{style}</p>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800 dark:text-gray-200">Emotional Expression</h3>
                      <p className="text-gray-700 dark:text-gray-300">{analysis.relationshipInsights.emotionalExpression[person]}</p>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800 dark:text-gray-200">Emotional Support</h3>
                      <ul className="list-disc list-inside space-y-1">
                        {analysis.languageAnalysis.emotionalSupport[person].map((support, index) => (
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
                  <p className="text-gray-700 dark:text-gray-300">{analysis.relationshipInsights.mutualUnderstanding.level}</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 dark:text-gray-200">Description</h3>
                  <p className="text-gray-700 dark:text-gray-300">{analysis.relationshipInsights.mutualUnderstanding.description}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
