import {EsAnswerIOC, FileData, KbnCallStatus} from '../../types';

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
};
