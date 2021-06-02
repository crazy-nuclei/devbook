import React, { Fragment } from 'react';
import { Route, Switch } from 'react-router-dom';

import './App.css';
import Navbar from './components/navbar/navbar.component';
import LandingPage from './pages/landingpage/landing.component';
import RegisterPage from './pages/registerpage/registerpage.component';
import LoginPage from './pages/loginPage/loginpage.component';

const App = () =>
  <Fragment>
    <Navbar />
    <Route path='/' exact component={LandingPage} />
    <section className='container'>
      <Switch>
        <Route path='/register' exact component={RegisterPage} />
        <Route path='/login' exact component={LoginPage} />
      </Switch>
    </section>
  </Fragment>

export default App;
