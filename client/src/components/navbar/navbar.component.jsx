import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

import { logoutUser } from '../../redux/reducers/auth/auth.actions';
import './navbar.styles.css';

const Navbar = ({ auth: { isAuthenticated, loading }, logoutUser }) => {

    const guestLinks = (
        <ul>
            <li><Link to="#!">Developers</Link></li>
            <li><Link to="/register">Register</Link></li>
            <li><Link to="/login">Login</Link></li>
        </ul>
    );

    const authLinks = (
        <ul>
            <li>
                <a onClick={logoutUser} href='#!'>
                    <i className="fas fa-sign-out-alt"></i>{' '}
                    <span className='hide-sm'>Logout</span>
                </a>
            </li>
        </ul>
    );

    return <nav className="navbar bg-dark">
        <h1>
            <Link to="##"><i className="fas fa-code"></i> DevBook</Link>
        </h1>
        {!loading && (<Fragment>{isAuthenticated ? authLinks : guestLinks}</Fragment>)}
    </nav>
}

const mapstateToProps = state => ({
    auth: state.auth
})

const mapDispatchToProps = ({
    logoutUser
})

export default connect(mapstateToProps, mapDispatchToProps)(Navbar);