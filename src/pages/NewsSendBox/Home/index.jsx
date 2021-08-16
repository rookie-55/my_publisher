import React, { useEffect, useState, useRef } from 'react'
import { Card, Col, Row, List, Avatar, Drawer } from 'antd';
import { EditOutlined, EllipsisOutlined, SettingOutlined } from '@ant-design/icons';
import axios from 'axios';
import * as Echarts from 'echarts'
import _ from 'lodash'

const { Meta } = Card;


export default function Home() {

    const [viewList, setViewList] = useState([])
    const [starList, setStarList] = useState([])
    const [myList, setMyList] = useState([])
    const [visible, setVisible] = useState(false)
    const [pieChart, setPieChart] = useState(null)

    const chartRef = useRef()
    const pieRef = useRef()
    useEffect(() => {
        axios.get('news?publishState=2&_expand=category&_sort=view&_order=desc&_limit=6').then(res => {
            // console.log('res.data :>> ', res.data);
            setViewList(res.data)
        })
    }, [])
    useEffect(() => {
        axios.get('news?publishState=2&_expand=category&_sort=star&_order=desc&_limit=6').then(res => {
            // console.log('res.data :>> ', res.data);
            setStarList(res.data)
        })
    }, [])

    useEffect(() => {
        axios.get(`/news?publishState=2&_expand=category`).then(res => {
            // console.log(_.groupBy(res.data,item=>item.category.title));
            renderBar(_.groupBy(res.data, item => item.category.title))
            setMyList(res.data)
        })

        return () => {
            window.onresize = null
        }
    }, [])

    const renderBar = (value) => {
        var myChart = Echarts.init(chartRef.current);

        // 指定图表的配置项和数据
        var option = {
            title: {
                text: '新闻分类图示'
            },
            tooltip: {},
            legend: {
                data: ['数量']
            },
            xAxis: {
                data: Object.keys(value),
                axisLabel: {
                    rotate: "45"
                }
            },
            yAxis: {
                minInterval: 1
            },
            series: [{
                name: '数量',
                type: 'bar',
                data: Object.values(value).map(item => item.length)
            }]
        };

        // 使用刚指定的配置项和数据显示图表。
        myChart.setOption(option);

        window.onresize = () => {
            myChart.resize()
        }
    }

    const renderPie = (obj) => {

        var currentList = myList.filter(item=>item.author === user.username)
        var groupbyList = _.groupBy(currentList,item=>item.category.title)

        var list = []
        for(var i in groupbyList){
            list.push({
                name:i,
                value:groupbyList[i].length
            })
        }

        if (!pieChart) {
            var myChart = Echarts.init(pieRef.current);
            setPieChart(myChart)
        } else {
            myChart = pieChart
        }
        var option;

        option = {
            title: {
                text: '个人新闻分类图示',
                left: 'center'
            },
            tooltip: {
                trigger: 'item'
            },
            legend: {
                orient: 'vertical',
                left: 'left',
            },
            series: [
                {
                    name: '发布数量',
                    type: 'pie',
                    radius: '50%',
                    data: list,
                    emphasis: {
                        itemStyle: {
                            shadowBlur: 10,
                            shadowOffsetX: 0,
                            shadowColor: 'rgba(0, 0, 0, 0.5)'
                        }
                    }
                }
            ]
        };

        option && myChart.setOption(option);

    }

    const user = JSON.parse(localStorage.getItem('token'))

    

    return (
        <div className="site-card-wrapper">
            
            <Row gutter={16}>
                <Col span={8}>
                    <Card title="用户最常浏览" bordered={true}>
                        <List
                            dataSource={viewList}
                            renderItem={item => (
                                <List.Item>
                                    <a href={`#/news-manage/preview/${item.id}`}>{item.title}</a>
                                </List.Item>
                            )}
                        />
                    </Card>
                </Col>
                <Col span={8}>
                    <Card title="用户点赞最多" bordered={true}>
                        <List
                            dataSource={starList}
                            renderItem={item => (
                                <List.Item>
                                    <a href={`#/news-manage/preview/${item.id}`}>{item.title}</a>
                                </List.Item>
                            )}
                        />
                    </Card>
                </Col>
                <Col span={8}>
                    <Card
                        cover={
                            <img
                                alt="example"
                                src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png"
                            />
                        }
                        actions={[
                            <SettingOutlined key="setting" onClick={() => {
                                setTimeout(() => {
                                    setVisible(true)
                                    renderPie()
                                }, 0);
                            }} />,
                            <EditOutlined key="edit" />,
                            <EllipsisOutlined key="ellipsis" />,
                        ]}
                    >
                        <Meta
                            avatar={<Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />}
                            title={user.username}
                            description={
                                <div>
                                    <b>{user.region ? user.region : '全球'}</b>
                                    <span style={{ marginLeft: "30px" }}>{user.role.roleName}</span>
                                </div>
                            }
                        />
                    </Card>
                </Col>

            </Row>

            <Drawer
                width="500px"
                title="Basic Drawer"
                placement="right"
                closable={true}
                onClose={() => {
                    setVisible(false)
                }}
                visible={visible}
            >
                <div ref={pieRef} style={{ width: "100%", height: "400px" }}></div>
            </Drawer>

            <div ref={chartRef} style={{ width: "100%", height: "400px" }}></div>
        </div >
    )
}
