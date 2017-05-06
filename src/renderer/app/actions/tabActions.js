import * as actionTypes from '../constants/actionTypes';

export function openTab(id, path, title) {
    return {
        type: actionTypes.tabActions.OPEN,
        payload: {id, path, title}
    }
}

export function swapTab(fromID, toID) {
    return {
        type: actionTypes.tabActions.SWAP,
        payload: {fromID: fromID, toID: toID}
    }
}

export function closeTab(id) {
    return {
        type: actionTypes.tabActions.CLOSE,
        payload: {id}
    }
}

export function activateTab(id) {
    return {
        type: actionTypes.tabActions.ACTIVATE,
        payload: {id}
    }
}

export function modifyTab(id, modified) {
    return {
        type: actionTypes.tabActions.MODIFY,
        payload: {id, modified}
    }
}