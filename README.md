# minazuki
[![Build Status](https://travis-ci.com/neet/minazuki.svg?branch=master)](https://travis-ci.com/neet/minazuki)
[![Maintainability](https://api.codeclimate.com/v1/badges/1c8141f59838e0b327ac/maintainability)](https://codeclimate.com/github/neet/minazuki/maintainability)

## Features
| Command               | Discription                                      |
| :-------------------- | :----------------------------------------------- |
| `/wiki article name` | Search `foo` in Wikipedia                        |
| `/eval expr`         | Evaluate JS code                                 |
| `/join [--channel]`  | Join VC you currently joined in then speak messages from the guild |
| `/leave [--channel]` | Leave from voice channel                         |
| `> keyword`           | Quote message                                    |
| Always               | Detect your haiku                                |

## Deployment
First, install dependencies with yarn
```
yarn
```

Then edit `.env` to set environment variables.
```env
DISCORD_TOKEN=your discord api token here
VOICETEXT_TOKEN=and your voicetext's token here
```

Then using [Forever](https://www.npmjs.com/package/forever) which puts Node.js job on background to run bot as a daemon.
```
yarn run start
```

Using following command to kill the bot
```
yarn run stop
```

Alternatively, you could use [Foreman](http://ddollar.github.io/foreman/) which does exact same thing.
```
foreman start
```

## Requirements
- Node.js >= 10
- Yarn
- ffmpeg
