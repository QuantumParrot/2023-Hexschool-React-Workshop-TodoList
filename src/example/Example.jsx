import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';

import empty from '../assets/empty.png';
import logo from '../assets/logo.png';

const exampleData = [
    {
        id: 1,
        content: '把冰箱發霉的檸檬拿去丟',
        status: false
    },
    {
        id: 2,
        content: '打電話請媽媽匯款給我',
        status: false
    },
    {
        id: 3,
        content: '整理電腦資料夾',
        status: false
    },
    {
        id: 4,
        content: '繳電費水費瓦斯費',
        status: false
    },
    {
        id: 5,
        content: '約 Vicky 禮拜三泡溫泉',
        status: false
    },
    {
        id: 6,
        content: '約 Ada 禮拜四吃晚餐',
        status: false
    }
];

const Empty = () => {
    return (
        <div className="text-center py-60">
            <p className="mb-16">目前尚無待辦事項</p>
            <img src={empty} alt="empty" />
        </div>
    )
}

const List = (props) => {

    // 參考工作坊同學威爾 (letcla0624) 的程式碼，練習新的取 props 方式

    const {todos, setTodos} = props;

    const filter = [
        {
            id: 1,
            title: "全部",
        },
        {
            id: 2,
            title: "待完成",
        },
        {
            id: 3,
            title: "已完成",
        }
    ]

    const [tab, setTab] = useState("全部");
    const [filterTodos, setFilterTodos] = useState(todos);
    const [editMode, setEditMode] = useState('');
    const [newContent, setNewContent] = useState('');

    useEffect(()=>{
        setFilterTodos(todos);
        setTab('全部');
    },[todos])

    useEffect(()=>{
        setFilterTodos(todos.filter((todo)=>{
            if (tab === '全部') {
                return todo;
            } else if (tab === '待完成') {
                return !todo.status;
            } else if (tab === '已完成') {
                return todo.status;
            }
        }));
    },[tab])

    // 狀態切換

    const statusToggle = (id) => {
        setTodos(todos.map((item) => item.id === id ?
        {...item, status: !item.status} : item));
    }

    // 編輯項目

    const editTodo = (id) => {
        setTodos(todos.map((item) => item.id === id ?
        {...item, content: newContent} : item));
        Swal.fire({
            toast: 'true',
            icon: 'success',
            position: 'top-start',
            text: '更新成功',
            showConfirmButton: false,
            timer: 1000
        })
        setNewContent('');
        setEditMode('');
    }

    const keyDownToUpdate = (e,id) => { e.key === 'Enter' ? editTodo(id) : null }

    // 刪除項目

    const deleteTodo = (id) => {
        setTodos(todos.filter(item => item.id !== id));
        Swal.fire({
            toast: 'true',
            icon: 'success',
            position: 'top-start',
            text: '刪除成功',
            showConfirmButton: false,
            timer: 1000
        });
    }

    // 清除已完成項目

    const clearFinishedTodo = () => {
        setTodos(todos.filter(item => !item.status));
        Swal.fire({
            toast: 'true',
            icon: 'success',
            position: 'top-start',
            text: '清除成功',
            showConfirmButton: false,
            timer: 1000
        });
    }

    return (
        <div className="todolist">
            <ul className="d-flex">
                {filter.map((item)=>{
                    return (
                    <li key={item.id}
                        className={`todolist-tab ${tab === item.title ? "active" : ""}`}>
                    <Link onClick={()=>setTab(item.title)}>{item.title}</Link>
                    </li>
                    )
                })}
            </ul>
            <div>
                {filterTodos.map((item) => {
                    return(
                    <div key={item.id} className="todolist-item mx-24 py-16">
                        <input type="checkbox"
                                id={item.id}
                                checked={item.status}
                                onChange={()=>statusToggle(item.id)}/>
                        { editMode === item.id ?
                            (
                            <div className="flex-grow-1">
                            <input type="text"
                                   className="todo-edit-input me-4"
                                   value={newContent} onChange={(e)=>setNewContent(e.target.value)}
                                   onKeyDown={(e)=>keyDownToUpdate(e,item.id)}
                                   />
                            <button className="btn btn-mini me-4" onClick={()=>editTodo(item.id)}>
                                修改</button>
                            <button className="btn btn-mini" onClick={()=>setEditMode('')}>
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
                              onClick={()=>{
                              setEditMode(item.id);
                              setNewContent(item.content);
                              }}>
                              edit_document</span>
                        <span className="btn-delete material-icons"
                              onClick={()=>deleteTodo(item.id)}>
                              clear</span>
                    </div>
                    )}
                )}
                <div className="d-flex justify-between mx-24 my-16">
                    <p>{todos.filter((item)=>!item.status).length} 個待完成項目</p>
                    <Link onClick={clearFinishedTodo}>清除已完成項目</Link>
                </div>
            </div>
        </div>
    )
}

function Example() {

    const [todos, setTodos] = useState(exampleData);
    const [newTodo, setNewTodo] = useState('');
    const [message, setMessage] = useState('');

    const createTodo = () => {
        if (newTodo === '') {
            setMessage('欄位不可空白');
            return;
        }
        setTodos([...todos,{
            id: new Date().getTime(),
            content: newTodo,
            status: false
        }]);
        Swal.fire({
            toast: 'true',
            icon: 'success',
            position: 'top-start',
            text: '新增成功',
            showConfirmButton: false,
            timer: 1000
        });
        setNewTodo('');
    }

    const keyDownToCreate = ({key}) => {
        key === 'Enter' ? createTodo() : null
    }

    return (
        <div className="bg-half">
            <header className="todolist-header d-flex justify-between align-center pt-16 px-32">
                <div className="d-flex align-center">
                    <img src={logo} className="me-16" alt="TodoList_Logo"/>
                    <h2>試用版</h2>
                </div>
                <div className="d-flex g-24">
                    <Link to="/auth/register">免費註冊</Link>
                    <Link to="/auth/login">登入</Link>
                </div>
            </header>
            <div className="container-500">
                <div className="create-todo">
                    <input type="text"
                           placeholder="新增待辦事項"
                           style={{height: "47px"}}
                           className="mb-16"
                           value={newTodo}
                           onChange={(e) => {
                           setMessage('');
                           setNewTodo(e.target.value);
                           }}
                           onKeyDown={keyDownToCreate} />
                    <button className="btn btn-add"
                            onClick={createTodo}>+</button>
                </div>
                <p className="text-alert text-center mb-16">{message}</p>
                {todos.length ?
                (<List todos={todos} setTodos={setTodos} />) : (<Empty />)}
            </div>
        </div>
    )
}

export default Example;