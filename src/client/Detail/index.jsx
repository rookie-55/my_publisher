import React, { useEffect, useState } from 'react'
import { PageHeader, Descriptions, message } from 'antd';
import { HeartTwoTone } from '@ant-design/icons';

import moment from 'moment'
import axios from 'axios';


export default function Detail(props) {
    const [newsInfo, setNewsInfo] = useState(null)
    const [flag, setflag] = useState(true)
    useEffect(() => {
        // console.log('props.match.params.id :>> ', String(props.match.params.id).substr(1));
        axios.get(`/news/${props.match.params.id}?_expand=category&_expand=role`).then(res => {
            // console.log('res.data :>> ', res.data);
            setNewsInfo({
                ...res.data,
                view:res.data.view + 1
            })
            return res.data
        }).then(res=>{
            axios.patch(`/news/${props.match.params.id}`,{
                view:res.view+1
            })
        })
    }, [props.match.params.id])

    const handleFavour = () => {
        setflag(false)
        setNewsInfo({
            ...newsInfo, 
            star:newsInfo.star + 1
        })
        axios.patch(`/news/${props.match.params.id}`,{
            star:newsInfo.star+1
        })
    }
    return (
        <div>
            {
                newsInfo && <div>
                    <PageHeader
                        onBack={() => window.history.back()}
                        title={newsInfo.title}
                        subTitle={
                            <div>
                                {newsInfo.category.title}
                                <HeartTwoTone twoToneColor="#eb2f96" style={{marginLeft:"30px"}} onClick={()=>flag?handleFavour():
                                message.error('不可重复点赞')}/>
                            </div>
                        }
                    >
                        <Descriptions size="small" column={3}>
                            <Descriptions.Item label="创建者">{newsInfo.author}</Descriptions.Item>
                            <Descriptions.Item label="发布时间">{newsInfo.publishTime ? moment(newsInfo.createTime).format("YYYY/MM/DD HH:mm:ss") : '-'}</Descriptions.Item>
                            <Descriptions.Item label="区域">{newsInfo.region}</Descriptions.Item>
                            <Descriptions.Item label="访问数量">{newsInfo.view}</Descriptions.Item>
                            <Descriptions.Item label="点赞数量">{newsInfo.star}</Descriptions.Item>
                            <Descriptions.Item label="评论数量">0</Descriptions.Item>
                        </Descriptions>

                    </PageHeader>
                    <div dangerouslySetInnerHTML={{
                        __html: newsInfo.content
                    }} style={{
                        margin:"0 24px",
                        border:"1px solid gray"
                        }}></div>
                </div>
            }
        </div>
    )
}
