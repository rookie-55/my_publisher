import React, { forwardRef, useState, useEffect } from 'react'
import { Form, Input, Select } from 'antd'
const { Option } = Select;


const UserForm = forwardRef((props, ref) => {
    const [flag, setFlag] = useState(false)
    useEffect(() => {
        setFlag(props.isUpdataDisabled)
    }, [props.isUpdataDisabled])

    //roleId等于1时，是超级管理员，2是区域经理，3是区域编辑
    const { roleId, region } = JSON.parse(localStorage.getItem('token'))

    //这里是设置不同权限的人对创建和修改用户的操作
    const checkRegiondisabled = (item) => {
        if (props.isUpdata) {
            if (roleId === 1) {
                return false
            } else {
                return true
            }
        } else {
            if (roleId === 1) {
                return false
            } else {
                return item.value !== region
            }
        }
    }

    const checkRoledisabled = (item) => {
        if (props.isUpdata) {
            if (roleId === 1) {
                return false
            } else {
                return true
            }
        } else {
            if (roleId === 1) {
                return false
            } else {
                return item.id !== 3
            }
        }
    }

    return (
        <Form
            ref={ref}
            layout="vertical"
        >
            <Form.Item
                name="username"
                label="用户名"
                rules={[{ required: true, message: 'Please input the title of collection!' }]}
            >
                <Input />
            </Form.Item>
            <Form.Item
                name="password"
                label="密码"
                rules={[{ required: true, message: 'Please input the title of collection!' }]}
            >
                <Input type="password" />
            </Form.Item>
            <Form.Item
                name="region"
                label="区域"
                rules={flag ? [] : [{ required: true, message: 'Please input the title of collection!' }]}
            >
                <Select disabled={flag}>

                    {
                        props.regionList.map(item =>
                            <Option key={item.id} value={item.value} disabled={checkRegiondisabled(item)}>{item.title}</Option>)
                    }
                </Select>
            </Form.Item>
            <Form.Item
                name="roleId"
                label="角色"
                rules={[{ required: true, message: 'Please input the title of collection!' }]}
            >
                <Select onChange={(value) => {
                    // console.log('value :>> ', value);
                    if (value === 1) {
                        setFlag(true)
                        ref.current.setFieldsValue({
                            region: ''
                        })
                    } else {
                        setFlag(false)
                    }
                }}>
                    {
                        props.userList.map(item =>
                            <Option key={item.id} value={item.id} disabled={checkRoledisabled(item)}>{item.roleName}</Option>)
                    }
                </Select>
            </Form.Item>


        </Form>
    )
})


export default UserForm