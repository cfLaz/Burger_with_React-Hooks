import React, {useState, useEffect} from 'react';
import Modal from '../components/UI/Modal/Modal';
import Aux from './Auxilary';

const ErrorHandler= (WrappedComp, axios) => {
    
       /*  state= {
            error: null,
        } */
        
    let Hooks_cannot_be_inside_of_a_callback = props => {
        
        let [error, setError] = useState(null)

        let reqInterceptor = axios.interceptors.request.use( req=>{
            setError(null);
            return req;
        });

        let resInterceptor = axios.interceptors.response.use(
            res => res, 
            err => {setError(err)}
        );
        

        useEffect( () => {
           return () => {  
            console.log('WillUnmount', reqInterceptor, resInterceptor);
            axios.interceptors.request.eject(reqInterceptor)
            axios.interceptors.response.eject(resInterceptor)
           }
        }, [reqInterceptor, resInterceptor]);



        let errorConfirmed = ()=> {
            setError(null);
        }
        
        return(
            <Aux>
                <Modal 
                show={error}
                modalClosed={errorConfirmed}
                >
                   {error ? error.message : null}
                   {/* message property returned on the error object from Firebase */}
                </Modal>
                <WrappedComp {...props} /> 
            </Aux>
            )
    }
    return Hooks_cannot_be_inside_of_a_callback
};

export default ErrorHandler;