import React from 'react';
import ReactDOM from 'react-dom';
import { hashHistory, Router, Route } from 'react-router';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';


// 插件提供 onTouchTap() 事件可用
import injectTapEventPlugin from 'react-tap-event-plugin';
injectTapEventPlugin();

// 页面
import HomePage from './components/HomePage';
import ContentPage from './components/ContentPage';
import CollectPage from './components/CollectPage';

import './lib/normalize.css';
import './lib/style.scss';

ReactDOM.render(
	<MuiThemeProvider>
        <Router history={hashHistory} >
            <Route path='/' component={HomePage}>
                <Route path='/content' component={ContentPage} />
                <Route path='/collect' component={CollectPage} />
            </Route>
        </Router>
    </MuiThemeProvider>,
    document.getElementById('root')
);

