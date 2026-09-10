import { useState, useEffect } from "react";

import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';

import './User.scss';
import { useAuthContext } from './../../../context/authContext';
import CheckoutRegisterForm from './register/register';
import CheckoutLoginForm from './login/login';
import CheckoutRegisterEditForm from './register/edit-user';



const CheckoutFormUser = ({nextForm,backForm,stepData,setStepData,editUd,setEditUd}) => {

    const [ userData, setUserData ] = useState();
    const { token ,handleLogout } = useAuthContext();

    const [chkAccount,setChkAccount] = useState(false);
    const changeFieldAccount = (e)=>{
        setChkAccount(!chkAccount)
    }

    const logoutDatos = () =>{
        backForm();
        handleLogout()
    }

    useEffect(()=>{
        if(token){
            setUserData(token)
            setStepData({...stepData,datos:token.user})
        }
    },[])

    return (


        <div className="inlineBlock">
            {!userData ?
                <div className="inlineFlex checoStepperBox">
                    <div className="inlineFlex checoStepperResp">
                        <div className={'textFielCheck checkoutFormUser'} >
                            <div className="inlineBlock">
                                
                                <FormGroup className={'checkUserIfLog'}>
                                    <FormControlLabel 
                                        label="¿Ya tienes cuenta?" 
                                        control={
                                        <Checkbox
                                                name={'chkAccount'}
                                                value={chkAccount} 
                                                onChange={changeFieldAccount}
                                            />
                                        }
                                    />
                                </FormGroup>

                                <div className="inlineBlock">
                                    {chkAccount ?
                                        <CheckoutLoginForm nextForm={nextForm} backForm={backForm} />
                                    :
                                        <CheckoutRegisterForm nextForm={nextForm} backForm={backForm} />
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            :
                <div className="inlineBlock">
                    {editUd &&
                        <div className="inlineFlex checoStepperBox">
                            <div className="inlineFlex checoStepperResp">

                                <div className="inlineBlock checkoutFormUser">
                                    
                                    <CheckoutRegisterEditForm 
                                        nextForm={nextForm} 
                                        backForm={backForm} 
                                        editUd={editUd}
                                        setEditUd={setEditUd}
                                    />
                                    
                                </div>
                            </div>
                        </div>
                    }
                </div>

            }
        </div>

    )
};

export default CheckoutFormUser;
