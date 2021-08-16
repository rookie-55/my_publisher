import React, { useState, useEffect, useRef } from 'react'
import { PageHeader, Steps, Button, Form, Input, Select, message, notification } from 'antd';
import NewsEditor from '../../../components/NewsEditor'
import './index.css'
import axios from 'axios';

const { Step } = Steps;
const { Option } = Select;

export default function NewsUpdate(props) {
    const [current, setCurrent] = useState(0)//表示在攥写的第几步
    const [categoryList, setCategoryList] = useState([])//类型列表

    const [formInfo, setFormInfo] = useState({})//存整个组件将要提交给后台的东西
    const [content, setContent] = useState('')//存整个组件将要提交给后台的东西

    const handleNext = () => {
        if (current === 0) {
            NewsForm.current.validateFields().then(res => {
                setCurrent(item => item + 1)
                setFormInfo(res)
            }).catch(error => {
                console.log('error :>> ', error);
            })
        } else {
            if (content === '' || content.trim() === '<p></p>') {
                message.error('新闻内容不能为空')
            } else {
                setCurrent(item => item + 1)
            }
        }

    }
    const handlePre = () => {
        setCurrent(item => item - 1)
    }

    useEffect(() => {
        axios.get("/categories").then(res => {
            setCategoryList(res.data)
        })
    }, [])

    useEffect(() => {
        // console.log('props.match.params.id :>> ', String(props.match.params.id).substr(1));
        axios.get(`/news/${props.match.params.id}?_expand=category&_expand=role`).then(res => {
            let {title,categoryId, content} = res.data
            NewsForm.current.setFieldsValue({
                title,
                categoryId
            })
            setContent(content)
        })
    }, [props.match.params.id])

    const NewsForm = useRef(null)

    const handleSave = (auditState) => {
        axios.patch(`/news/${props.match.params.id}`, {
            ...formInfo,
            "content": content,
            "auditState": auditState,
        }).then(res => {
            props.history.push(auditState === 0 ? '/news-manage/draft' : '/audit-manage/list')
            notification.info({
                message: `通知`,
                description:
                    `您可以去${auditState === 0 ? '草稿箱' : '审核列表'}中查看`,
            });
        })
    }
    return (
        <div>
            <PageHeader
                className="site-page-header"
                title="更新新闻"
                onBack={()=>{props.history.goBack()}}
                subTitle="This is a subtitle"
            />
            <Steps current={current}>
                <Step title="基本信息" description="新闻标题及新闻分类" />
                <Step title="新闻内容" description="新闻主题内容" />
                <Step title="提交新闻" description="保存草稿或提交审核" />
            </Steps>

            <div style={{ marginTop: "50px" }}>
                <div className={current === 0 ? '' : 'hidden'}>
                    <Form
                        name="basic"
                        labelCol={{ span: 4 }}
                        wrapperCol={{ span: 18 }}
                        ref={NewsForm}
                    >
                        <Form.Item
                            label="新闻标题"
                            name="title"
                            rules={[{ required: true, message: '请输入新闻标题!' }]}
                        >
                            <Input />
                        </Form.Item>

                        <Form.Item
                            label="新闻分类"
                            name="categoryId"
                            rules={[{ required: true, message: '请输入新闻标题!' }]}
                        >
                            <Select>
                                {
                                    categoryList.map((item) => <Option key={item.id} value={item.id}>{item.title}</Option>)
                                }

                            </Select>
                        </Form.Item>

                    </Form>
                </div>

                <div className={current === 1 ? '' : 'hidden'}>
                    <NewsEditor getContent={(value) => {
                        setContent(value)
                    }} content={content}></NewsEditor>
                </div>

                <div className={current === 2 ? '' : 'hidden'}>

                </div>
            </div>

            <div style={{ marginTop: "30px" }}>
                {
                    current === 2 && <span>
                        <Button type="primary" onClick={() => { handleSave(0) }}>保存到草稿箱</Button>
                        <Button danger onClick={() => { handleSave(1) }}>提交审核</Button>
                    </span>
                }
                {
                    current < 2 && <Button type="primary" onClick={handleNext}>下一步</Button>
                }
                {
                    current > 0 && <Button onClick={handlePre}>上一步</Button>
                }
            </div>
        </div>
    )
}
