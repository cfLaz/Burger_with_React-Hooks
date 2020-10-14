import React from 'react';
import classes from './Modal.module.css';
import Aux from '../../../hoc/Auxilary';
import Bd from '../Backdrop/Backdrop';

const Modal = props => {

    /* shouldComponentUpdate(nextProps, nextState) {
        return nextProps.show !== this.props.show || this.props.children !== nextProps.children;
    }; */



    return (
        <Aux>
        <Bd show={props.show} clicked={props.modalClosed}/>
            
        <div 
            className={classes.Modal}
            style={{
            transform: props.show ? 'translateY(0)' : 'translate(-100vh)',
            opacity: props.show ? '1': '0'
              }}
              >
                  {props.children}
            </div>
          </Aux>
    );
};

export default React.memo(Modal, (prevProps, nextProps) =>
    nextProps.show === prevProps.show && prevProps.children === nextProps.children); 
    //only update it if props change, opposite logic from shouldCupdate
    //React always re-renders the component if the state changes, even if the component is wrapped in React.memo().