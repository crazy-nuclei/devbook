import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { getCurrentUserProfile } from '../../redux/reducers/profile/profile.actions';

const Dashboard = ({ auth, profile, getCurrentUserProfile }) => {
    useEffect(() => {
        getCurrentUserProfile();
    }, []);

    return (
        <div>Dashboard</div>
    )
}

const mapStateToProps = state => ({
    auth: state.auth,
    profile: state.profile
})

const mapDispatchToprops = {
    getCurrentUserProfile
}

export default connect(mapStateToProps, mapDispatchToprops)(Dashboard);