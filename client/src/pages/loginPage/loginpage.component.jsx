import React, { Fragment, useState } from 'react';
import { Link } from 'react-router-dom';

import './loginpage.styles.css';

const LoginPage = () => {

    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });

    const { email, password } = formData;

    const onChange = e => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    }

    const onSubmit = e => {
        e.preventDefault();
        console.log(formData);
    }

    return <Fragment>
        <section className="container">
            <h1 className="large text-primary">Sign In</h1>
            <p className="lead"><i className="fas fa-user"></i>Sign In to Your Account</p>
            <form className="form" onSubmit={e => onSubmit(e)}>

                <div className="form-group">
                    <input type="email" placeholder="Email Address" name="email" required value={email} onChange={e => onChange(e)} />
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
                <input type="submit" className="btn btn-primary" value="LogIn" />
            </form>
            <p className="my-1">
                Don't have an account? <Link to="/register">Sign Up </Link>
            </p>
        </section>
    </Fragment>
}

export default LoginPage;