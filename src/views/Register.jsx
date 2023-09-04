import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import axios from 'axios';
import Swal from "sweetalert2";

const { VITE_APP_HOST } = import.meta.env;

function Register() {

    const navigate = useNavigate();

    const [isLoading, setIsLoading] = useState(false);

    const [userData, setUserData] = useState({
        "email": '',
        "password": '',
        "nickname": '',
    })

    const [confirmPassword, setConfirmPassword] = useState('');

    const [message, setMessage] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUserData({
            ...userData,
            [name]: value
        })
    }

    const handleRegister = async () => {
        try {
            if (userData.email === '' || userData.nickname === '' || userData.password === ''){
                setMessage('欄位不可空白')
            } else if (userData.password.length < 6) {
                setMessage('密碼不得少於六個字')
            } else if (confirmPassword !== userData.password) {
                setMessage('兩次輸入的密碼不一致')
            } else {
                setIsLoading(true);
                const res = await axios.post(`${VITE_APP_HOST}/users/sign_up`, userData);
                // console.log(res);
                Swal.fire({
                    toast: 'true',
                    icon: 'success',
                    position: 'top-start',
                    text: '註冊成功',
                    showConfirmButton: false,
                    timer: 1500
                })
                navigate('/auth/login');
                setIsLoading(false);
            }
        } catch(error) {
            console.log(error);
            const { message } = error.response.data;
            setMessage(typeof message == 'string' ? message : '請確認欄位是否填寫正確');
            setIsLoading(false);
        }
    }

    const clearMessage = () => { setMessage('') }

    return (
        <>
            <h2 className="subtitle mb-24">註冊帳號</h2>
            <form>
                <div className="mb-16">
                    <label htmlFor="email">Email</label>
                    <input id="email"
                           type="email"
                           name="email"
                           placeholder="請輸入Email"
                           className="mt-4"
                           value={userData.email}
                           onFocus={clearMessage} onChange={handleChange} />
                </div>
                <div className="mb-16">
                    <label htmlFor="nickname">您的暱稱</label>
                    <input id="nickname"
                           type="text"
                           name="nickname"
                           placeholder="請輸入您的暱稱"
                           className="mt-4"
                           value={userData.nickname}
                           onFocus={clearMessage} onChange={handleChange} />
                </div>
                <div className="mb-16">
                    <label htmlFor="password">密碼</label>
                    <input id="password"
                           type="password"
                           name="password"
                           placeholder="請輸入密碼"
                           className="mt-4"
                           value={userData.password}
                           onFocus={clearMessage} onChange={handleChange} />
                </div>
                <div className="mb-24">
                    <label htmlFor="confirmPassword">再次輸入密碼</label>
                    <input id="confirmPassword"
                           type="password"
                           name="confirmPassword"
                           placeholder="請再次輸入密碼"
                           className="mt-4"
                           value={confirmPassword}
                           onFocus={clearMessage}
                           onChange={(e)=>{
                           setConfirmPassword(e.target.value);
                           setMessage(e.target.value !== userData.password ? '兩次輸入的密碼不一致' : '')}
                           } />
                </div>
                <div className="text-center">
                    <p className="text-alert mb-24">{message}</p>
                    <button type="button"
                            className="btn btn-submit mb-24"
                            style={{ cursor: isLoading ? 'wait' : 'pointer' }}
                            disabled={ isLoading ? true : false }
                            onClick={()=>{handleRegister()}}>註冊帳號</button>
                    <br />
                    <NavLink to="/auth/login">登入</NavLink>
                </div>
            </form>
        </>
    )
}

export default Register;