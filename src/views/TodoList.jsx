import { useEffect, useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';

import empty from '../assets/empty.png';
import logo from '../assets/logo.png';

const { VITE_APP_HOST } = import.meta.env;

const Empty = () => {
    return (
        <div className="text-center py-60">
            <p className="mb-16">目前尚無待辦事項</p>
            <img src={empty} alt="empty" />
        </div>
    )
}

const List = ({todos, getTodoList}) => {

    const [tab, setTab] = useState('全　部');
    const [filterTodos, setFilterTodos] = useState(todos);
    const [unfinishedNum, setUnfinishedNum] = useState(todos.filter((todo => !todo.status)).length);

    useEffect(()=>{
        setFilterTodos(todos);
        setTab('全　部');
    },[todos])

    // 每次切換頁籤時更新篩選完的狀態

    useEffect(()=>{
        if (tab == '全　部') {
            setFilterTodos(todos);
        } else if (tab == '待完成') {
            setFilterTodos(todos.filter((todo) => !todo.status));
        } else if (tab == '已完成') {
            setFilterTodos(todos.filter((todo) => todo.status));
        }
    },[tab])

    // 每次篩選完清單就重新計算待完成項目

    useEffect(()=>{
        setUnfinishedNum(todos.filter((todo => !todo.status)).length);
    },[filterTodos])

    const handleList = (e) => {
        setTab(e.target.textContent);
    }
    
    // 切換待辦事項狀態

    const statusToggle = async(id) => {
        const res = await axios.patch(`${VITE_APP_HOST}/todos/${id}/toggle`);
        // console.log(res);
        getTodoList();
    }

    // 編輯待辦事項

    const [editMode, setEditMode] = useState('');

    const [editContent, setEditContent] = useState('');

    const editTodo = async(id) => {
        try {
            const res = await axios.put(`${VITE_APP_HOST}/todos/${id}`, {
                "content": editContent
            });
            // console.log(res);
            setEditMode('');
            Swal.fire({
                toast: 'true',
                icon: 'success',
                position: 'top-start',
                text: res.data.message,
                showConfirmButton: false,
                timer: 1000
            })
            getTodoList();
        } catch(error){
            console.log(error);
        }
    }

    // 刪除待辦事項

    const deleteTodo = async(id) => {
        const res = await axios.delete(`${VITE_APP_HOST}/todos/${id}`);
        // console.log(res);
        Swal.fire({
            toast: 'true',
            icon: 'success',
            position: 'top-start',
            text: res.data.message,
            showConfirmButton: false,
            timer: 1000
        })
        getTodoList();
    }

    const clearFinished = () => {
        todos.filter((todo) => todo.status ? 
        axios.delete(`${VITE_APP_HOST}/todos/${todo.id}`) : todo);
        Swal.fire({
            toast: 'true',
            icon: 'success',
            position: 'top-start',
            text: '清除成功',
            showConfirmButton: false,
            timer: 1000
        })
        getTodoList();
    }

    return (
    <div className="todolist">
        <ul className="d-flex">
            <li className="todolist-tab"
                style={ tab == '全　部' ? { 
                color: "#333333",
                borderBottom: "2px solid #333333" } : null}>
                <Link onClick={handleList}>全　部</Link>
            </li>
            <li className="todolist-tab"
                style={ tab == '待完成' ? { 
                color: "#333333",
                borderBottom: "2px solid #333333" } : null}>
                <Link onClick={handleList}>待完成</Link>
            </li>
            <li className="todolist-tab"
                style={ tab == '已完成' ? {
                color: "#333333",
                borderBottom: "2px solid #333333",} : null}>
                <Link onClick={handleList}>已完成</Link>
            </li>
        </ul>
        <div>         
            {filterTodos.map((item) => {
                return(
                <div key={item.id} className="todolist-item mx-24 py-16">
                    <input type="checkbox"
                           id={item.id}
                           value={Boolean(item.status)}
                           checked={Boolean(item.status)}
                           onChange={()=>statusToggle(item.id)} />
                    { editMode === item.id ?
                        (
                        <div className="flex-grow-1">
                            <input type="text"
                                   className="todo-edit-input me-4"
                                   value={editContent}
                                   onChange={(e)=>setEditContent(e.target.value)} />
                            <button className="btn btn-mini me-4"
                                    onClick={(e)=>editTodo(item.id)}>
                                    修改</button>
                            <button className="btn btn-mini"
                                    onClick={(e)=>setEditMode('')}>
                                    取消</button>
                        </div>
                        ) : (
                        <label htmlFor={item.id}
                               className="flex-grow-1"
                               style={{
                               color: item.status && "#9F9A91",
                               textDecoration: item.status && "line-through"
                               }}>{item.content}
                        </label>
                        )
                    }
                    <span className="btn-edit material-icons"
                          onClick={(e) => {
                          setEditMode(item.id);
                          setEditContent(item.content);
                          }}>edit_document</span>
                    <span className="btn-delete material-icons"
                          onClick={(e) => deleteTodo(item.id)}>clear</span>
                </div>
                )}
            )}
            <div className="d-flex justify-between mx-24 my-16">
                <p>{unfinishedNum} 個待完成項目</p>
                <Link onClick={clearFinished}>清除已完成項目</Link>
            </div>
        </div>
    </div>
    )
}

function TodoList() {

    let navigate = useNavigate();

    const [username, setUsername] = useState('');
    const [todos, setTodos] = useState([]);
    const [newTodo, setNewTodo] = useState({ content: '' });
    const [message, setMessage] = useState('');

    useEffect(() => {
        const cookieValue = document.cookie
        .split("; ")
        .find((row) => row.startsWith("token="))
        ?.split("=")[1];
        console.log(cookieValue);
        axios.defaults.headers.common['authorization'] = cookieValue;
        axios.get(`${VITE_APP_HOST}/users/checkout`)
        .then((response) => {
            console.log(response);
            setUsername(response.data.nickname);
            getTodoList();
        })
        .catch((err) => {
            // console.log(err);
            navigate('auth/login');
        });
    }, []);

    const getTodoList = async() => {
        try {
            const res = await axios.get(`${VITE_APP_HOST}/todos`);
            // console.log(res.data.data);
            setTodos(res.data.data);
        } catch(err) {
            // console.log(err);
        }
    }

    const handleSignOut = async() => {
        try {
            const res = await axios.post(`${VITE_APP_HOST}/users/sign_out`, {});
            // console.log(res);
            document.cookie='token=; Max-Age=-1;';
            Swal.fire({
                toast: 'true',
                icon: 'success',
                position: 'top-start',
                text: res.data.message,
                showConfirmButton: false,
                timer: 1500
            })
            navigate('/auth/login');
        } catch(err) {
            // console.log(err);
        }
    }

    const createTodo = async() => {
        try {
            const res = await axios.post(`${VITE_APP_HOST}/todos/`, newTodo);
            // console.log(res);
            Swal.fire({
                toast: 'true',
                icon: 'success',
                position: 'top-start',
                text: '新增成功',
                showConfirmButton: false,
                timer: 1000
            })
            getTodoList();
            setNewTodo({content:''});
        } catch(err) { 
            // console.log(err);
        }
    }

    // 按 Enter 後送出

    const handleKeyDown = e => {
        // console.log('User pressed:', e.key); // type: string
        if (e.key === 'Enter') {
            newTodo.content ? createTodo() : setMessage('欄位不可空白')
        }
    }

    return (
        <div className="bg-half">
            <header className="todolist-header d-flex justify-between align-center pt-16 px-32">
                <img src={logo} alt="TodoList_Logo"/>
                <div className="d-flex g-24">
                    <p className="username">{username}的待辦</p>
                    <Link onClick={handleSignOut}>登出</Link>
                </div>
            </header>
            <div className="container-500">
                <div className="create-todo">
                    <input type="text"
                           style={{height: "47px"}}
                           className="mb-16"
                           value={newTodo.content}
                           onKeyDown={handleKeyDown}
                           onChange={(e) => {
                           setMessage('');
                           setNewTodo({ content: e.target.value });
                           }} />
                    <button className="btn btn-add"
                            onClick={()=>{ newTodo.content ? createTodo() : setMessage('欄位不可空白') }}>+</button>
                </div>
                <p className="text-alert text-center mb-16">{message}</p>
                {todos.length ?
                (<List todos={todos} setTodos={setTodos} getTodoList={getTodoList} />)
                : (<Empty />)}
            </div>
        </div>
    )
}

export default TodoList;