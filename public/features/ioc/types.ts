import {EsAnswerIOC, FileData, KbnCallStatus, C2Data, HostData, UserData} from '../../types';

export interface IOCState {
  status: KbnCallStatus;
  error: string | undefined | null;
  ioc: EsAnswerIOC | undefined;
};

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
};
