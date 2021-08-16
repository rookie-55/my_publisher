import React,{useEffect} from 'react'
import { Layout } from 'antd';

import SideMenu from '../../components/SideMenu'
import TopHeader from '../../components/TopHeader'
import NewsRouter from '../../router/NewsRouter'
import Nprogress from 'nprogress'
import 'nprogress/nprogress.css'
import './index.css'
const { Content } = Layout;

export default function NewsSendBox() {
    Nprogress.start()
    useEffect(() => {
        Nprogress.done()
    })
    return (
            <Layout>
                <SideMenu />
                <Layout className="site-layout">
                    <TopHeader />
                    <Content
                        className="site-layout-background"
                        style={{
                            margin: '24px 16px',
                            padding: 24,
                            minHeight: 280,
                            overflow:'auto'
                        }}
                    >
                        <NewsRouter></NewsRouter>
                    </Content>
                </Layout>
            </Layout>
    )
}
