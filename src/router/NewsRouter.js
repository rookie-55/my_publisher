import React, { useEffect, useState } from 'react'
import { Redirect, Route, Switch } from 'react-router-dom'
import Home from '../pages/NewsSendBox/Home'
import NoPermission from '../pages/NewsSendBox/NoPermission'
import RightList from '../pages/NewsSendBox/RightList'
import RoleList from '../pages/NewsSendBox/RoleList'
import UserList from '../pages/NewsSendBox/UserList'
import AddNews from '../pages/newsManage/AddNews'
import NewsCategory from '../pages/newsManage/NewsCategory'
import NewsDraft from '../pages/newsManage/NewsDraft'
import NewsPreview from '../pages/newsManage/NewsPreview'
import NewsUpdate from '../pages/newsManage/NewsUpdate'
import Audit from '../pages/auditManage/Audit'
import AuditList from '../pages/auditManage/AuditList'
import Published from '../pages/publishManage/Published'
import SunSet from '../pages/publishManage/SunSet'
import Unpubilshed from '../pages/publishManage/Unpubilshed'
import axios from 'axios'
import { Spin } from 'antd';
import {connect} from 'react-redux'

const LocalRouterList = {
    "/home": Home,
    "/user-manage/list": UserList,
    "/right-manage/right/list": RightList,
    "/right-manage/role/list": RoleList,
    "/news-manage/add": AddNews,
    "/news-manage/draft": NewsDraft,
    "/news-manage/category": NewsCategory,
    "/news-manage/preview/:id": NewsPreview,
    "/news-manage/update/:id": NewsUpdate,
    "/audit-manage/audit": Audit,
    "/audit-manage/list": AuditList,
    "/publish-manage/unpublished": Unpubilshed,
    "/publish-manage/published": Published,
    "/publish-manage/sunset": SunSet
}

function NewsRouter(props) {

    const [backRouteList, setBackRouteList] = useState([])
    const { role: { rights } } = JSON.parse(localStorage.getItem("token"))
    useEffect(() => {
        Promise.all([
            axios.get("/rights"),
            axios.get("/children")
        ]).then(res => {
            // console.log(`res`, res)
            setBackRouteList([...res[0].data, ...res[1].data])
            // console.log([...res[0].data,...res[1].data])
        })
    }, [])

    const checkRoute = (item) => {
        return LocalRouterList[item.key] && (item.pagepermisson || item.routepermisson)
    }

    const checkPermisson = (item) => {
        return rights.includes(item.key)
    }

    return (
        <Spin size="large" spinning={props.isLoading}>
            <Switch>
                {
                    backRouteList.map(item => {
                        if (checkRoute(item) && checkPermisson(item)) {
                            return <Route path={item.key} key={item.key} component={LocalRouterList[item.key]} exact />
                        }
                        return null
                    })
                }
                <Redirect from="/" to="/home" exact />
                {
                    backRouteList.length > 0 && <Route path="*" component={NoPermission} />
                }
            </Switch>
        </Spin>
    )
}

const mapStateToProps = ({LoadingReducer:{isLoading}}) => ({
    isLoading
})

export default  connect(mapStateToProps)(NewsRouter)