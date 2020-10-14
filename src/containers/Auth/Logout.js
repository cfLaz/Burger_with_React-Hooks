import React,  {useEffect} from 'react';
import * as actions from '../../store/actions/indexA';
import {Redirect} from  'react-router-dom';
import {connect} from 'react-redux';

let Logout = props =>{

    let {onLogout} = props;

    useEffect(()=> {
        onLogout()
    },[onLogout]);
    
    return <Redirect to='/'/>
}

const mapDispatchToProps = dispatch => {
    return{
        onLogout: () => dispatch(actions.logout())
    }
}
export default connect(null,mapDispatchToProps)(Logout);