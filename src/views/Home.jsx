import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function Home() {

    const navigate = useNavigate();

    // 拿餅乾驗證 ( ? 可進行安全訪問，即使沒有拿到 token 也不會紅字錯誤 )

    const cookieValue = document.cookie
    .split('; ')
    .find((row) => row.startsWith('token='))
    ?.split('=')[1];

    // 已經登入過且未登出的會直接跳轉至 TodoList 頁面

    useEffect(() => {
        cookieValue ? navigate('/todolist') : navigate('/auth/login')
    },[]);

    return (
        <></>
    )
}

export default Home;