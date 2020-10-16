import * as ConfigActions from "./config/configActions";
import * as RtopsActions from './rtops/rtopsActions';

export const ActionCreators = Object.assign({}, {...ConfigActions, ...RtopsActions});
