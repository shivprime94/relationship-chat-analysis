const PATTERNS = {
  phoneNumber: /\b(?:\+?(\d{1,3}))?[-. (]*(\d{3})[-. )]*(\d{3})[-. ]*(\d{4})\b/g,
  email: /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g,
  creditCard: /\b(?:\d[ -]*?){13,16}\b/g,
  bankAccount: /\b\d{8,12}\b/g,
  apiKey: /['"]?[a-zA-Z0-9_-]{20,}['"]?/g,
  url: /(https?:\/\/[^\s]+)/g,
  ipAddress: /\b(?:\d{1,3}\.){3}\d{1,3}\b/g,
};

export function sanitizeText(text: string, participants: string[]): string {
  let sanitized = text;
  
  // Create a regex pattern that excludes participant names
  const participantPattern = participants.map(name => name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|');
  
  // Replace sensitive information with placeholders, but preserve participant names
  Object.entries(PATTERNS).forEach(([key, pattern]) => {
    sanitized = sanitized.replace(pattern, (match) => {
      // Check if the match is a participant name
      if (new RegExp(participantPattern, 'i').test(match)) {
        return match;
      }
      return `[${key.toUpperCase()}_REDACTED]`;
    });
  });

  return sanitized;
}

export function extractParticipants(text: string): string[] {
  // Updated regex to match WhatsApp message headers with both 12h and 24h time formats
  const messageHeaderRegex = /\d{1,2}\/\d{1,2}\/\d{2,4},\s+(?:\d{1,2}:\d{2}(?::\d{2})?(?:\s*[AaPp][Mm])?)\s*-\s*([^:]+):/g;
  const participants = new Set<string>();
  
  let match;
  while ((match = messageHeaderRegex.exec(text)) !== null) {
    const name = match[1].trim();
    // Filter out system messages and group notifications
    if (name && 
        !name.includes('You created group') &&
        !name.includes('Messages and calls are end-to-end encrypted') &&
        !name.includes('changed the subject') &&
        !name.includes('changed this group') &&
        !name.includes('added') &&
        !name.includes('removed') &&
        !name.includes('left') &&
        !name.includes('joined')) {
      participants.add(name);
    }
  }

  // Log for debugging
  console.log('Found participants:', Array.from(participants));

  return Array.from(participants);
} 