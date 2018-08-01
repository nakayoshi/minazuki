# minazuki-bot-discord
## Deployment
Edit `.env` to pass environment variable.
```env
DISCORD_TOKEN=your discord api token here
VOICETEXT_TOKEN=and your voicetext's token here
```

## Features
| Command               | Discription                                      |
| :-------------------- | :----------------------------------------------- |
| `@mention wiki foo`   | Search `foo` in Wikipedia                        |
| `@mention join`       | Join voice channel which you currently joined in |
| `@mention leave`      | Leave from voice channel                         |
| After `@mention join` | Bot reads message you sent in your voice chat    |
| Always                | Detect your haiku                                |

## Requirements
- ffmpeg
