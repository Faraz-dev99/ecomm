import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { configureStore } from '@reduxjs/toolkit';
import rootReducer from './reducer/rootreducer';
import { Provider } from 'react-redux';
import toast, { Toaster } from 'react-hot-toast';


const store=configureStore({
        reducer:rootReducer,
        middleware: (getDefaultMiddleware) =>
          getDefaultMiddleware({
            serializableCheck: {
              // Ignore these action types
              ignoredActions: ['product/setProduct'],
              // Ignore these field paths in all actions
              ignoredActionPaths: ['payload'],
              // Ignore these paths in the state
              ignoredPaths: ['product.product'],
            },
          }),
});

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Provider store={store}>
    <App />
    
    </Provider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
