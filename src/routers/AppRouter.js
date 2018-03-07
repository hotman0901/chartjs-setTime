import React from 'react';
import { BrowserRouter, Route, Switch, Link, NavLink } from 'react-router-dom';
import Page1 from '../components/Page1';
import Page2 from '../components/Page2';
import Page3 from '../components/Page3';
import Page4 from '../components/Page4';
import Page5 from '../components/Page5';
import Page6 from '../components/Page6';
import Page7 from '../components/Page7';
import Header from '../components/header';

const AppRouter = () => (
    <BrowserRouter>
      <div>
        <Header />
        <Switch>
          <Route path="/" component={Page1} exact />
          <Route path="/page1" component={Page1} exact />
          <Route path="/page2" component={Page2} exact/>
          <Route path="/page3" component={Page3} exact />
          <Route path="/page4" component={Page4} exact />
          <Route path="/page5" component={Page5} exact />
          <Route path="/page6" component={Page6} exact />
          <Route path="/page7" component={Page7} exact />
        </Switch>
      </div>
    </BrowserRouter>
  );
  
  export default AppRouter;
  