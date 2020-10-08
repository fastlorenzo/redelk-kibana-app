import {NavigationPublicPluginStart} from '../../../src/plugins/navigation/public';
import {IOCState} from './features/ioc/types';
import {CoreStart} from 'kibana/public';

export interface RedelkPluginSetup {
  getGreeting: () => string;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface RedelkPluginStart {
}

export interface AppPluginStartDependencies {
  navigation: NavigationPublicPluginStart;
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
  ip_int: string;
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
  program: string;
  message: string | undefined;
  timestamp: string | undefined;
  log: C2LogData | undefined;
}

export interface IOCDoc {
  '@timestamp': string | undefined;
  '@version': string | undefined;
  agent: AgentData | undefined;
  c2: C2Data | undefined;
  ecs: ECSData | undefined;
  event: EventData | undefined;
  host: HostData | undefined;
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
  ioc: IOCState;
}

export interface EsHitsTotal {
  relation: string;
  value: number;
}

export interface EsHitsIOC {
  hits: IOCDoc[];
  max_score: number;
  total: EsHitsTotal;
}

export interface EsShards {
  failed: number;
  skipped: number;
  successful: number;
  total: number;
}

export interface EsAnswerIOC {
  hits: EsHitsIOC;
  _shards: EsShards;
  timed_out: boolean;
  took: number;
}
