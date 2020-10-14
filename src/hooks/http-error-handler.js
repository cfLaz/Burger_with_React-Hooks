import {useState, useEffect} from 'react';


export default httpClient => {

  let [error, setError] = useState(null)

        let reqInterceptor = httpClient.interceptors.request.use( req=>{
            setError(null);
            return req;
        });

        let resInterceptor = httpClient.interceptors.response.use(
            res => res, 
            err => {setError(err)}
        );
        

        useEffect( () => {
           return () => {  
            console.log('WillUnmount', reqInterceptor, resInterceptor);
            httpClient.interceptors.request.eject(reqInterceptor)
            httpClient.interceptors.response.eject(resInterceptor)
           }
        }, [reqInterceptor, resInterceptor]);



        let errorConfirmed = ()=> {
            setError(null);
        }
  return [error, errorConfirmed];
}