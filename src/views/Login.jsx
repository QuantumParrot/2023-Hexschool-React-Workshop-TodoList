import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';

const { VITE_APP_HOST } = import.meta.env;

function Login() {
    
    const navigate = useNavigate();

    const [userData, setUserData] = useState({
        "email": '',
        "password": ''
    });

    const [message, setMessage] = useState('');
    
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUserData({
            ...userData,
            [name]: value
        })
    }

    const handleLogin = async() => {
        try {
            if (userData.email === '' || userData.password === '') {
                setMessage('欄位不可空白')
            } else if (userData.password.length < 6) {
                setMessage('密碼不得少於六個字')
            } else {
                setIsLoading(true);
                const res = await axios.post(`${VITE_APP_HOST}/users/sign_in`, userData);
                // console.log(res);
                const { token } = res.data;
                document.cookie = `token=${token}`;
                Swal.fire({
                    toast: 'true',
                    icon: 'success',
                    position: 'top-start',
                    text: `歡迎您，${res.data.nickname}！ᕕ ( ᐛ ) ᕗ`,
                    showConfirmButton: false,
                    timer: 1500
                })
                navigate('/todolist');
                setIsLoading(false);
            }
        } catch(error) {
            console.log(error);
            const { message } = error.response.data;
            setMessage(message.toString());
            setIsLoading(false);
        }
    }

    const clearMessage = () => { setMessage('') }

    return (
        <>
            <h2 className="subtitle mb-40">最實用的線上待辦事項服務</h2>
            <form>
                <div className="mb-16">
                    <label htmlFor="email">Email</label>
                    <input id="email"
                           type="email"
                           name="email"
                           placeholder="請輸入Email"
                           className="mt-4"
                           onFocus={clearMessage} onChange={handleChange} />
                </div>
                <div className="mb-24">
                    <label htmlFor="password">密碼</label>
                    <input id="password"
                           type="password"
                           name="password"
                           placeholder="請輸入密碼"
                           className="mt-4"
                           onFocus={clearMessage} onChange={handleChange} />
                </div>
                <div className="text-center">
                    <p className="text-alert mb-24" style={{overflow: "wrap"}}>{message}</p>
                    <button type="button"
                            className="btn btn-submit mb-24"
                            style={{ cursor: isLoading ? 'wait' : 'pointer' }}
                            disabled={ isLoading ? true : false }
                            onClick={()=>{handleLogin()}}>登入</button>
                    <br />
                    <NavLink to="/auth/register">註冊帳號</NavLink>
                </div>
            </form>
        </>
    )
}

export default Login;