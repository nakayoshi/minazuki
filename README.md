# minazuki
[![Build Status](https://travis-ci.com/neet/minazuki.svg?branch=master)](https://travis-ci.com/neet/minazuki)
[![Maintainability](https://api.codeclimate.com/v1/badges/1c8141f59838e0b327ac/maintainability)](https://codeclimate.com/github/neet/minazuki/maintainability)

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
