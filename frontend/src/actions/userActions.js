import * as api from '../api';
import { USER_SIGNUP, USER_SIGNIN, USER_VERIFIED, USER_SIGNOUT, GET_CHANNEL_DETAILS } from '../constants/actionTypes'

export const signUp = (params) => async (dispatch) => {

    const {
        registerFields:formData,
        setResponse,
        response,
        hideModal,
        setRegisterField
    } = params 

    try {

        const {data} = await api.signUp(formData);
        console.log(data);
        console.log("Inside signup");
        dispatch({
            type: USER_SIGNUP,
            payload: data.user
        })
        setRegisterField && setRegisterField({})
        hideModal()

    } catch(error) {
        console.log(error);
        setResponse({...response,status:true,message:error.response?.data?.message})
    }
}

export const signIn = (params) => async (dispatch) => {

    const {
        loginFields:formData,
        setResponse,
        response,
        hideModal,
        setLoginField
    } = params 

    try {
        console.log(formData);
        const {data} = await api.signIn(formData);
        dispatch({
            type: USER_SIGNIN,
            payload: data.user
        })

        setLoginField({})
        hideModal()

    } catch(error) {
        console.log(error);
        setResponse({...response,status:true,message:error.response?.data?.message})
    }
}

export const signOut = () => async (dispatch) => {
    try {
        const {status} = await api.signOut()
        if(status === 200){
            dispatch({
                type:GET_CHANNEL_DETAILS,
                payload:null
            })
            dispatch({type:USER_SIGNOUT})
        }
    }catch(error){

    }
}


export const verifyUser =  () => async (dispatch, getState) => {
    try {

        // const {status,data} = await api.verifyUser()
        const data = await api.verifyUser()
        if(data.status === 200) {
            console.log("USER VERIFIED");
            dispatch({
                type: USER_VERIFIED,
                payload:data.data.user
            })
        }

    } catch (error) {

        const {response} = error;

        if(response?.status===401){
            console.log("UN AUTHORIZED");
            dispatch({
                type: USER_SIGNOUT,
            })
        }
    }
}





