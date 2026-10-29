import React from "react";
import ReactDom from 'react-dom/client';
import App from './App';
import reportWebVitals from './reportWebVitals';
 import {Provider} from "./react-redux";
 import Store from "./redux/store";


 ReactDom.render(
    <Provider store={Store}>
        <App/>
    </Provider>,
    document.getElementById("root")
 );

reportWebVitals();