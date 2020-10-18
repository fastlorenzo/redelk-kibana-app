import {NavigationPublicPluginStart} from '../../../src/plugins/navigation/public';
import {DataPublicPluginSetup, DataPublicPluginStart} from '../../../src/plugins/data/public';
import {CoreStart} from 'kibana/public';
import {DashboardStart} from '../../../src/plugins/dashboard/public';
import {EmbeddableStart} from '../../../src/plugins/embeddable/public';
import {VisualizationsStart} from '../../../src/plugins/visualizations/public';
import {SharePluginSetup, SharePluginStart} from '../../../src/plugins/share/public';
import {ConfigState, RtopsState} from "./redux/types";
import {UiSettingsServiceStart} from "kibana/server";

export interface RedelkPluginSetup {
  currentHistory?: unknown;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface RedelkPluginStart {
}

export interface RedelkPluginStartDependencies {
  navigation: NavigationPublicPluginStart;
  data: DataPublicPluginStart;
  dashboard: DashboardStart;
  embeddable: EmbeddableStart;
  visualizations: VisualizationsStart;
  // savedObjects: SavedObjectsStart;
  share: SharePluginStart;
  uiSettings: UiSettingsServiceStart;
}

export type RedelkKibanaService = RedelkPluginStartDependencies & CoreStart;

export interface RedelkPluginSetupDependencies {
  data: DataPublicPluginSetup;
  share?: SharePluginSetup;
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

export enum RedelkInitStatus {
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
  '@timestamp': string;
  '@version': string;
  agent?: AgentData;
  c2?: C2Data;
  ecs?: ECSData;
  event?: EventData;
  host?: HostData;
  user?: UserData;
  implant?: ImplantData;
  infra?: InfraData;
  input?: InputData;
  log?: LogData;
  message: string;
  tags?: string[];
}

export interface EsAnswer<T> {
  _index: string;
  _type: string;
  _id: string;
  _score: number;
  _source: T;
}

export interface RedELKState {
  rtops: RtopsState;
  config: ConfigState;
}

export interface EsHitsTotal {
  relation: string;
  value: number;
}

export interface EsHitsRtops {
  hits: EsAnswer<RtopsDoc>[];
  max_score: number;
  total: EsHitsTotal;
}

export interface EsShards {
  failed: number;
  skipped: number;
  successful: number;
  total: number;
}

export interface EsAnswerRtopsAggsSimple {
  key: string;
  doc_count: number;
}

export interface EsAnswerRtopsAggs {
  perEventType?: { buckets: EsAnswerRtopsAggsSimple[] };
  perHostName?: { buckets: EsAnswerRtopsAggsSimple[] };
  perUserName?: { buckets: EsAnswerRtopsAggsSimple[] };
  perImplant?: { buckets: EsAnswerRtopsAggsSimple[] };
}

export interface EsAnswerRtops {
  hits: EsHitsRtops;
  _shards: EsShards;
  timed_out: boolean;
  took: number;
  aggregations?: EsAnswerRtopsAggs;
}
