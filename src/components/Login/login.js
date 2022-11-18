import React from 'react';
import './login.css';
import logoUrl from "./img/logo.png";
import {useState} from "react"
import {useNavigate} from "react-router-dom"

const users=[{
    email:"admin@1234",
    password:"1234"
},
{
    email:"admin@12345",
    password:"12345"
},
]

const Login =()=>{
        const nav = useNavigate();
        const [data,setData]=useState({
            email:"",
            password:""
        });
        const changeHandler=(e)=>{
            setData({...data,[e.target.name]:e.target.value})
        }
        const checkUser =()=>{
            const checkUser= users.find(user => (user.email===data.email && user.password===data.password));
            if(checkUser){
                nav("/dashboard");
            }
            else{
                alert('username and password not matched');
            }
        }
        return(
            <div>
                
                    <div className='login-2 login-background'>
                        <div className='login-2-inner'>
                            <div className='container'>
                                <div className='row login-box'>
                                    <div className='col-lg-6 align-self-center pad-0 form-info'>
                                        <div className='form-section align-self-center'>
                                            <div className='logo-2 logo'>
                                                <a href="">
                                                <img src={logoUrl} alt="Logo" />
                                                </a>
                                            </div>
                                            <h3>Sign Into Your Account</h3>
                                        
                                            <div className='clearfix'></div>
                                            <form action="" method="GET">
                                                <div className='form-group'>
                                                    <input name="email" type="email" className='form-control' placeholder="Email Address" 
                                                    value={data.email} onChange={changeHandler}
                                                    aria-label="Email Address" required/>
                                                </div>
                                                <div className="form-group clearfix">
                                                    <input name="password" type="password" className='form-control' autoComplete="off" 
                                                    value={data.password} onChange={changeHandler}
                                                    placeholder="Password" aria-label="Password"
                                                    required/>
                                                </div>
                                                <div className="form-group clearfix">
                                                  
                                                        <button type="button" 
                                                        className='btn btn-lg btn-info btn-theme' on onClick={checkUser}>
                                                            Login</button>
                                                    <a href="" className='forgot-password float-end'>Forgot Password</a>
                                                </div>
                                            </form>
                                            
                                        </div>
                                    </div>

                                    <div className='col-lg-6 align-self-center pad-0 bg-img'>
                                        <div className='info clearfix'>
                                            <div className="box">
                                                <span></span>
                                                <span></span>
                                                <span></span>
                                                <span></span>
                                                <div className='content'>
                                                    <div className='logo-2'>
                                                        <a href="">
                                                        <img src={logoUrl} alt="Logo" />
                                                        </a>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                
                                </div>
                            </div>
                        </div>
                    </div>
                
            </div>
        )

        
}
export default Login