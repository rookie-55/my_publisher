import React from 'react'
import { Layout, Dropdown, Avatar, Menu } from 'antd';
import {
    MenuUnfoldOutlined,
    MenuFoldOutlined,
    UserOutlined
} from '@ant-design/icons';
import { withRouter } from 'react-router-dom'
import {connect} from 'react-redux'
const { Header } = Layout;

function TopHeader(props) {
    // console.log('props :>> ', props);
    // const [collapsed, setCollapsed] = useState(false)
    const changeCollapsed = () => {
        // setCollapsed(!collapsed)
        // console.log('propsqwe :>> ', props);
        props.changeCollapsed()
    }

    const { role: { roleName }, username } = JSON.parse(localStorage.getItem("token"))

    const menu = (
        <Menu>
            <Menu.Item>
                {roleName}
            </Menu.Item>
            <Menu.Item danger onClick={() => {
                localStorage.removeItem("token")
                props.history.replace('/login')
            }}>退出登录</Menu.Item>
        </Menu>
    );

    return (
        <Header className="site-layout-background" style={{ padding: '0 16px' }}>
            {
                props.isCollapsed ? <MenuUnfoldOutlined onClick={changeCollapsed} /> : <MenuFoldOutlined onClick={changeCollapsed} />
            }

            <span>首页</span>

            <div style={{ float: 'right' }}>
                欢迎<span style={{color:"#1890ff"}}>{username}</span>回来

                <Dropdown overlay={menu}>
                    <Avatar style={{ backgroundColor: '#87d068' }} icon={<UserOutlined />} />
                </Dropdown>
            </div>

        </Header>
    )
}

/*
connect(
    mapStateToProps,
    mapDispatchToProps
)(被包装的组件)
*/

const mapStateToProps = ({CollapsedReducer:{isCollapsed}}) => {
    return {
        isCollapsed
    }
}

const mapDispatchToProps = {
    changeCollapsed(){
        return {
            type:"change_collapsed"
        }
    }
}

export default connect(mapStateToProps,mapDispatchToProps)(withRouter(TopHeader))