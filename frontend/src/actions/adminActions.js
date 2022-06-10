import * as api from '../api/admin';
import { ADMIN_SIGNIN, ADMIN_SIGNOUT, ADMIN_VERIFIED } from '../constants/actionTypes';

export const signIn = (loginData) => async (dispatch) => {

    try {
        const {data} = await api.loginAdmin(loginData);
        dispatch({
            type: ADMIN_SIGNIN,
            payload: data
        })

    } catch(error) {
        console.log(error);
    }
}

export const verifyAdmin =  () => async (dispatch, getState) => {
    try {

        const {data} = await api.verifyAdmin()
        if(data.status === 200) {
            dispatch({
                type: ADMIN_VERIFIED,
                payload:data
            })
        }

    } catch (error) {

        const {response} = error;

        if(response?.status===401){
            dispatch({
                type: ADMIN_SIGNOUT,
            })
        }
    }
}