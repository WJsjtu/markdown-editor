import {createStore, compose, applyMiddleware} from 'redux';
import rootReducer from '../reducers';
import docMiddleware from '../middleware/docMiddleware';


export default function configureStore(initialState) {

    const finalCreateStore = compose(
        applyMiddleware(
            docMiddleware
        )
    )(createStore);

    return finalCreateStore(rootReducer, initialState, window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__());
}