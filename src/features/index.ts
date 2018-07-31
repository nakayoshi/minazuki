import middleware from '../middleware';
import { haiku } from './haiku';
import { controlVoiceConnections, voiceChat } from './voiceChat';
import { wikipedia } from './wikipedia';

middleware.append(
  controlVoiceConnections,
  voiceChat,
  wikipedia,
  haiku,
);
