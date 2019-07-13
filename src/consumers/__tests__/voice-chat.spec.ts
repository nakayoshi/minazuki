jest.mock('../../libs/voice-text');

import { Message } from 'discord.js';
import { VoiceText } from '../../libs/voice-text';
import { Minazuki } from '../../minazuki';
import { controlVoiceConnections, voiceChat } from '../voice-chat';

describe('voiceChat', () => {
  it('ignores join from bots', async () => {
    const msg = ({
      content: 'join',
      author: {
        bot: true,
      },
      channel: {
        id: '123',
      },
      mentions: {
        has: jest.fn(() => true),
      },
    } as any) as Message;

    const app = ({
      client: {
        user: true,
      },
    } as any) as Minazuki;

    const next = jest.fn();

    await controlVoiceConnections(msg, app, next);

    expect(next).toBeCalled();
  });

  it('ignores leave from bots', async () => {
    const msg = ({
      content: 'leave',
      author: {
        bot: true,
      },
      channel: {
        id: '123',
      },
      mentions: {
        has: jest.fn(() => true),
      },
    } as any) as Message;

    const app = ({
      client: {
        user: true,
      },
    } as any) as Minazuki;

    const next = jest.fn();

    await controlVoiceConnections(msg, app, next);

    expect(next).toBeCalled();
  });

  it('speaks', async () => {
    const msg = ({
      content: 'hello',
      channel: {
        id: '123',
      },
      author: {
        bot: false,
      },
    } as any) as Message;
    const play = jest.fn();
    const voiceText = new VoiceText('token');
    const app = ({
      voiceText,
      voiceConnections: new Map<string, any>([['123', { play }]]),
    } as any) as Minazuki;
    const next = jest.fn();

    await voiceChat(msg, app, next);

    expect(play).toBeCalledWith('path');
    expect(voiceText.speak).toBeCalledWith('hello');
    expect(next).toBeCalled();
  });

  it("won't speak when there were no connection", async () => {
    const msg = ({
      content: 'hello',
      channel: {
        id: '123',
      },
      author: {
        bot: false,
      },
    } as any) as Message;
    const play = jest.fn();
    const app = ({
      voiceText: new VoiceText('token'),
      voiceConnections: new Map<string, any>(),
    } as any) as Minazuki;
    const next = jest.fn();

    await voiceChat(msg, app, next);

    expect(play).not.toBeCalled();
    expect(next).toBeCalled();
  });

  it('contorls voice connection', async () => {
    const join = jest.fn(() => 'some connection');
    const reply = jest.fn();
    const voiceConnections = new Map();
    const msg = ({
      reply,
      author: {
        bot: false,
      },
      content: 'join',
      channel: {
        id: '123',
      },
      member: {
        voice: {
          channel: { join },
        },
      },
      mentions: {
        has: jest.fn(() => true),
      },
    } as any) as Message;

    const app = ({
      client: {
        user: true,
      },
      voiceConnections,
    } as any) as Minazuki;

    const next = jest.fn();

    await controlVoiceConnections(msg, app, next);

    expect(next).not.toBeCalled();
    expect(join).toBeCalled();
    expect(voiceConnections.get('123')).toEqual('some connection');
    expect(reply).toBeCalled();
  });

  it("won't join to connection if the user has not joined to any vc", async () => {
    const reply = jest.fn();
    const msg = ({
      reply,
      content: 'join',
      author: {
        bot: false,
      },
      channel: {
        id: '123',
      },
      member: {
        voice: {
          channel: null,
        },
      },
      mentions: {
        has: jest.fn(() => true),
      },
    } as any) as Message;

    const app = ({
      client: {
        user: true,
      },
    } as any) as Minazuki;

    const next = jest.fn();

    await controlVoiceConnections(msg, app, next);

    expect(next).not.toBeCalled();
    expect(reply).toBeCalled();
  });

  it('leaves from vc', async () => {
    const leave = jest.fn();
    const reply = jest.fn();
    const voiceConnections = new Map<string, any>([['123', 'some connection']]);
    const msg = ({
      reply,
      content: 'leave',
      author: {
        bot: false,
      },
      channel: {
        id: '123',
      },
      member: {
        voice: {
          channel: { leave },
        },
      },
      mentions: {
        has: jest.fn(() => true),
      },
    } as any) as Message;

    const app = ({
      client: {
        user: true,
      },
      voiceConnections,
    } as any) as Minazuki;

    const next = jest.fn();

    await controlVoiceConnections(msg, app, next);

    expect(next).not.toBeCalled();
    expect(leave).toBeCalled();
    expect(voiceConnections.get('123')).toBeFalsy();
    expect(reply).toBeCalled();
  });

  it("won't leave from vc it user has not joined to any vc", async () => {
    const reply = jest.fn();
    const msg = ({
      reply,
      content: 'leave',
      author: {
        bot: false,
      },
      channel: {
        id: '123',
      },
      member: {
        voice: {
          channel: null,
        },
      },
      mentions: {
        has: jest.fn(() => true),
      },
    } as any) as Message;

    const app = ({
      client: {
        user: true,
      },
    } as any) as Minazuki;

    const next = jest.fn();

    await controlVoiceConnections(msg, app, next);

    expect(next).not.toBeCalled();
    expect(reply).toBeCalled();
  });
});
