import React from 'react';
import Modal from '../components/UI/Modal/Modal';
import Aux from './Auxilary';
import useHttpErrorHandler from '../hooks/http-error-handler';

const ErrorHandler= (WrappedComp, axios) => {
    
        
    let Hooks_cannot_be_inside_of_a_callback = props => {
        
        //because if we want to use same error logic, without showing modal perhaps... 
        const [error, clearError] = useHttpErrorHandler(axios);

        return(
            <Aux>
                <Modal 
                show={error}
                modalClosed={clearError}
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