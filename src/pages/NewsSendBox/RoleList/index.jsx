import React, { useEffect, useState } from 'react'
import { Table, Button, Modal,Tree } from 'antd'
import { DeleteOutlined, UnorderedListOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import axios from 'axios'


const { confirm } = Modal;


export default function RoleList() {
    const [dataSource, setDataSource] = useState([])
    const [rightList, setRightList] = useState([])
    const [currentRights, setCurrentRights] = useState([])
    const [currentId, setCurrentId] = useState(0)
    const [isModalVisible, setIsModalVisible] = useState(false)
    const columns = [
        {
            title: 'Id',
            dataIndex: 'id',
            render: (id) => {
                return <b>{id}</b>
            }
        },
        {
            title: '角色名称',
            dataIndex: 'roleName'
        },
        {
            title: '操作',
            render: (item) => {
                return <div>
                    <Button danger shape="circle" icon={<DeleteOutlined />} onClick={() => { comfirmDelete(item) }}></Button>{' '}
                    <Button type="primary" shape="circle" icon={<UnorderedListOutlined />} onClick={() => {
                         setIsModalVisible(true)
                         setCurrentRights(item.rights)  
                         setCurrentId(item.id)
                        }} />
                </div>
            }
        },

    ]

    useEffect(() => {
        axios.get('/roles').then(res => {
            // console.log('res.data :>> ', res.data);
            setDataSource(res.data)
        })
    }, [])

    useEffect(() => {
        axios.get('/rights?_embed=children').then(res => {
            setRightList(res.data)
        })
    }, [])

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
        setDataSource(dataSource.filter((value) => {
            return value.id !== item.id
        }))
        axios.delete(`/roles/${item.id}`)
    }


    const handleOk = () => {
        setIsModalVisible(false)
        setDataSource(dataSource.map((item)=>{
            if(item.id === currentId){
                return{
                    ...item,
                    rights:currentRights
                }
            }
            return item
        }))

        axios.patch(`/roles/${currentId}`,{
            rights:currentRights
        })
        
    }

    const handleCancel = () => {
        setIsModalVisible(false)
    }

    const onCheck = (checkKeys) => {
        setCurrentRights(checkKeys.checked)
    }

    return (
        <div>
            <Table dataSource={dataSource} columns={columns} rowKey={item => item.id}></Table>
            <Modal title="权限分配" visible={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
                <Tree
                    checkStrictly
                    checkable
                    checkedKeys={currentRights}
                    onCheck={onCheck}
                    treeData={rightList}
                />
            </Modal>
        </div>
    )
}
