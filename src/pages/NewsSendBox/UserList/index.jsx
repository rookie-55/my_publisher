import React, { useState, useEffect, useRef } from 'react'
import { Table, Button, Modal, Switch } from 'antd'
import {
    DeleteOutlined,
    EditOutlined,
    ExclamationCircleOutlined,
} from '@ant-design/icons';
import axios from 'axios'
import UserForm from '../../../components/UserForm'
const { confirm } = Modal;



export default function UserList() {
    const [dataSource, setDataSource] = useState([])
    const [addVisible, setAddVisible] = useState(false)
    const [updataVisible, setUpdataVisible] = useState(false)
    const [regionList, setRegionList] = useState([])
    const [userList, setLserList] = useState([])
    const [isUpdataDisabled, setisUpdataDisabled] = useState(false)
    const [currentUser, setCurrentUser] = useState(null)
    const addForm = useRef(null)
    const updataForm = useRef(null)

    const { roleId, region, username } = JSON.parse(localStorage.getItem('token'))

    useEffect(() => {
        axios.get('/users?_expand=role').then(res => {
            const list = res.data
            setDataSource(roleId === 1 ? list : [
                ...list.filter(item => item.username === username),
                ...list.filter(item => item.region === region && roleId === 3)
            ])
        })
    }, [roleId, region, username])

    useEffect(() => {
        axios.get('/regions').then(res => {
            const list = res.data
            setRegionList(list)
        })
    }, [])

    useEffect(() => {
        axios.get('/roles').then(res => {
            const list = res.data
            setLserList(list)
        })
    }, [])


    const columns = [
        {
            title: '区域',
            dataIndex: 'region',
            filters: [
                ...regionList.map(item => ({
                    text: item.title,
                    value: item.value
                })),
                {
                    text: "全球",
                    value: "全球"
                }
            ],

            onFilter: (value, item) => {
                if (value === "全球") {
                    return item.region === ''
                }
                return item.region === value
            },
            render: (region) => {
                return <b>{region === '' ? '全球' : region}</b>
            }
        },
        {
            title: '角色名称',
            dataIndex: 'role',
            render: (role) => {
                return role?.roleName
            }
        },
        {
            title: '用户名',
            dataIndex: 'username'
        },
        {
            title: '用户状态',
            dataIndex: 'roleState',
            render: (roleState, item) => {
                return <Switch checked={roleState} disabled={item.default} onChange={() => { handlechange(item) }}></Switch>
            }
        },
        {
            title: '操作',
            render: (item) => {
                return <div>
                    <Button danger shape="circle" icon={<DeleteOutlined />} onClick={() => { comfirmDelete(item) }} disabled={item.default}></Button>{' '}

                    <Button type="primary" shape="circle" icon={<EditOutlined />} disabled={item.default} onClick={() => { handleUpdata(item) }} />
                </div>
            }
        },

    ];

    const handleUpdata = (item) => {
        setTimeout(() => {
            setUpdataVisible(true)
            if (item.roleId === 1) {
                setisUpdataDisabled(true)
            } else {
                setisUpdataDisabled(false)
            }
            updataForm.current.setFieldsValue(item)
        }, 0);
        setCurrentUser(item)
    }

    const handlechange = (item) => {
        item.roleState = !item.roleState
        setDataSource([...dataSource])
        axios.patch(`/users/${item.id}`, {
            roleState: item.roleState
        })
    }

    const comfirmDelete = (item) => {
        confirm({
            title: '确认删除吗,删除后不可撤销?',
            icon: <ExclamationCircleOutlined />,
            onOk() {
                //   console.log('OK');
                deleteMethod(item)
            },
            onCancel() {
                //   console.log('Cancel');
            },
        });
    }

    const deleteMethod = (item) => {
        // console.log('item :>> ', item);
        setDataSource(dataSource.filter(data => data.id !== item.id))
        axios.delete(`/users/${item.id}`)
    }

    const addFormOk = () => {
        addForm.current.validateFields().then(value => {
            setAddVisible(false)
            addForm.current.resetFields()
            // setDataSource([...dataSource,{

            // }])
            axios.post(`/users`, {
                ...value,
                "roleState": true,
                "default": false
            }).then(res => {
                setDataSource([...dataSource, {
                    ...res.data,
                    role: userList.filter(item => item.id === value.roleId)[0]
                }])
            })
        }).catch(err => {
            console.log('err :>> ', err);
        })
    }

    const updataFormOk = () => {
        updataForm.current.validateFields().then(value => {

            setUpdataVisible(false)
            setDataSource(dataSource.map(item => {
                if (item.id === currentUser.id) {
                    return {
                        ...item,
                        ...value,
                        role: userList.filter(item => item.id === value.roleId)[0]
                    }
                }

                return item
            }))
            setisUpdataDisabled(!isUpdataDisabled)
            axios.patch(`/users/${currentUser.id}`, value)
        })
    }

    return (
        <div>
            <Button type="primary" onClick={() => { setAddVisible(true) }}>添加用户</Button>
            <Table dataSource={dataSource} columns={columns} pagination={{ pageSize: 5 }} rowKey={item => item.id} />;

            <Modal
                visible={addVisible}
                title="添加成员"
                okText="创建"
                cancelText="取消"
                onCancel={() => {
                    setAddVisible(false)
                }}
                onOk={() => addFormOk()}
            >
                <UserForm regionList={regionList} userList={userList} ref={addForm} />
            </Modal>

            <Modal
                visible={updataVisible}
                title="更新用户"
                okText="更新"
                cancelText="取消"
                onCancel={() => {
                    setUpdataVisible(false)
                    setisUpdataDisabled(!isUpdataDisabled)
                }}
                onOk={() => updataFormOk()}
            >
                <UserForm
                    regionList={regionList}
                    userList={userList}
                    ref={updataForm}
                    isUpdataDisabled={isUpdataDisabled}
                    isUpdata={true}
                />
            </Modal>
        </div>
    )
}
