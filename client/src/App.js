import React, { Fragment, useEffect } from 'react';
import { Route, Switch } from 'react-router-dom';

import './App.css';
import store from './redux/store';
import Navbar from './components/navbar/navbar.component';
import LandingPage from './pages/landingpage/landing.component';
import RegisterPage from './pages/registerpage/registerpage.component';
import LoginPage from './pages/loginPage/loginpage.component';
import Dashboard from './pages/dashboard/dashboard.component';
import setAuthToken from './utils/setAuthToken';
import { loadUser } from './redux/reducers/auth/auth.actions';
import PrivateRoute from './routing/privateroute.component';



const App = () => {

  useEffect(() => {
    if (localStorage.token) {
      setAuthToken(localStorage.token);
    }
    store.dispatch(loadUser());
  }, []);

  return (<Fragment>
    <Navbar />
    <Route path='/' exact component={LandingPage} />
    <section className='container'>
      <Switch>
        <Route path='/register' exact component={RegisterPage} />
        <Route path='/login' exact component={LoginPage} />
        <PrivateRoute path='/dashboard' exact component={Dashboard} />
      </Switch>
    </section>
  </Fragment>)
}

export default App;
