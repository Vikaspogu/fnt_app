import React from 'react';
import {
  HashRouter as Router,
  Route,
  Switch,
  Redirect,
} from 'react-router-dom';
import RequestSocial from '../pages/RequestSocial';
import RequestTechTalk from '../pages/RequestTechTalk';
import SocialEventsList from '../pages/SocialEventsList';
import TechEventsList from '../pages/TechEventsList';

const AppRouter = () => (
  <Router>
    <div>
      <Switch>
        <Route path="/requestsocial" component={RequestSocial} exact />
        <Route path="/requesttalk" component={RequestTechTalk} exact />
        <Route path="/socialevent" component={SocialEventsList} exact />
        <Route path="/techevent" component={TechEventsList} exact />
        <Redirect from="*" to="/techevent" key="default-route" />
      </Switch>
    </div>
  </Router>
);

export default AppRouter;
