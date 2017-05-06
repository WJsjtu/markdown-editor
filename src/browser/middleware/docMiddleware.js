import {REDUX_TAB_EVENT} from '../constants/eventTypes';

export default store => next => action => {
    const event = new CustomEvent(REDUX_TAB_EVENT, {detail: {action: action}});
    document.dispatchEvent(event);
    next(action);
}