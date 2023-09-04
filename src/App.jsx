import { Routes, Route } from 'react-router-dom';
import './App.css';

import Home from './views/Home';
import Auth from './views/Auth';
import Register from './views/Register';
import Login from './views/Login';
import TodoList from './views/TodoList';
import NotFound from './views/NotFound';

function App(){
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/auth" element={<Auth />}>
                <Route path="register" element={<Register />} />
                <Route path="login" element={<Login />} />
            </Route>
            <Route path="/todolist" element={<TodoList />} />
            <Route path="*" element={<NotFound />} />
        </Routes>
    )
}

export default App;