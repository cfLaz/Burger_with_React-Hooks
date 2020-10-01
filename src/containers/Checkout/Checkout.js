import React, {} from 'react';
import CheckoutSum from '../../components/Order/CheckoutSummary/CheckoutSummary';
import {Route, Redirect} from 'react-router-dom';
import ContactData from './ContactData.js';
import {connect} from 'react-redux';
//import * as actions from '../../store/actions/indexA';

let Checkout = (props) => {

  let checkoutCancelledHandler = () => {
    props.history.goBack();
  }
  let checkoutContinuedHandler = () => {
    props.history.replace('/checkout/contact-data');
  }

    let summary = <Redirect to='/'/>;

    if (props.ings){

        const purchasedRedirect = props.purchased ? <Redirect to='/'/> : null   
        
        summary = (
        <div>
            {purchasedRedirect}
            <CheckoutSum 
            ingredients={props.ings} 
            checkoutContinued={checkoutContinuedHandler}
            checkoutCancelled={checkoutCancelledHandler}
            />
             <Route 
            path={props.match.path + '/contact-data'} 
            component={ContactData}
               /*  render={(props) => (
                    <ContactData ingredients={this.props.ings} price={this.props.price} {...props}/>
                    )} //now we won't have history object in ContactData, that's why we put ...props
                *//> 
        </div>
        );
    }
    return(
    summary            
       )
    
}

const mapStateToProps = state=> {
    return {
        ings: state.burgerBuilder.ingredients,
        purchased: state.order.purchased,
    }
}
/* const mapDispatchToProps = dispatch => {
    return {
        onInitPurchase: () => dispatch(actions.purchaseInit())
    };
}; */
export default connect(mapStateToProps,)(Checkout);