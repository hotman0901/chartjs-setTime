import React from 'react';
import ReactDOM from 'react-dom';
import Page1 from './components/Page1';
import AppRouter from './routers/AppRouter';
import configureStore from './store/configureStore';
import { Provider } from 'react-redux';
import Header from './components/header';
const store = configureStore();
const jsx = (
  
    <Provider store={store}>
      <div>
        <AppRouter />
      </div>
    </Provider>
  );


ReactDOM.render(jsx, document.getElementById('app'));
