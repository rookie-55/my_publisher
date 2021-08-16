import React, { useState, useEffect } from 'react'
import { Table, Tag, Button, Modal, Popover, Switch } from 'antd'
import { 
    DeleteOutlined, 
    EditOutlined, 
    ExclamationCircleOutlined, 
    CheckOutlined, 
    CloseOutlined 
} from '@ant-design/icons';
import axios from 'axios'
const { confirm } = Modal;



export default function RightList() {


    const [dataSource, setDataSource] = useState([])

    useEffect(() => {
        axios.get('/rights?_embed=children').then(res => {
            const list = res.data

            list.forEach(item => {
                if (item.children.length === 0) {
                    item.children = ''
                }
            })
            setDataSource(list)
        })
    }, [])


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
            title: '权限名称',
            dataIndex: 'title'
        },
        {
            title: '权限路径',
            dataIndex: 'key',
            render: key => {
                return <Tag color={'orange'}>{key}</Tag>
            }
        },
        {
            title: '操作',
            render: (item) => {
                return <div>
                    <Button danger shape="circle" icon={<DeleteOutlined />} onClick={() => { comfirmDelete(item) }}></Button>{' '}
                    <Popover content={
                    <div style={{ textAlign: "center" }}>
                        <Switch checkedChildren={<CheckOutlined />}
                            unCheckedChildren={<CloseOutlined />}
                            checked={item.pagepermisson} onChange={()=>{
                                checkedMethod(item)
                            }}></Switch>
                    </div>} 
                    title="页面配置项" trigger={item.pagepermisson === undefined ? '' : "click"}>
                        <Button type="primary" shape="circle" icon={<EditOutlined />} disabled={item.pagepermisson === undefined} />
                    </Popover>
                </div>
            }
        },

    ];

    const checkedMethod = (item) => {
        item.pagepermisson = item.pagepermisson===1?0:1
        console.log('dataSource :>> ', dataSource);
        setDataSource([...dataSource])
        if(item.grade === 1){
            axios.patch(`/rights/${item.id}`,{
                pagepermisson:item.pagepermisson
            })
        }else{
            axios.patch(`/children/${item.id}`,{
                pagepermisson:item.pagepermisson
            })
        }
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
        console.log('item :>> ', item);
        if (item.grade === 1) {
            setDataSource(dataSource.filter((value) => {
                return value.id !== item.id
            }))
            axios.delete(`/rights/${item.id}`)
        } else {//删除二级菜单的时候要先通过rightId找到一级菜单，再通过一级菜单删除二级菜单里边的东西
            let list = dataSource.filter(value => { return value.id === item.rightId })
            list[0].children = list[0].children.filter((value) => { return value.id !== item.id })
            setDataSource([...dataSource])//不明白为什么dataSource为什么也会变,大概是因为第二层吗，前边的是浅拷贝,并且react中的对比只对比第一层，所以就要加上...去设置state

            axios.delete(`/children/${item.id}`)
        }

    }
    return (
        <div>
            <Table dataSource={dataSource} columns={columns} pagination={{ pageSize: 5 }} />;
        </div>
    )
}
