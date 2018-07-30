import middleware from '../middleware';
import { controlVoiceConnections, voiceChat } from './voiceChat';
import { wikipedia } from './wikipedia';

middleware.append(
  controlVoiceConnections,
  voiceChat,
  wikipedia,
);
