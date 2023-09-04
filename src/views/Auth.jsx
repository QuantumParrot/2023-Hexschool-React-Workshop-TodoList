import { Outlet } from 'react-router-dom';

import left from '../assets/left.png';
import mainLogo from '../assets/logo-lg.png';

function Auth() {
    return (
        <div className="bg-yellow">
            <div className="main container-800 d-flex justify-between align-center">
                <div>
                    <h1 className="text-center mb-16">
                    <img src={mainLogo} alt="Todolist_Logo" />
                    </h1>
                    <img src={left} className="main-visual" alt="Todolist_Key_Visual" />
                </div>
                <div className="main-form">
                    <Outlet />
                </div>
            </div>
        </div>
    )
};

export default Auth;