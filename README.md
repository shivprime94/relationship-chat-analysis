# Relationship Chat Analysis

A sophisticated web application that provides in-depth analysis of WhatsApp chat conversations, offering relationship insights and communication patterns while maintaining complete privacy.

## Features

### Message Analysis
- Total message count per participant
- Time-based distribution analysis (morning, afternoon, evening, night)
- Longest conversation identification with duration
- Average response time calculations
- Message frequency patterns

### Relationship Insights
- Communication style analysis
- Attachment style identification
- Relationship strength evaluation
- Red flags detection (if any)
- Positive relationship indicators
- Mutual understanding assessment
- Emotional expression patterns

### Language Analysis
- Top words used by each participant
- Emoji usage patterns and rankings
- Sentiment tracking over time
- Common phrases identification
- Emotional support language analysis

### Time-based Analytics
- Monthly message distribution
- Daily message averages
- Quick vs. delayed response patterns
- Conversation initiation analysis
- Conversation quality assessment (casual, meaningful, deep)

## Privacy Features
- 🔒 All processing is done locally
- 🚫 No chat data is stored on servers
- 🔐 Automatic removal of sensitive information
- 📱 Phone numbers and personal data are sanitized
- ⚡ Real-time analysis without data persistence

## Technical Stack
- Next.js 14 with App Router
- TypeScript for type safety
- Tailwind CSS for styling
- Google's Gemini AI for analysis
- shadcn/ui components
- Recharts for data visualization

## Setup Instructions

1. Clone the repository:
```bash
git clone <repository-url>
cd relationship-chat-analysis
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
Create a `.env.local` file in the root directory:
```
GEMINI_API_KEY=your_api_key_here
```
Get your Gemini API key from [Google AI Studio](https://makersuite.google.com/app/apikey)

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## How to Use

1. Export your WhatsApp chat:
   - Open WhatsApp conversation
   - Click the three dots menu (⋮)
   - Select "More" > "Export chat"
   - Choose "Without media"
   - Save the exported file

2. Upload the chat file:
   - Visit the application
   - Drop the exported .txt file or click to select
   - Wait for the analysis to complete

3. View Analysis Results:
   - Message Statistics
   - Relationship Dynamics
   - Communication Patterns
   - Language Usage
   - Time-based Analytics
   - Emotional Analysis
   - Conversation Quality Metrics

## Privacy Policy

- No chat data is ever stored on our servers
- All processing happens in your browser
- Sensitive information is automatically removed
- No personal data is collected or shared
- Analysis results are shown only to you

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support, please open an issue in the GitHub repository or contact the maintainers.
