import React, { useEffect, Suspense } from 'react'; //suspense has to wrap any react.lazy components
import asyncComp from './hoc/asyncComponent';
import Layout from './containers/Layout/Layout';
//import bb from './containers/BurgerBuilder/BurgerBuilder';
import BurgerBuilder from './containers/BurgerBuilder/BurgerBuilder';
import {Route, Switch, withRouter, Redirect} from 'react-router-dom';
//import Orders from './containers/Orders/Orders';
import Logout from './containers/Auth/Logout';
import {connect} from 'react-redux';
import * as actions from './store/actions/indexA';

const Auth = React.lazy(() => import('./containers/Auth/Auth'));
//does what was done manually with asyncComp

const Checkout = React.lazy( () => {
  return import('./containers/Checkout/Checkout');
}) //fails with react.lazy....why?? (cannot read property 'path' of undefined??) -checkout.js - route - contact data (456 - explained 3:00) - added props to Route compoenent


const Orders = React.lazy( () => {
  return import('./containers/Orders/Orders');
})

const App = props => {
 const {onTryAutoSignup} = props;

useEffect( ()=> {
  onTryAutoSignup();
}, [onTryAutoSignup]);

    let routes =(
      <Switch> {/* picks the first hit */}
        <Route path='/auth' render={()=>(
            <Suspense fallback={<div>'lalala</div>}>
              <Auth/>
            </Suspense>
          )}/>
        <Route path='/' exact component={BurgerBuilder}/> 
        <Redirect to='/' /> {/* added so if we go to orders mannualy it wil redirect back to begining */}
      </Switch>
    );
        //guards
    if(props.isAuthenticated) {
      routes= ( 
        <Switch>
          <Route path='/' exact component={BurgerBuilder}/>
          <Route path='/checkout' component ={props => <Checkout {...props}/>}/>
          <Route path='/orders' render={ props => <Orders {...props}/>}/>
          <Route path='/logout' component ={Logout}/>);
          <Route path='/auth' render={()=>(
            <Suspense fallback={<div>'lalala</div>}>
              <Auth/>
            </Suspense>
          )}/> {/* wasn't here, added in 345 video. REdirected me to '/' instead */}
          <Redirect to='/' />
        </Switch>
      );
    }

    return (
      <div>
        <Layout>
          <Suspense fallback={<p>wait a bit will ya</p>}>
            {routes}
          </Suspense>
        </Layout>
      </div>
    );
  
}

const mapStateToProps = state => {
  return {
    isAuthenticated: state.auth.token !== null,
  }
};
const mapDispatchToProps = dispatch => {
  return {
    onTryAutoSignup: () => dispatch(actions.authCheckState())
  }
} 
        //wRouter supposed to fix an issue with App not receiving route props due connect() (i didn't have this issue)
  export default withRouter(connect(mapStateToProps,mapDispatchToProps)(App));
