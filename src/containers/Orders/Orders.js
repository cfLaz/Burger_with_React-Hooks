import React, { useEffect } from "react";
import Order  from '../../components/Order/Order';
import axios from '../../Axios-orders';
import withErrorHandler from '../../hoc/errorHandler';
import * as actions from '../../store/actions/indexA';
import {connect} from 'react-redux';
import Spinner from '../../components/UI/Spinner';

let Orders = (props) => {
    
    useEffect(()=> {
        props.onFetchOrders(props.token, props.userId);
    }, [])
   
    
    let removeOrder = (id) => {
        return props.onRemoveOrder(id);
    }
    
    let orders = <Spinner/>;

    if (!props.loading) {
        orders =(props.orders.map(order => (
            <Order
              ingredients = {order.ingredients}
              price = {order.price}
              key = {order.id}
              deleteOrder = {() => removeOrder(order.id)}
            />))       
          );
        } 
        return (
            <div>{/*my shot -  */}
            
                {orders}
            </div>
        );
    
}

const mapStateToProps = state => {
    return {
        orders: state.order.orders,
        loading: state.order.loading,
        token: state.auth.token,
        userId: state.auth.userId,
    }
}
const mapDispatchToProps = dispatch => {
    return {
        onFetchOrders: (token, userId ) => dispatch(actions.fetchOrders(token, userId)),
        onRemoveOrder: (id) => dispatch(actions.removeOrder(id))
    }
}
export default connect(mapStateToProps,mapDispatchToProps)(withErrorHandler(Orders, axios));