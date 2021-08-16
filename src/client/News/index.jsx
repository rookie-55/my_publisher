import React from 'react'
import { Card, Col, Row, PageHeader, List } from 'antd';
import { useEffect, useState } from 'react';
import axios from 'axios';
import _ from 'lodash'


export default function News() {
    const [newsList, setNewsList] = useState([])
    useEffect(() => {
        axios.get(`/news?publishState=2&_expand=category`).then(res => {
            setNewsList(Object.entries(_.groupBy(res.data, item => item.category.title)))
        })
    }, [])
    return (
        <div style={{
            width: "95%",
            margin: "0 auto"
        }}>
            <PageHeader
                className="site-page-header"
                title="全球吃瓜大新闻"
            />
            <div className="site-card-wrapper">
                <Row gutter={[16, 16]}>
                    {
                        newsList.map(item =>
                            <Col span={8} key={item[0]}>
                                <Card title={item[0]} bordered={true} hoverable={true}>
                                    <List
                                        size="small"
                                        bordered={false}
                                        pagination={{
                                            pageSize: 3
                                        }}
                                        dataSource={item[1]}
                                        renderItem={data => <List.Item><a href={`#/detail/${data.id}`}>{data.title}</a></List.Item>}
                                    />
                                </Card>
                            </Col>
                        )
                    }
                </Row>
            </div>,
        </div>
    )
}
