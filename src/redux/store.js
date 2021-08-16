import {createStore,combineReducers} from 'redux'
import {CollapsedReducer} from './reducer/collapsedReducer'
import {LoadingReducer} from './reducer/loadingReducer'

const reducer = combineReducers({
    CollapsedReducer,
    LoadingReducer
})

const store = createStore(reducer)

export default store