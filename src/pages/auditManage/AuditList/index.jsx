import React, { useEffect,useState } from 'react'
import {Button,Table,Tag, notification,Modal} from 'antd'
import {
    ExclamationCircleOutlined,
} from '@ant-design/icons';
import axios from 'axios'


const { confirm } = Modal;
export default function AuditList(props) {
    const [dataSource, setDataSource] = useState([])
    const { username } = JSON.parse(localStorage.getItem('token'))
    useEffect(() => {
        axios.get(`/news?author=${username}&auditState_ne=0&publishState_lte=1&_expand=category`).then(res => {
            console.log('res.data :>> ', res.data);
            setDataSource(res.data)
        })
    }, [username])

    
    const comfirmDelete = (item) => {
        confirm({
            title: '确认撤销吗?',
            icon: <ExclamationCircleOutlined />,
            onOk() {
                //   console.log('OK');
                handleRevert(item)
            },
            onCancel() {
                //   console.log('Cancel');
            },
        });
    }

    const handleRevert = (item) => {
        setDataSource(dataSource.filter(data=>data.id!==item.id))
        axios.patch(`/news/${item.id}`,{
            auditState:0
        }).then(res=>{
            notification.info({
                message: `通知`,
                description:
                    `您可以去草稿箱中查看`,
            });
        })
    }

    const handleUpdate = (item) => {
        props.history.push(`/news-manage/update/${item.id}`)
    }

    const handlePublish = (item) => {
        axios.patch(`/news/${item.id}`,{
            "publishState":2,
            "pubilshTime":Date.now()
        }).then(res=>{
            props.history.push('/publish-manage/published')
            notification.info({
                message: `通知`,
                description:
                    `您可以去已发布中查看`,
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
            title: '审核状态',
            dataIndex: 'auditState',
            render:(auditState)=>{
                const colorList = ['','orange','green','red']
                const itemList = ['', '审核中', '已通过', '未通过']
                return <Tag color={colorList[auditState]}>{itemList[auditState]}</Tag>
            }
        },
        {
            title: '操作',
            render: (item) => {
                return <div>
                    {
                        item.auditState === 1&&<Button danger onClick={()=>{comfirmDelete(item)}}>撤销</Button>
                    }
                    {
                        item.auditState === 2&&<Button type='primary' onClick={()=>{handlePublish(item)}}>发布</Button>
                    }
                    {
                        item.auditState === 3&&<Button type='primary' onClick={()=>{handleUpdate(item)}}>修改</Button>
                    }
                    
                </div>
            }
        },

    ];


    return (
        <div>
            <Table dataSource={dataSource} columns={columns} pagination={{ pageSize: 5 }} rowKey={item=>item.id}/>;
        </div>
    )
}
