import React, {useState, useEffect, useCallback} from 'react';
import Aux from '../../hoc/Auxilary';
import Burger from '../../components/Burger/Burger';
import BCs from '../../components/Burger/BuildControls/BuildControls';
import Modal from '../../components/UI/Modal/Modal';
import OrderS from '../../components/Burger/OrderSummary/OrderS';
import axios from '../../../src/Axios-orders';
import Spinner from '../../components/UI/Spinner';
import errorHandler from '../../hoc/errorHandler';
//importing with lowercase letter since we are not going to use it in JSX
import {connect, useDispatch, useSelector} from 'react-redux';
//import * as actionTypes from '../../store/actions/actionTypes';
import * as actions from '../../store/actions/indexA'; // if you point to folder, it automatically goes to index file.


export  let BurgerBuilder = props => {
    
    let [purchasing, setPurchasing] = useState(false);

    // "cleaner" alternatices he says
    const ings = useSelector(state => {
        return state.burgerBuilder.ingredients
    });
    const price = useSelector(state => state.burgerBuilder.totalPrice);
    const error = useSelector(state => state.burgerBuilder.error);
    const isAthenticated= useSelector(state => state.auth.token != null);
    //
    let dispatch =  useDispatch();

    let onIngAdded = ingName => dispatch(actions.addIngredient(ingName));
    let onIngRemoved = ingName => dispatch(actions.removeIngredient(ingName));
    let onInitIng= useCallback(()=> dispatch(actions.initIngredients()), [dispatch]); //getting ingredients
    let onInitPurchase= ()=> dispatch(actions.purchaseInit());
    let onSetAuthRedirectPath= (path)=> dispatch(actions.setAuthRedirectPath(path));
    
    //let {onInitIng} = props;
    useEffect(() => {
        onInitIng();
    }, [onInitIng]);

    let updatePurchaseState = (ingredients) => {

        const sum = Object.keys(ingredients).map(igKey =>{
            return ingredients[igKey]
        }).reduce((sum,el) => {
            return sum + el;
        },0);
        
        return sum>0; //changed due to redux impact on the project
    };

   

    let purchaseHandler = () => { 
        if(isAthenticated){
            setPurchasing(true);
        } else{
            onSetAuthRedirectPath('/checkout');
            props.history.push('/auth');
        }
        
    }
    let purchaseCancelHandler = () => {
        setPurchasing(false);
    }
    let purchaseContinueHandler = () => { 
        
        onInitPurchase(); //313
        props.history.push('/checkout');

    }

        const disabledInfo = {
            ...ings
        };
        for ( let key in disabledInfo ) {
            disabledInfo[key] = disabledInfo[key] <= 0
        }

        let burger= error ? <p> ingredients cannot be loaded</p> : <Spinner/>;

        let orderSummary= null;

        if(ings) {
            
          burger = (
            <Aux>
                <Burger 
                    ingredients={ings}
                />

                <div>
                    <BCs
                        ingAdded={onIngAdded}
                        ingRemoved={onIngRemoved}
                        disabled={disabledInfo}
                        price={price}
                        purchasable={updatePurchaseState(ings)}
                        ordered={purchaseHandler}
                        isAuth={isAthenticated}
                    />
                </div>
            </Aux>
        );
            
          orderSummary = <OrderS 
            ingredients={ings}
            purchaseCanceled={purchaseCancelHandler}
            purchaseContinued={purchaseContinueHandler}
            price={price}
          /> 
        }
        
        return(
            <Aux>
             <Modal 
                show={purchasing} 
                modalClosed={purchaseCancelHandler}>
                {orderSummary}
             </Modal>
                {burger}
            </Aux>
        );
    
}

/* const mapStateToProps = state => {
    return {
        ings: state.burgerBuilder.ingredients,
        totalPrice: state.burgerBuilder.totalPrice,
        error: state.burgerBuilder.error,
        isAthenticated: state.auth.token != null,

    };
}

const mapDispatchToProps = dispatch => {
    return {
        onIngAdded: (ingName) => dispatch(actions.addIngredient(ingName)),
        onIngRemoved: (ingName) => dispatch(actions.removeIngredient(ingName)),
        onInitIng: () => dispatch(actions.initIngredients()), //getting ingredients
        onInitPurchase: ()=> dispatch(actions.purchaseInit()),
        onSetAuthRedirectPath: (path)=> dispatch(actions.setAuthRedirectPath(path))

    }
} */

export default errorHandler(BurgerBuilder, axios); //still need axios because it's handled from bbA