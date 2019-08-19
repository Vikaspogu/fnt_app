import * as React from 'react';
import { Route, RouteComponentProps, Switch } from 'react-router-dom';
import { Alert, PageSection } from '@patternfly/react-core';
import { DynamicImport } from '@app/DynamicImport';
import { accessibleRouteChangeHandler } from '@app/utils/utils';
import { ReportedIssues } from '@app/screens/ReportedIssues';
import {RequestSocial} from '@app/screens/RequestSocial';
import {RequestTechTalk} from '@app/screens/RequestTechTalk';
import {SocialEvents} from '@app/screens/SocialEvents';
import {TechTalks} from '@app/screens/TechTalks';
import { NotFound } from '@app/screens/NotFound';
import DocumentTitle from 'react-document-title';
import { LastLocationProvider, useLastLocation } from 'react-router-last-location';

let routeFocusTimer: number;
const getSupportModuleAsync = () => {
  return () => import(/* webpackChunkName: 'support' */ '@app/screens/Support');
};

const Support = (routeProps: RouteComponentProps) => {
  const lastNavigation = useLastLocation();
  return (
    <DynamicImport load={getSupportModuleAsync()} focusContentAfterMount={lastNavigation !== null}>
      {(Component: any) => {
        let loadedComponent: any;
        if (Component === null) {
          loadedComponent = (
            <PageSection aria-label="Loading Content Container">
              <div className="pf-l-bullseye">
                <Alert title="Loading" className="pf-l-bullseye__item" />
              </div>
            </PageSection>
          );
        } else {
          loadedComponent = <Component.Support {...routeProps} />;
        }
        return loadedComponent;
      }}
    </DynamicImport>
  );
};

const RouteWithTitleUpdates = ({ component: Component, isAsync = false, title, ...rest }) => {
  const lastNavigation = useLastLocation();

  function routeWithTitle(routeProps: RouteComponentProps) {
    return (
      <DocumentTitle title={title}>
        <Component {...rest} {...routeProps} />
      </DocumentTitle>
    );
  }

  React.useEffect(() => {
    if (!isAsync && lastNavigation !== null) {
      routeFocusTimer = accessibleRouteChangeHandler();
    }
    return () => {
      clearTimeout(routeFocusTimer);
    };
  }, []);
  return <Route render={routeWithTitle} />;
};

export interface IAppRoute {
  label: string;
  component: React.ComponentType<RouteComponentProps<any>> | React.ComponentType<any>;
  icon: any;
  exact?: boolean;
  path: string;
  title: string;
  isAsync?: boolean;
}

const routes: IAppRoute[] = [
  {
    component: TechTalks,
    exact: true,
    icon: null,
    isAsync: true,
    label: 'Upcoming Tech Talks',
    path: '/',
    title: 'Upcoming Tech Talks'
  },
  {
    component: SocialEvents,
    exact: true,
    icon: null,
    label: 'Upcoming Social Events',
    path: '/socialevent',
    title: 'Upcoming Social Events'
  },
  {
    component: RequestSocial,
    exact: true,
    icon: null,
    label: 'Requested Social',
    path: '/requestedsocial',
    title: 'Requested Social'
  },
  {
    component: RequestTechTalk,
    exact: true,
    icon: null,
    isAsync: true,
    label: 'Requested Tech Talk',
    path: '/requestedtalk',
    title: 'Requested Tech Talk'
  },
  {
    component: ReportedIssues,
    exact: true,
    icon: null,
    isAsync: true,
    label: 'Reported Issues',
    path: '/reportedissues',
    title: 'Reported Issues'
  }
];

const AppRoutes = () => (
  <LastLocationProvider>
    <Switch>
      {routes.map(({ path, exact, component, title, isAsync, icon }, idx) => (
        <RouteWithTitleUpdates
          path={path}
          exact={exact}
          component={component}
          key={idx}
          icon={icon}
          title={title}
          isAsync={isAsync}
        />
      ))}
      <RouteWithTitleUpdates component={NotFound} title={'404 Page Not Found'} />
    </Switch>
  </LastLocationProvider>
);

export { AppRoutes, routes };
