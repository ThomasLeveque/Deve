import { Switch, Route, Redirect } from 'react-router-dom';

import CreateLink from './pages/CreateLink';
import Login from './pages/Login';
import ForgotPassword from './pages/ForgotPassword';
import SearchLinks from './pages/SearchLinks';
import LinkList from './pages/LinkList';
import LinkDetail from './pages/LinkDetail';

const Routes = () => {
  return (
    <div className="route-container">
      <Switch>
        <Route path="/" exact render={() => <Redirect to="/new" />} />
        <Route path="/create" component={CreateLink} />
        <Route path="/login" component={Login} />
        <Route path="/forgot" component={ForgotPassword} />
        <Route path="/search" component={SearchLinks} />
        <Route path="/top" component={LinkList} />
        <Route path="/new" component={LinkList} />
        <Route path="/link/:linkId" component={LinkDetail} />
      </Switch>
    </div>
  );
};

export default Routes;
