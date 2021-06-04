import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';


const PrivateRoute = ({ component: Component, auth: { isAuthenticated, loading }, ...rest }) => (
    <Route render={props => (!isAuthenticated && !loading) ? (<Redirect to='/login' />) : <Component {...props} />} />
)

const mapstateToProps = state => ({
    auth: state.auth
})

export default connect(mapstateToProps)(PrivateRoute);

