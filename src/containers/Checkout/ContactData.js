import React, {useState} from 'react';
import Btn from '../../components/Burger/OrderSummary/Button/Button';
import classes from './ContactData.module.css';
import axios from '../../Axios-orders';
import Spinner from '../../components/UI/Spinner'
import Input from '../../components/UI/Input';
import {connect} from 'react-redux';
import withErrorHandler from '../../hoc/errorHandler';
import * as actions from '../../store/actions/indexA';
import { updateObject, checkValidity } from '../../shared/utility';

let ContactData = props => {
    let state_container={
        orderForm: {
            name: {
                elementType: 'input',
                elementConfig: {
                    type: 'text',
                    placeholder: 'Your Name',
                },
                value: '',
                validation: {
                    required: true,
                },
                valid: false,
                touched: false,
            },
            street: {
                elementType: 'input',
                elementConfig: {
                    type: 'text',
                    placeholder: 'Street',
                },
                value: '',
                validation: {
                    required: true,
                },
                valid: false,
                touched: false,
            },
            zipCode: {
                elementType: 'input',
                elementConfig: {
                    type: 'text',
                    placeholder: 'ZIP Code',
                },
                value: '',
                validation: {
                    required: true,
                    minLength: 5,
                    maxLength: 7,
                },       
                valid: false,
                touched: false,
            },
            country: {
                elementType: 'input',
                elementConfig: {
                    type: 'text',
                    placeholder: 'Country',
                },
                value: '',
                validation: {
                    required: true,
                },
                valid: false,
                touched: false,
            },
            email: {
                elementType: 'input',
                elementConfig: {
                    type: 'email',
                    placeholder: 'Your E-Mail',
                },
                validation: {
                    required: true,
                },
                value: '',
                valid: false,
                touched: false,
            },
            deliveryMethod: {
                elementType: 'select',
                elementConfig: {
                    options: [//VP quick doesn't shows up in firebase for some reason
                              {value: 'VIP quick', displayValue: 'vip quick'},
                              {value: 'economy', displayValue: 'standard'},
                            ]
                },
                value: 'hmm',//if nothing is chosen
                valid: true, 
                validation: {}, //added for the same reason ^ (now my stuff is irrelevant)
            },
        },
        formIsValid: false,
    }
    // wanted to split state in multiple chunks but that would require additional tweaking of the bottom code where we dynamically go through state. He just split the state into order form and validity (formIsValid)
    let [stateForm, setStateForm] = useState(state_container)

     let orderHandler=(event) => {
        event.preventDefault();
        
        const formData = {};
        for (let formElementId in stateForm.orderForm){
            formData[formElementId] = stateForm.orderForm[formElementId].value;
        };
        const order = {
            ingredients: props.ings,
            price: props.price, //this would ussualy be set up on the server, otherwise, users could manipulate it.
            orderData: formData,
            userId: props.userId,
        };
        props.onOrderBurger(order, props.token);
        

        alert('Бургер се спрема');
    } 

    
    let inputChangedHandler = (event, inputIdentifier) => {
        
        const updatedFormEl=updateObject(stateForm.orderForm[inputIdentifier],{
            value: event.target.value,
            valid: checkValidity(event.target.value, stateForm.orderForm[inputIdentifier].validation, inputIdentifier),
            touched: true,
        })

        const updatedOrderForm = updateObject(stateForm.orderForm, {
            [inputIdentifier]: updatedFormEl
        })

    

        let formIsValid = true;
        for (let inputId in updatedOrderForm) {
            formIsValid = updatedOrderForm[inputId].valid && formIsValid
        }

        //console.log(updatedFormEl.valid);
        updatedOrderForm[inputIdentifier] = updatedFormEl;
        setStateForm({orderForm: updatedOrderForm, formIsValid: formIsValid});
        updateObject(stateForm, )
    }

        const formElementsArray =[];

        for(let key in stateForm.orderForm) {
            formElementsArray.push({
                id: key,
                config: stateForm.orderForm[key],
            }) // [{id: name, config: 'everything in name'}, {}...]
        }

        let form = (
        <form onSubmit={orderHandler}>
            {formElementsArray.map(formEl => (
                    <Input 
                        key={formEl.id}
                        elementType={formEl.config.elementType} 
                        elementConfig={formEl.config.elementConfig}
                        value={formEl.config.value}
                        changed={(event) => inputChangedHandler(event, formEl.id)} //anonimous function, so we can pass arguments into iCH (event is created by React automatically)
                        invalid={!formEl.config.valid}
                        shouldValidate={formEl.config.validation} //returns true if it exists
                        touched={formEl.config.touched}
                    />
                ))
            }
            <Btn 
            btnType ='Success'
            disabled={!stateForm.formIsValid} 
            >
                ORDER
            </Btn>
        </form>
        );

        if (props.loading){
            form = <Spinner/>
        }
        return (
            <div className={classes.ContactData}>
                <h4>Enter your contact data</h4>
                {form}
            </div>
        )
    
}
const mapStoreToProps = state => {
    return {
        ings: state.burgerBuilder.ingredients,
        price: state.burgerBuilder.totalPrice,
        loading: state.order.loading,
        token: state.auth.token,
        userId: state.auth.userId,

    }
};
const mapDispatchToProps = dispatch => {
    return {
        onOrderBurger: (orderData, token) => dispatch(actions.purchaseBurger(orderData, token)),
        
    }
}

export default connect(mapStoreToProps,mapDispatchToProps)(withErrorHandler(ContactData, axios));