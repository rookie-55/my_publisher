import { useEffect, useState } from 'react'
import axios from 'axios'
import {notification} from 'antd'
function usePublish(value){
    const {username} = JSON.parse(localStorage.getItem('token'))
    const [dataSource, setDataSource] = useState([])
    useEffect(() => {
        axios.get(`/news?author=${username}&publishState=${value}&_expand=category`).then(res=>{
            // console.log('res.data :>> ', res.data);
            setDataSource(res.data)
        })
    }, [username,value])

    const handlePublish = (id) => {
        setDataSource(dataSource.filter(res=>res.id !== id))

        axios.patch(`/news/${id}`,{
            "publishState":2,
            "createTime":Date.now()
        }).then(res=>{
            notification.info({
                message: `通知`,
                description:
                    `您可以去已发布中查看`,
            });
        })
    }

    const handleSunset = (id) => {
        setDataSource(dataSource.filter(res=>res.id !== id))

        axios.patch(`/news/${id}`,{
            "publishState":3
        }).then(res=>{
            notification.info({
                message: `通知`,
                description:
                    `您可以去已下线中查看`,
            });
        })
        
    }

    const handleDelete = (id) => {
        setDataSource(dataSource.filter(res=>res.id !== id))

        axios.delete(`/news/${id}`).then(res=>{
            notification.info({
                message: `通知`,
                description:
                    `删除成功`,
            });
        })
        
    }

    return {
        dataSource,
        handlePublish,
        handleSunset,
        handleDelete
    }
}

export default usePublish