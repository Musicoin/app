import {ALLOW_NEXT_TIP} from '../constants/Actions';
import {TIP_TIMEOUT_MILIS} from '../constants/App';

export default function nextTipAllowed(state = true, action) {
  switch (action.type) {
    case ALLOW_NEXT_TIP:
      return action.data;
    default:
      return state;
  }
}