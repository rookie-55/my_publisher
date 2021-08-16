import React, { useEffect, useState } from 'react'
import { withRouter } from 'react-router-dom'
import { Layout, Menu } from 'antd';
import {
    UserOutlined,
    VideoCameraOutlined,
    UploadOutlined,
    MailOutlined
} from '@ant-design/icons';

import './index.css'
import axios from 'axios';
import {connect} from 'react-redux'

const { SubMenu } = Menu;

const { Sider } = Layout;

// const menuList = [
//     {
//         key: '/home',
//         title: '首页',
//         icon: <UserOutlined />
//     },
//     {
//         key: '/user-manage',
//         title: '用户管理',
//         icon: <UserOutlined />,
//         children: [
//             {
//                 key: '/user-manage/list',
//                 title: '用户列表',
//                 icon: <UserOutlined />
//             }
//         ]
//     },
//     {
//         key: '/right-manage',
//         title: '权限管理',
//         icon: <UserOutlined />,
//         children: [
//             {
//                 key: '/right-manage/right/list',
//                 title: '角色列表',
//                 icon: <UserOutlined />,
//             },
//             {
//                 key: '/right-manage/role/list',
//                 title: '权限列表',
//                 icon: <UserOutlined />
//             }
//         ]
//     }

// ]

const iconList = {
    "/home": <UserOutlined />,
    "/user-manage/list": <VideoCameraOutlined />,
    "/user-manage": <VideoCameraOutlined />,
    "/right-manage/role/list": <UploadOutlined />,
    "/right-manage": <UploadOutlined />,
    "/right-manage/right/list": <MailOutlined />
}

function SideMenu(props) {
    const [menu, setMenu] = useState([])

    useEffect(() => {
        axios.get('/rights/?_embed=children').then(res => {
            setMenu(res.data)
        })
    }, [])

    const {role:{rights}} = JSON.parse(localStorage.getItem("token"))

    const checkPagePermission = (item) => {
        return item.pagepermisson && rights.includes(item.key)
    }

    const renderMenu = (menuList) => {
        return menuList.map(item => {
            if(checkPagePermission(item)){
                if (item.children?.length > 0) {
                    return <SubMenu key={item.key} icon={iconList[item.key]} title={item.title}>
                        {renderMenu(item.children)}
                    </SubMenu>
                }
                return <Menu.Item key={item.key} icon={iconList[item.key]} onClick={() => {
                    props.history.push(item.key)
                }}>{item.title}</Menu.Item>
            }
            return ''
        })
    }
    const selectKeys = props.location.pathname
    const openKeys = ['/'+props.location.pathname.split('/')[1]]
    

    return (
        <Sider trigger={null} collapsible collapsed={props.isCollapsed}>
            <div style={{ display:"flex", height:"100%", flexDirection:"column" }}>

                <div className="logo" >吃瓜新闻发布系统</div>
                <div style={{flex:1,"overflow":"auto"}}>
                    <Menu theme="dark" mode="inline" selectedKeys={[selectKeys]} defaultOpenKeys={openKeys}>
                        {renderMenu(menu)}
                    </Menu>
                </div>
            </div>
        </Sider>
    )
}

const mapStateToProps = ({CollapsedReducer:{isCollapsed}}) => ({
    isCollapsed
})

export default connect(mapStateToProps)(withRouter(SideMenu))