import { createStore, applyMiddleware, compose } from 'redux';
import { persistStore } from 'redux-persist';
import createSagaMiddleware from 'redux-saga';

// creates the store
export default (rootReducer, rootSaga) => {
  /* ------------- Redux Configuration ------------- */
  const middleware = [];
  const enhancers = [];

  /* ------------- Saga Middleware ------------- */
  const sagaMiddleware = createSagaMiddleware();
  middleware.push(sagaMiddleware);

  /* ------------- Assemble Middleware ------------- */
  enhancers.push(applyMiddleware(...middleware));

  const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

  /* ------------- AutoRehydrate Enhancer ------------- */
  // add the autoRehydrate enhancer
  const store = createStore(rootReducer, composeEnhancers(...enhancers));
  const persistor = persistStore(store, null, null);

  // kick off root saga
  sagaMiddleware.run(rootSaga);
  return { persistor, store };
};
