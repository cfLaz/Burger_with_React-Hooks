import React, {useState} from 'react';
import Aux from '../../hoc/Auxilary';
import classes from './Layout.module.css'
import Toolbar from '../../components/Navigation/Toolbar/Toolbar';
import SDrawer from '../../components/Navigation/SideDrawer/SideDrawer';
import {connect} from 'react-redux';

const Layout = props => {
/* 
    let state = {
        showSD: false
    } */
    let [sideDrawer,setSD] = useState(false);

    let sideDrawerClosed = () => {
        setSD(false);
    }
    /* let sideDrawerOpened =() => {
         setSD(true)
     } */
    
    let sideDrawerToggleHandler = () => {
        setSD(!sideDrawer);
    }
        return (
        <Aux>
            {/* <Toolbar open={this.sideDrawerOpened}/> I added this for hamburger icon*/}
            <Toolbar
              isAuth={props.isAuthenticated}
              drawerToggleClicked={sideDrawerToggleHandler}/>

            <SDrawer
                isAuth={props.isAuthenticated}
                closed={sideDrawerClosed}
                open={sideDrawer}
            />
            <main className={classes.Content}>
                {props.children}
            </main>
        </Aux>    
        );
    
   

};
const mapStateToProps = state => {
    return {
        isAuthenticated: state.auth.token !==null,
    };
};
export default connect(mapStateToProps)(Layout);