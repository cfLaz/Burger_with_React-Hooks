import React, {useState, useEffect} from 'react';
import Input from '../../components/UI/Input';
import Button from '../../components/Burger/OrderSummary/Button/Button';
import classes from './Auth.module.css';
import * as actions from '../../store/actions/indexA';
import {connect} from 'react-redux';
import Spinner from '../../components/UI/Spinner';
import {Redirect} from 'react-router-dom';
import {updateObject, checkValidity} from '../../shared/utility';

let Auth = props => {

    let [authForm,setAuthForm]= useState({
            email: {
                elementType: 'input',
                elementConfig: {
                    type: 'email',
                    placeholder: 'email address',
                },
                value: '',
                validation: {
                    required: true,
                    isEmail: true,
                },
                valid: false,
                touched: false,
            },  
            password: {
                elementType: 'input',
                elementConfig: {
                    type: 'password',
                    placeholder: 'password',
                },
                value: '',
                validation: {
                    required: true,
                    minLength: 6, //required by firebase
                },
                valid: false,
                touched: false,
            }, 
    })

    let [isSignUp, setIsSignUp] = useState(true);
    
    let {buildingBurger, authRedirect, onSetAuthRedirectPath} = props;

    useEffect(()=> {
        if(!buildingBurger && authRedirect !== '/'){
            onSetAuthRedirectPath(); //shoot me to te burger builder to add some ingredients.
        }
    }, [buildingBurger, onSetAuthRedirectPath, authRedirect]);

    let submitHandler =(event) => {
        event.preventDefault();
        props.onAuth(authForm.email.value, authForm.password.value,isSignUp);

    };

    let inputChangedHandler = (event, controlName) => {

      const updatedControls = updateObject(authForm, 
           {[controlName]: updateObject(authForm[controlName], {
               value: event.target.value,
               valid: checkValidity(event.target.value, authForm[controlName].validation),
               touched: true,
             })
           })
      //this.setState({controls: updatedControls})
      setAuthForm(updatedControls)
    }

    let switchAuthModeHandler = () => {
        setIsSignUp(!isSignUp);
    }
    
    const formElementsArray =[];

    for(let key in authForm) {
        formElementsArray.push({
            id: key,
            config: authForm[key],
        }) // [{id: email, config: 'everything in email'}, {}...]
    }
    // 2 elements in the form, email and password.
    let form =formElementsArray.map(formEl => (
       <Input
         key={formEl.id} // key is added in above for loop
         elementType={formEl.config.elementType} 
         elementConfig={formEl.config.elementConfig}
         value={formEl.config.value}
        changed={(event) => inputChangedHandler(event, formEl.id)} //anonimous function, so we can pass arguments into iCH (event is created by React automatically)
        invalid={!formEl.config.valid}
        shouldValidate={formEl.config.validation} //returns true if it exists
        touched={formEl.config.touched}
        /> 
        ));

        if (props.loading) {form = <Spinner/>;}
        
        let errorMessage = null;
        if(props.error) {          //.message from firebase
            errorMessage=(<p>{props.error.message}</p>);
        }

        authRedirect = null;
        if (props.isAuthenticated) {
            authRedirect = <Redirect to={props.authRedirectPath}/>
        }
        return (
            <div className={classes.Auth}>
                {authRedirect}
                {errorMessage}
                <form onSubmit={submitHandler}>

                  {form}
                  <Button btnType='Success'> 
                   {isSignUp ? 'Sign up' : 'Log in'}
                  </Button>
                </form>

                <Button btnType='Danger' clicked={switchAuthModeHandler}>
                    Switch to {isSignUp ? 'Log in' : 'Sign up'} 
                </Button>
                {/* <span>(you're currently signing {this.state.isSignUp ? 'up' : 'in'})</span> */}
            </div>
        )
    
}
const mapDispatchToProps = dispatch => {
    return {
        onAuth: (email, pass, isSignUp) => dispatch(actions.auth(email,pass, isSignUp)),
        onSetAuthRedirectPath: () => dispatch(actions.setAuthRedirectPath('/'))
    }
};
const mapStateToProps = state => {
    return {
        loading: state.auth.loading,
        error:state.auth.error,
        isAuthenticated : state.auth.token !== null,
        buildingBurger: state.burgerBuilder.building,
        authRedirectPath: state.auth.authRedirectPath,

    }
}
export default connect(mapStateToProps,mapDispatchToProps)(Auth);