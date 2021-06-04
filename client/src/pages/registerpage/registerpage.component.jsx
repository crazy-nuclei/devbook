import React, { Fragment, useState } from 'react';
import { Link, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';

import { setAlert } from '../../redux/reducers/alert/alert.actions';
import { register } from '../../redux/reducers/auth/auth.actions';
import Alert from '../../components/alert/alert.component';
import './registerpage.styles.css';


const RegisterPage = ({ setAlert, register, isAuthenticated }) => {

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        password2: ''
    });

    const { name, email, password, password2 } = formData;

    const onChange = e => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    }

    const onSubmit = e => {
        e.preventDefault();

        if (password !== password2) {
            setAlert({ msg: 'Passwords do not match', alertType: 'danger' });
        }

        register({ name, email, password });
    }

    if (isAuthenticated) {
        return <Redirect to='/dashboard' />
    }

    return <Fragment>
        <section className="container">
            <Alert />
            <h1 className="large text-primary">Sign Up</h1>
            <p className="lead"><i className="fas fa-user"></i> Create Your Account</p>
            <form className="form" onSubmit={e => onSubmit(e)}>
                <div className="form-group">
                    <input type="text" placeholder="Name" name="name" required value={name} onChange={e => onChange(e)} />
                </div>
                <div className="form-group">
                    <input type="email" placeholder="Email Address" name="email" required value={email} onChange={e => onChange(e)} />
                    <small className="form-text"
                    >This site uses Gravatar so if you want a profile image, use a
      Gravatar email</small
                    >
                </div>
                <div className="form-group">
                    <input
                        type="password"
                        placeholder="Password"
                        name="password"
                        minLength="6"
                        required value={password}
                        onChange={e => onChange(e)}
                    />
                </div>
                <div className="form-group">
                    <input
                        type="password"
                        placeholder="Confirm Password"
                        name="password2"
                        minLength="6"
                        required value={password2}
                        onChange={e => onChange(e)}
                    />
                </div>
                <input type="submit" className="btn btn-primary" value="Register" />
            </form>
            <p className="my-1">
                Already have an account? <Link to="/login">Sign In</Link>
            </p>
        </section>
    </Fragment>
}

const mapDispatchToProps = {
    setAlert,
    register
}

const mapstateToProps = state => ({
    isAuthenticated: state.auth.isAuthenticated
})


export default connect(mapstateToProps, mapDispatchToProps)(RegisterPage);