import type { SafetyFlag } from '../types';

const BLOCKED_USERNAMES = new Set([
  'admin', 'administrator', 'moderator', 'mod', 'visby', 'visbyapp', 'support',
  'help', 'system', 'staff', 'official', 'dev', 'developer',
  'fuck', 'shit', 'ass', 'bitch', 'dick', 'cock', 'pussy', 'bastard',
  'nigger', 'nigga', 'faggot', 'fag', 'slut', 'whore', 'retard',
  'nazi', 'hitler', 'porn', 'sex', 'xxx', 'nude', 'naked',
  'kys', 'kill', 'die', 'rape', 'molest',
]);

export function isUsernameAllowed(username: string): { allowed: boolean; reason?: string } {
  const lower = username.toLowerCase().replace(/[_0-9]/g, '');
  if (BLOCKED_USERNAMES.has(lower)) {
    return { allowed: false, reason: 'That username is not allowed. Please choose another.' };
  }
  for (const blocked of BLOCKED_USERNAMES) {
    if (blocked.length >= 4 && lower.includes(blocked)) {
      return { allowed: false, reason: 'That username contains inappropriate language. Please choose another.' };
    }
  }
  return { allowed: true };
}

const HIGH_SELF_HARM = /\b(kill\s*my\s*self|suicide|want\s*to\s*die|don'?t\s*want\s*to\s*(?:be\s*alive|live|exist)|hurt\s*my\s*self|cut\s*my\s*self|end\s*(?:it|my\s*life)|self[- ]?harm)\b/i;

const HIGH_ABUSE = /\b(hits?\s*me|hurts?\s*me|touches?\s*me\s*(?:there|weird|wrong)|scared\s*of\s*(?:my\s*)?(?:dad|mom|parent|step|uncle|aunt|teacher|coach)|someone\s*(?:hurts?|hits?|touches?)\s*me|makes?\s*me\s*(?:do\s*things|take\s*off|undress))\b/i;

const HIGH_VIOLENCE = /\b(kill\s*(?:someone|them|him|her|people|you|everybody)|shoot\s*(?:up|someone|them|people)|bomb|bring\s*a\s*(?:gun|knife|weapon)|hurt\s*(?:someone|them|people|others))\b/i;

const LOW_DISTRESS = /\b(nobody\s*likes?\s*me|no\s*friends?|hate\s*my\s*(?:self|life)|i'?m?\s*(?:worthless|useless|stupid|ugly|dumb|a\s*loser)|everyone\s*hates?\s*me|i\s*don'?t\s*matter|lonely|all\s*alone|nobody\s*cares?)\b/i;

const LOW_INAPPROPRIATE = /\b(sex|porn|naked|drugs?|weed|alcohol|beer|wine|vodka|cigarette|vape|vaping|gun|pistol|rifle)\b/i;

const PERSONAL_INFO_REQUEST = /\b(my\s*(?:address|phone|number|password|school\s*name)|i\s*live\s*(?:at|on)\s*\d|here'?s?\s*my\s*(?:number|address|email))\b/i;

const HIGH_RESPONSES: string[] = [
  "I hear you, and I'm really glad you told me. You're not alone. Please talk to a grown-up you trust right away — like a parent, teacher, or school counselor. You deserve help. 💜",
  "Thank you for telling me that. It takes a lot of courage. Please find a grown-up you trust and tell them what you told me. You matter so much. 💜",
  "That sounds really hard, and it's not your fault. Please talk to a grown-up you trust about this — they can help. I'm glad you're here. 💜",
];

const LOW_DISTRESS_RESPONSES: string[] = [
  "It sounds like you're going through something tough. Those feelings are real, and it's okay to have them. If they stick around, talking to a grown-up you trust can really help. 💜",
  "I hear you. Sometimes things feel really heavy. You're braver than you think for sharing that. Would it help to talk to someone you trust about it?",
  "That sounds hard. Your feelings matter. If you keep feeling this way, a grown-up you trust — like a parent or teacher — would want to know so they can help. 💜",
];

const INAPPROPRIATE_RESPONSES: string[] = [
  "Hmm, that's not really something I know about! Let's talk about something fun instead. Want to explore a new country? 🌍",
  "I think that's a topic for grown-ups! Want to check out something cool together instead?",
  "Let's talk about something else! Any countries you've been curious about? ✨",
];

const PERSONAL_INFO_RESPONSES: string[] = [
  "Whoa, let's keep that kind of stuff private! It's really important not to share personal info online. What else is on your mind?",
  "Hey, it's best to keep things like that between you and your family. Let's talk about something fun instead! 🌍",
];

function pick(arr: string[]): string {
  return arr[Math.floor(Math.random() * arr.length)];
}

export function filterUserInput(text: string): SafetyFlag {
  const t = text.trim();
  if (!t) return { level: 'none' };

  if (HIGH_SELF_HARM.test(t)) return { level: 'high', category: 'self_harm' };
  if (HIGH_ABUSE.test(t)) return { level: 'high', category: 'abuse_disclosure' };
  if (HIGH_VIOLENCE.test(t)) return { level: 'high', category: 'violence' };
  if (PERSONAL_INFO_REQUEST.test(t)) return { level: 'low', category: 'personal_info' };
  if (LOW_DISTRESS.test(t)) return { level: 'low', category: 'distress' };
  if (LOW_INAPPROPRIATE.test(t)) return { level: 'low', category: 'inappropriate' };

  return { level: 'none' };
}

const BLOCKED_WORDS = new Set([
  'fuck', 'shit', 'damn', 'ass', 'bitch', 'dick', 'cock', 'pussy', 'bastard',
  'crap', 'hell', 'wtf', 'stfu', 'idiot', 'moron', 'retard', 'retarded',
  'nigger', 'nigga', 'faggot', 'fag', 'slut', 'whore', 'kys',
]);

export interface PlaceChatFilterResult {
  allowed: boolean;
  reason?: 'blocked_word' | 'safety_flag';
  hint?: string;
}

export function filterPlaceChatMessage(text: string): PlaceChatFilterResult {
  const t = text.trim().toLowerCase();
  if (!t) return { allowed: false, reason: 'blocked_word', hint: '' };

  const words = t.replace(/[^a-z0-9\s]/g, '').split(/\s+/);
  for (const w of words) {
    if (BLOCKED_WORDS.has(w)) {
      return { allowed: false, reason: 'blocked_word', hint: "Let's keep things friendly!" };
    }
  }

  const flag = filterUserInput(t);
  if (flag.level === 'high') {
    return { allowed: false, reason: 'safety_flag', hint: "That message can't be sent. If you need help, please talk to a grown-up you trust." };
  }
  if (flag.level === 'low' && (flag.category === 'inappropriate' || flag.category === 'personal_info')) {
    return { allowed: false, reason: 'safety_flag', hint: flag.category === 'personal_info' ? "Let's keep personal info private!" : "Let's keep things friendly!" };
  }

  return { allowed: true };
}

export function getSafetyResponse(flag: SafetyFlag): string | null {
  switch (flag.level) {
    case 'high':
      return pick(HIGH_RESPONSES);
    case 'low':
      if (flag.category === 'distress') return pick(LOW_DISTRESS_RESPONSES);
      if (flag.category === 'personal_info') return pick(PERSONAL_INFO_RESPONSES);
      if (flag.category === 'inappropriate') return pick(INAPPROPRIATE_RESPONSES);
      return pick(INAPPROPRIATE_RESPONSES);
    default:
      return null;
  }
}
