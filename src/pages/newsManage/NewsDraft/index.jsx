import React, { useState, useEffect } from 'react'
import { Table, Button, Modal, notification } from 'antd'
import {
    DeleteOutlined,
    EditOutlined,
    ExclamationCircleOutlined,
    UploadOutlined
} from '@ant-design/icons';
import axios from 'axios'
const { confirm } = Modal;



export default function NewsDraft(props) {
    const [dataSource, setDataSource] = useState([])
    const { username } = JSON.parse(localStorage.getItem("token"))
    useEffect(() => {
        axios.get(`/news?author=${username}&auditState=0&_expand=category`).then(res => {
            const list = res.data
            // console.log('list :>> ', list);
            setDataSource(list)
        })
    }, [username])


    // const content = (
    //     <div style={{ textAlign: "center" }}>
    //         <Switch checkedChildren={<CheckOutlined />}
    //             unCheckedChildren={<CloseOutlined />}
    //             defaultChecked></Switch>
    //     </div>
    // );

    const columns = [
        {
            title: 'Id',
            dataIndex: 'id'
        },
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
            render: (category) => {
                return category.title
            }
        },
        {
            title: '操作',
            render: (item) => {
                return <div>
                    <Button danger shape="circle" icon={<DeleteOutlined />} onClick={() => { comfirmDelete(item) }}></Button>{' '}

                    <Button shape="circle" icon={<EditOutlined />} onClick={()=>{
                        props.history.push(`/news-manage/update/${item.id}`)
                    }}/>{' '}
                    <Button type="primary" shape="circle" icon={<UploadOutlined />} onClick={()=>{handleCheck(item.id)}} />
                </div>
            }
        },

    ];

    const handleCheck = (id) => {
        axios.patch(`/news/${id}`,{
            auditState:1
        }).then(res => {
            props.history.push('/audit-manage/list')
            notification.info({
                message: `通知`,
                description:
                    `您可以去审核列表中查看`,
            });
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
        setDataSource(dataSource.filter((value) => {
            return value.id !== item.id
        }))
        axios.delete(`/news/${item.id}`)
    }
    return (
        <div>
            <Table dataSource={dataSource} columns={columns} pagination={{ pageSize: 5 }} rowKey={item=>item.id}/>;
        </div>
    )
}
