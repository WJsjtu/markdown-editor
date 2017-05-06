import * as types from '../constants/actionTypes';

/**
 * Task {
     *      id:             {string}    Identity of a document.
     *      path:           {string}    Local file path.
     *      title:          {string}    Tile for the document
     *      modified:       {bool}      Whether the document is modified.
     *      tab:            {element}   The tab element.
     * }
 */

const initialState = {
    active: null,
    order: [],
    tabs: {}
};

export default function tabs(state = initialState, action) {

    const tabState = state;

    switch (action.type) {

        case types.tabActions.OPEN:

            !function () {
                const {id, path, title} = action.payload;
                tabState.tabs[id] = {
                    id: id,
                    path: path,
                    title: title,
                    tab: null,
                    modified: false
                };
                tabState.order.push(id);
                tabState.active = id;
            }();

            return {...state};

        case types.tabActions.SWAP:

            !function () {
                const {fromID, toID} = action.payload;
                tabState.active = fromID;
                const fromIndex = tabState.order.indexOf(fromID), toIndex = tabState.order.indexOf(toID);
                if (fromIndex != -1 && toIndex != -1) {
                    tabState.order.splice(fromIndex, 1);
                    tabState.order.splice(tabState.order.indexOf(toID) + (toIndex > fromIndex ? 1 : 0), 0, fromID);
                }
            }();

            return {...state};

        case types.tabActions.CLOSE:

            !function () {
                const {id} = action.payload;
                delete tabState.tabs[id];
                tabState.order.splice(tabState.order.indexOf(id), 1);
            }();

            return {...state};

        case types.tabActions.MODIFY:

            !function () {
                const {id} = action.payload;
                tabState.tabs[id].modified = true;
            }();

            return {...state};

        case types.tabActions.ACTIVATE:

            !function () {
                const {id} = action.payload;
                tabState.active = id;
            }();

            return {...state};

        default:
            return state;
    }
}