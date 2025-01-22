import { NextRequest, NextResponse } from 'next/server';
import { sanitizeText, extractParticipants } from '@/lib/sanitize';
import { GoogleGenerativeAI } from '@google/generative-ai';
import JSZip from 'jszip';

// Initialize Google AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

// Add custom error type
interface ExtractError extends Error {
  message: string;
}

async function extractChatFromZip(file: File | Blob): Promise<string> {
  const zip = new JSZip();
  
  try {
    // Convert File/Blob to ArrayBuffer
    const arrayBuffer = await file.arrayBuffer();
    const zipContent = await zip.loadAsync(arrayBuffer);
    
    console.log('Files in ZIP:', Object.keys(zipContent.files));
    
    // Find any .txt file in the ZIP
    const chatFile = Object.values(zipContent.files).find(file => 
      !file.dir && file.name.toLowerCase().endsWith('.txt')
    );

    if (!chatFile) {
      throw new Error('No text file found in the ZIP. Found files: ' + Object.keys(zipContent.files).join(', '));
    }

    console.log('Found chat file:', chatFile.name);

    // Extract the chat content
    const content = await chatFile.async('string');
    
    // Validate WhatsApp chat format (looking for date/time patterns and message structure)
    const whatsappFormatRegex = /\d{1,2}\/\d{1,2}\/\d{2,4},\s\d{1,2}:\d{2}\s[ap]m\s-\s/i;
    if (!whatsappFormatRegex.test(content)) {
      throw new Error('File does not match WhatsApp chat export format');
    }

    return content;
  } catch (error: unknown) {
    console.error('Error processing ZIP:', error);
    const extractError = error as ExtractError;
    throw new Error(extractError?.message || 'Failed to process ZIP file');
  }
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file');

    if (!file || !(file instanceof Blob)) {
      return NextResponse.json(
        { error: 'No valid file provided' },
        { status: 400 }
      );
    }

    // Extract chat content from ZIP
    let text: string;
    try {
      text = await extractChatFromZip(file);
    } catch (error: unknown) {
      console.error('Extraction error:', error);
      const extractError = error as ExtractError;
      return NextResponse.json(
        { error: extractError?.message || 'Failed to extract chat from ZIP file' },
        { status: 400 }
      );
    }
    
    // Extract participants
    const participants = extractParticipants(text);
    
    if (participants.length === 0) {
      return NextResponse.json(
        { error: 'No participants found in chat' },
        { status: 400 }
      );
    }

    // Ensure we have at least two participants
    const mainParticipants = participants.slice(0, 2);
    if (mainParticipants.length === 1) {
      mainParticipants.push("Other");
    }

    // Sanitize the chat content
    const sanitizedText = sanitizeText(text, participants);

    // Initialize Gemini model
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

    // Prepare the prompt
    const prompt = `As an experienced dating coach with years of professional expertise in relationship dynamics, perform a thorough analysis of this WhatsApp chat conversation. Calculate all metrics precisely and provide detailed insights in valid JSON format.

    For the chat between ${mainParticipants.join(' and ')}, calculate:

    1. Message Statistics:
    - Count total messages for each person
    - Calculate average response times (in minutes)
    - Track message distribution across time periods:
      * Morning (6 AM - 12 PM)
      * Afternoon (12 PM - 6 PM)
      * Evening (6 PM - 10 PM)
      * Night (10 PM - 6 AM)
    - Identify the longest conversation by:
      * Finding consecutive messages within 30 minutes
      * Recording date, message count, and duration

    2. Relationship Analysis:
    - Count compliments and positive affirmations
    - Identify communication patterns and attachment styles
    - Evaluate relationship dynamics and strength
    - Assess emotional expression and support
    - Look for any concerning patterns or red flags
    - Analyze mutual understanding and respect

    3. Language Analysis:
    - Extract top 5 most frequently used words for each person
    - Count and rank emoji usage
    - Track sentiment changes over time (daily):
      * Calculate sentiment scores between 0 and 1 for each person
      * 0 represents most negative sentiment
      * 0.5 represents neutral sentiment
      * 1 represents most positive sentiment
    - Identify common phrases and expressions
    - Analyze emotional support language

    4. Time-based Analysis:
    - Calculate messages per month
    - Determine average daily message count
    - Analyze response patterns:
      * Quick responses (within 5 minutes)
      * Delayed responses (over 30 minutes)
    - Track conversation initiation
    - Evaluate conversation depth and quality

    Analyze the following chat content and provide EXACT calculations for each metric. Ensure all sentiment scores are normalized between 0 and 1:
    ${sanitizedText}

    Return ONLY this exact JSON structure with calculated values. For sentiment scores, always return values between 0 and 1:
    {
      "messageStats": {
        "totalMessages": {
          "${mainParticipants[0]}": <calculated_count>,
          "${mainParticipants[1]}": <calculated_count>
        },
        "averageResponseTime": {
          "${mainParticipants[0]}": "<calculated_minutes> minutes",
          "${mainParticipants[1]}": "<calculated_minutes> minutes"
        },
        "messagesByTimeOfDay": {
          "morning": <calculated_count>,
          "afternoon": <calculated_count>,
          "evening": <calculated_count>,
          "night": <calculated_count>
        },
        "longestConversation": {
          "date": "<identified_date>",
          "messageCount": <calculated_count>,
          "duration": "<start_time> - <end_time>"
        }
      },
      "relationshipInsights": {
        "compliments": {
          "${mainParticipants[0]}ToOther": <calculated_count>,
          "${mainParticipants[1]}ToOther": <calculated_count>
        },
        "redFlags": [<identified_flags>],
        "redFlagAnalysis": "<detailed_analysis>",
        "attachmentStyles": {
          "${mainParticipants[0]}": "<identified_style>",
          "${mainParticipants[1]}": "<identified_style>"
        },
        "relationshipType": "<identified_type>",
        "relationshipStrength": "<evaluated_strength>",
        "breakupReasons": [<identified_reasons>],
        "relationshipStatus": "<detailed_status>",
        "positiveIndicators": [<identified_indicators>],
        "communicationStyle": {
          "${mainParticipants[0]}": "<identified_style>",
          "${mainParticipants[1]}": "<identified_style>"
        },
        "emotionalExpression": {
          "${mainParticipants[0]}": "<identified_style>",
          "${mainParticipants[1]}": "<identified_style>"
        },
        "mutualUnderstanding": {
          "level": "<evaluated_level>",
          "description": "<detailed_description>"
        }
      },
      "languageAnalysis": {
        "topWords": {
          "${mainParticipants[0]}": [<calculated_top_words>],
          "${mainParticipants[1]}": [<calculated_top_words>]
        },
        "mostUsedEmojis": {
          "${mainParticipants[0]}": [<calculated_emojis>],
          "${mainParticipants[1]}": [<calculated_emojis>]
        },
        "sentimentOverTime": {
          "dates": [<conversation_dates>],
          "${mainParticipants[0]}": [<sentiment_scores_between_0_and_1>],
          "${mainParticipants[1]}": [<sentiment_scores_between_0_and_1>]
        },
        "commonPhrases": {
          "${mainParticipants[0]}": [<identified_phrases>],
          "${mainParticipants[1]}": [<identified_phrases>]
        },
        "emotionalSupport": {
          "${mainParticipants[0]}": [<identified_patterns>],
          "${mainParticipants[1]}": [<identified_patterns>]
        }
      },
      "timeAnalysis": {
        "messagesPerMonth": {
          "dates": [<month_list>],
          "${mainParticipants[0]}": [<monthly_counts>],
          "${mainParticipants[1]}": [<monthly_counts>]
        },
        "averageMessagesPerDay": {
          "${mainParticipants[0]}": <calculated_average>,
          "${mainParticipants[1]}": <calculated_average>
        },
        "responsePatterns": {
          "quickResponses": {
            "${mainParticipants[0]}": <calculated_count>,
            "${mainParticipants[1]}": <calculated_count>
          },
          "delayedResponses": {
            "${mainParticipants[0]}": <calculated_count>,
            "${mainParticipants[1]}": <calculated_count>
          }
        },
        "conversationInitiation": {
          "${mainParticipants[0]}": <calculated_count>,
          "${mainParticipants[1]}": <calculated_count>
        },
        "conversationQuality": {
          "meaningfulDiscussions": <calculated_count>,
          "casualChats": <calculated_count>,
          "deepConversations": <calculated_count>
        }
      }
    }`;

    try {
      // Generate response
      const result = await model.generateContent([{ text: prompt }]);
      
      if (!result.response) {
        throw new Error('No response from Gemini API');
      }

      const response = result.response;
      const text = response.text();
      
      try {
        // Clean the response text by removing markdown code blocks
        const cleanText = text.replace(/```json\n?|\n?```/g, '').trim();
        
        // Parse the JSON response
        const rawAnalysis = JSON.parse(cleanText);
        
        // Transform and validate the response
        const analysis = {
          messageStats: {
            totalMessages: {
              [mainParticipants[0]]: rawAnalysis.messageStats.totalMessages[mainParticipants[0]] || 0,
              [mainParticipants[1]]: rawAnalysis.messageStats.totalMessages[mainParticipants[1]] || 0
            },
            averageResponseTime: {
              [mainParticipants[0]]: rawAnalysis.messageStats.averageResponseTime[mainParticipants[0]] || "0 minutes",
              [mainParticipants[1]]: rawAnalysis.messageStats.averageResponseTime[mainParticipants[1]] || "0 minutes"
            },
            messagesByTimeOfDay: {
              morning: parseInt(rawAnalysis.messageStats.messagesByTimeOfDay.morning) || 0,
              afternoon: parseInt(rawAnalysis.messageStats.messagesByTimeOfDay.afternoon) || 0,
              evening: parseInt(rawAnalysis.messageStats.messagesByTimeOfDay.evening) || 0,
              night: parseInt(rawAnalysis.messageStats.messagesByTimeOfDay.night) || 0
            },
            longestConversation: rawAnalysis.messageStats.longestConversation || {
              date: "",
              messageCount: 0,
              duration: "0 minutes"
            }
          },
          relationshipInsights: {
            compliments: {
              [`${mainParticipants[0]}ToOther`]: rawAnalysis.relationshipInsights.compliments[`${mainParticipants[0]}ToOther`] || 0,
              [`${mainParticipants[1]}ToOther`]: rawAnalysis.relationshipInsights.compliments[`${mainParticipants[1]}ToOther`] || 0
            },
            redFlags: rawAnalysis.relationshipInsights.redFlags || [],
            redFlagAnalysis: rawAnalysis.relationshipInsights.redFlagAnalysis || "",
            attachmentStyles: {
              [mainParticipants[0]]: rawAnalysis.relationshipInsights.attachmentStyles[mainParticipants[0]] || "secure",
              [mainParticipants[1]]: rawAnalysis.relationshipInsights.attachmentStyles[mainParticipants[1]] || "secure"
            },
            relationshipType: rawAnalysis.relationshipInsights.relationshipType || "romantic",
            relationshipStrength: rawAnalysis.relationshipInsights.relationshipStrength || "strong",
            breakupReasons: rawAnalysis.relationshipInsights.breakupReasons || [],
            relationshipStatus: rawAnalysis.relationshipInsights.relationshipStatus || "",
            positiveIndicators: rawAnalysis.relationshipInsights.positiveIndicators || [],
            communicationStyle: {
              [mainParticipants[0]]: rawAnalysis.relationshipInsights.communicationStyle[mainParticipants[0]] || "direct",
              [mainParticipants[1]]: rawAnalysis.relationshipInsights.communicationStyle[mainParticipants[1]] || "direct"
            },
            emotionalExpression: {
              [mainParticipants[0]]: rawAnalysis.relationshipInsights.emotionalExpression[mainParticipants[0]] || "positive",
              [mainParticipants[1]]: rawAnalysis.relationshipInsights.emotionalExpression[mainParticipants[1]] || "positive"
            },
            mutualUnderstanding: rawAnalysis.relationshipInsights.mutualUnderstanding || {
              level: "high",
              description: ""
            }
          },
          languageAnalysis: {
            topWords: {
              [mainParticipants[0]]: rawAnalysis.languageAnalysis.topWords[mainParticipants[0]] || [],
              [mainParticipants[1]]: rawAnalysis.languageAnalysis.topWords[mainParticipants[1]] || []
            },
            mostUsedEmojis: {
              [mainParticipants[0]]: rawAnalysis.languageAnalysis.mostUsedEmojis[mainParticipants[0]] || [],
              [mainParticipants[1]]: rawAnalysis.languageAnalysis.mostUsedEmojis[mainParticipants[1]] || []
            },
            sentimentOverTime: {
              dates: rawAnalysis.languageAnalysis.sentimentOverTime.dates,
              [mainParticipants[0]]: rawAnalysis.languageAnalysis.sentimentOverTime[mainParticipants[0]] || [],
              [mainParticipants[1]]: rawAnalysis.languageAnalysis.sentimentOverTime[mainParticipants[1]] || []
            },
            commonPhrases: {
              [mainParticipants[0]]: rawAnalysis.languageAnalysis.commonPhrases[mainParticipants[0]] || [],
              [mainParticipants[1]]: rawAnalysis.languageAnalysis.commonPhrases[mainParticipants[1]] || []
            },
            emotionalSupport: {
              [mainParticipants[0]]: rawAnalysis.languageAnalysis.emotionalSupport[mainParticipants[0]] || [],
              [mainParticipants[1]]: rawAnalysis.languageAnalysis.emotionalSupport[mainParticipants[1]] || []
            }
          },
          timeAnalysis: {
            messagesPerMonth: {
              dates: rawAnalysis.timeAnalysis.messagesPerMonth.dates,
              [mainParticipants[0]]: rawAnalysis.timeAnalysis.messagesPerMonth[mainParticipants[0]] || [],
              [mainParticipants[1]]: rawAnalysis.timeAnalysis.messagesPerMonth[mainParticipants[1]] || []
            },
            averageMessagesPerDay: {
              [mainParticipants[0]]: rawAnalysis.timeAnalysis.averageMessagesPerDay[mainParticipants[0]] || 0,
              [mainParticipants[1]]: rawAnalysis.timeAnalysis.averageMessagesPerDay[mainParticipants[1]] || 0
            },
            responsePatterns: {
              quickResponses: {
                [mainParticipants[0]]: rawAnalysis.timeAnalysis.responsePatterns.quickResponses[mainParticipants[0]] || 0,
                [mainParticipants[1]]: rawAnalysis.timeAnalysis.responsePatterns.quickResponses[mainParticipants[1]] || 0
              },
              delayedResponses: {
                [mainParticipants[0]]: rawAnalysis.timeAnalysis.responsePatterns.delayedResponses[mainParticipants[0]] || 0,
                [mainParticipants[1]]: rawAnalysis.timeAnalysis.responsePatterns.delayedResponses[mainParticipants[1]] || 0
              }
            },
            conversationInitiation: {
              [mainParticipants[0]]: rawAnalysis.timeAnalysis.conversationInitiation[mainParticipants[0]] || 0,
              [mainParticipants[1]]: rawAnalysis.timeAnalysis.conversationInitiation[mainParticipants[1]] || 0
            },
            conversationQuality: {
              meaningfulDiscussions: parseInt(rawAnalysis.timeAnalysis.conversationQuality.meaningfulDiscussions) || 0,
              casualChats: parseInt(rawAnalysis.timeAnalysis.conversationQuality.casualChats) || 0,
              deepConversations: parseInt(rawAnalysis.timeAnalysis.conversationQuality.deepConversations) || 0
            }
          }
        };

        // Add debug logging
        console.log('Processed analysis:', JSON.stringify(analysis, null, 2));

        // Validate that all required fields exist and have proper types
        if (!analysis.messageStats?.totalMessages || 
            !analysis.relationshipInsights?.relationshipStatus ||
            !analysis.languageAnalysis?.sentimentOverTime?.dates ||
            !analysis.timeAnalysis?.messagesPerMonth?.dates) {
          throw new Error('Missing required fields in analysis');
        }

        return NextResponse.json(analysis);
      } catch (parseError) {
        console.error('Error parsing Gemini response:', parseError);
        // Return the raw text for debugging
        return NextResponse.json(
          { error: 'Failed to parse analysis results', debug: text },
          { status: 500 }
        );
      }
    } catch (error: unknown) {
      console.error('Gemini API error:', error);
      const apiError = error as ExtractError;
      return NextResponse.json(
        { error: apiError?.message || 'Failed to analyze chat content' },
        { status: 500 }
      );
    }
  } catch (error: unknown) {
    console.error('Error processing chat:', error);
    return NextResponse.json(
      { error: 'Failed to process chat' },
      { status: 500 }
    );
  }
} 