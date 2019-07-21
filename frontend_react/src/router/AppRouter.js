import React from 'react';
import {
  HashRouter as Router,
  Route,
  Switch,
  Redirect,
} from 'react-router-dom';
import RequestSocial from '../screens/RequestSocial';
import RequestTechTalk from '../screens/RequestTechTalk';
import SocialEvents from '../screens/SocialEvents';
import TechTalks from '../screens/TechTalks';
import AddPoll from '../screens/AddPoll';

const AppRouter = () => (
  <Router>
    <div>
      <Switch>
        <Route path="/requestedsocial" component={RequestSocial} exact />
        <Route path="/requestedtalk" component={RequestTechTalk} exact />
        <Route path="/socialevent" component={SocialEvents} exact />
        <Route path="/techtalks" component={TechTalks} exact />
        <Route path="/addpoll" component={AddPoll} exact/>
        <Redirect from="*" to="/techtalks" key="default-route" />
      </Switch>
    </div>
  </Router>
);

export default AppRouter;
