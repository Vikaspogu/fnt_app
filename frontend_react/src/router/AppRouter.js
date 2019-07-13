import React from 'react';
import {
  HashRouter as Router,
  Route,
  Switch,
  Redirect,
} from 'react-router-dom';
import RequestSocial from '../screens/RequestSocial';
import RequestTechTalk from '../screens/RequestTechTalk';
import SocialEventsList from '../screens/SocialEventsList';
import TechEventsList from '../screens/TechEventsList';
import AddPoll from '../screens/AddPoll';

const AppRouter = () => (
  <Router>
    <div>
      <Switch>
        <Route path="/requestsocial" component={RequestSocial} exact />
        <Route path="/requesttalk" component={RequestTechTalk} exact />
        <Route path="/socialevent" component={SocialEventsList} exact />
        <Route path="/techevent" component={TechEventsList} exact />
        <Route path="/addpoll" component={AddPoll} exact/>
        <Redirect from="*" to="/techevent" key="default-route" />
      </Switch>
    </div>
  </Router>
);

export default AppRouter;
