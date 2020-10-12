import {C2Data, EsAnswerRtops, FileData, HostData, KbnCallStatus, UserData} from '../../types';

export interface RtopsState {
  status: KbnCallStatus;
  error: string | undefined | null;
  rtops: EsAnswerRtops | undefined;
}

export interface CreateIOCTypeIOC {
  type: string;
}

export interface CreateIOCType {
  '@timestamp': string;
  ioc: CreateIOCTypeIOC;
  file: FileData;
  c2: C2Data;
  host: HostData;
  user: UserData;
}
