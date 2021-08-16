import React, { useEffect, useState } from 'react'
import {Table,Button,notification} from 'antd'
import axios from 'axios'

export default function Audit() {
    const [dataSource, setDataSource] = useState([])
    const {roleId, username, region} = JSON.parse(localStorage.getItem('token'))
    useEffect(() => {
        axios.get(`/news?auditState=1&_expand=category`).then(res => {
            const list = res.data
            setDataSource(roleId === 1 ? list : [
                ...list.filter(item => item.author === username),
                ...list.filter(item => item.region === region && roleId === 3)
            ])
        })
    }, [roleId, username, region])

    const handlePublish = (item,auditState,publishState) => {
        setDataSource(dataSource.filter(data=>item.id!==data.id))

        axios.patch(`/news/${item.id}`,{
            auditState,
            publishState
        }).then(res=>{
            notification.info({
                message: `通知`,
                description:
                    `您可以去审核列表中查看`,
            });
        })
    }

    const columns = [
        {
            title: '新闻标题',
            dataIndex: 'title',
            render:(title,item)=>{
                return <a href={`#/news-manage/preview/${item.id}`}>{title}</a>
            }
        },
        {
            title: '作者',
            dataIndex: 'author'
        },
        {
            title: '新闻分类',
            dataIndex: 'category',
            render:(category)=>{
                return <div>{category.title}</div>
            }
        },
        {
            title: '操作',
            render: (item) => {
                return <div>
                    <Button type='primary' onClick={()=>handlePublish(item,2,1)}>通过</Button>
                    <Button danger onClick={()=>handlePublish(item,3,0)}>驳回</Button>
                    
                </div>
            }
        },

    ];

    return (
        <div>
            <Table dataSource={dataSource} columns={columns} pagination={{ pageSize: 5 }} rowKey={item => item.id} />
        </div>
    )
}
