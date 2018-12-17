import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import 'bootstrap/dist/css/bootstrap.css'; //reactstrap
import { BrowserRouter} from "react-router-dom";
import store from './store/BeOurGuestStore';
import { Provider } from 'mobx-react';

ReactDOM.render(
    <Provider
        store={store}>
        <BrowserRouter>
        <App />
        </BrowserRouter>
    </Provider>,
    document.getElementById('root')
);
registerServiceWorker();

