import {NavigationPublicPluginStart} from '../../../src/plugins/navigation/public';
import {DataPublicPluginStart} from '../../../src/plugins/data/public';
import {RtopsState} from './features/rtops/types';
import {CoreStart} from 'kibana/public';

export interface RedelkPluginSetup {
  getGreeting: () => string;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface RedelkPluginStart {
}

export interface AppPluginStartDependencies {
  navigation: NavigationPublicPluginStart;
  data: DataPublicPluginStart;
}

export interface KbnApiMiddlewareDeps {
  http: CoreStart['http'];
  notifications: CoreStart['notifications'];
}

export enum KbnCallStatus {
  idle = 'idle',
  pending = 'pending',
  success = 'success',
  failure = 'failure'
}

export interface ECSData {
  version: string;
}

export interface FileHashData {
  md5: string;
}

export interface FileData {
  name: string;
  hash: FileHashData;
  size: string;
}

export interface InfraLogData {
  type: string;
}

export interface InfraData {
  log: InfraLogData;
  attack_scenario: string;
}

export interface EventData {
  category: string;
  kind: string;
  module: string;
  dataset: string;
  action: string;
  type: string;
}

export interface LogFileData {
  path: string;
}

export interface LogData {
  offset: number;
  file: LogFileData;
}

export interface HostData {
  ip_int?: string;
  name?: string;
}

export interface AgentData {
  ephemeral_id: string;
  hostname: string;
  id: string;
  name: string;
  type: string;
  version: string;
}

export interface InputData {
  type: string;
}

export interface ImplantData {
  id: string;
  log_file: string;
}

export interface C2LogData {
  type: string;
}

export interface C2Data {
  program?: string;
  message?: string;
  timestamp?: string;
  log?: C2LogData;
}

export interface UserData {
  name?: string;
}

export interface RtopsDoc {
  '@timestamp': string | undefined;
  '@version': string | undefined;
  agent: AgentData | undefined;
  c2: C2Data | undefined;
  ecs: ECSData | undefined;
  event: EventData | undefined;
  host?: HostData;
  user?: UserData;
  implant: ImplantData | undefined;
  infra: InfraData | undefined;
  input: InputData | undefined;
  log: LogData | undefined;
  message: string | undefined;
  tags: string[] | undefined;
}

export interface EsAnswer {
  _index: string;
  _type: string;
  _id: string;
  _score: number;
  _source: object;
}

export interface RedELKState {
  rtops: RtopsState;
}

export interface EsHitsTotal {
  relation: string;
  value: number;
}

export interface EsHitsRtops {
  hits: RtopsDoc[];
  max_score: number;
  total: EsHitsTotal;
}

export interface EsShards {
  failed: number;
  skipped: number;
  successful: number;
  total: number;
}

export interface EsAnswerRtopsAggs {
  perEventType?: { buckets: [] };
  perHostName?: { buckets: [] };
  perUserName?: { buckets: [] };
}

export interface EsAnswerRtops {
  hits: EsHitsRtops;
  _shards: EsShards;
  timed_out: boolean;
  took: number;
  aggregations?: EsAnswerRtopsAggs;
}
