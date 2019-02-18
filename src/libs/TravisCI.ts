import { PresenceStatusData } from 'discord.js';
import fetch from 'node-fetch';
import { config } from '../config';
import { Minazuki } from '../Minazuki';
import { delay } from '../utils/delay';

export type BuildState =
  | 'finished'
  | 'passed'
  | 'failed'
  | 'errored'
  | 'canceled'
  | 'started'
  | 'created';

export type EventType = 'push' | 'pull_request' | 'api' | 'cron';

export interface Build {
  '@type': 'build';
  '@href': string;
  '@representation': 'minimal';
  id: number;
  number: string;
  state: BuildState;
  duration: 108;
  event_type: EventType;
  previous_state: BuildState;
  pull_request_title?: string | null;
  pull_request_number?: number | null;
  started_at: string;
  finished_at: string;
  private: false;
}

export interface Repository {
  '@type': 'repository';
  '@href': string;
  '@representation': 'minimal';
  id: number;
  name: string;
  slug: string;
}

export interface Branch {
  '@type': 'branch';
  '@href': string;
  '@representation': 'standard';
  name: string;
  repository: Repository;
  default_branch: boolean;
  exists_on_github: boolean;
  last_build: Build;
}

export class TravisCI {
  private url = 'https://api.travis-ci.com';
  private repoId = '5566063';
  private token = config.travisCIToken;
  private interval = config.travisCIInterval;

  constructor(private app: Minazuki) {}

  private async get<T>(url: string) {
    return fetch(url, {
      headers: {
        'Travis-API-Version': '3',
        Authorization: this.token,
      },
    }).then(res => res.json() as Promise<T>);
  }

  public async fetchMasterBranch() {
    return this.get<Branch>(`${this.url}/repo/${this.repoId}/branch/master`);
  }

  private mapBuildStateToPresence(status: BuildState): PresenceStatusData {
    switch (status) {
      case 'passed':
      case 'canceled':
      case 'finished':
        return 'online';

      case 'created':
      case 'started':
        return 'idle';

      case 'errored':
      case 'failed':
      default:
        return 'dnd';
    }
  }

  private async setBuildToPresence(branch: Branch) {
    const { user } = this.app.client;
    const { state } = branch.last_build;

    if (!user) {
      return;
    }

    user.setPresence({
      status: this.mapBuildStateToPresence(state),
      activity: {
        name: `Travis CI: ${state}`,
        url: `https://travis-ci.com/${branch.repository.slug}`,
        type: 'PLAYING',
      },
    });
  }

  public async watchBuildStatus() {
    while (true) {
      const branch = await this.fetchMasterBranch();
      await this.setBuildToPresence(branch);
      await delay(this.interval);
    }
  }
}
