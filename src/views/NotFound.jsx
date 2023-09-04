import { NavLink } from "react-router-dom";

function NotFound() {
    return (
        <div className="bg-yellow">
            <div className="container-500 text-center">
                <h1>OOPS...</h1>
                <img src="https://1.bp.blogspot.com/-d3vDLBoPktU/WvQHWMBRhII/AAAAAAABL6E/Grg-XGzr9jEODAxkRcbqIXu-mFA9gTp3wCLcBGAs/s400/internet_404_page_not_found.png" alt="404 Not Found" />
                <p>沒有這個路由 ( ×ω× ) 請再確認網址是否有輸入正確</p>
                <br />
                <NavLink to="/">點我回首頁</NavLink>
            </div>
        </div>
    )
}

export default NotFound;