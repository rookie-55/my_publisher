import { Button } from 'antd'
import React from 'react'
import NewsPublish from '../../../components/NewsPublish'
import usePublish from '../usePubilsh'


export default function Unpublished() {
     const{dataSource,handlePublish} = usePublish(1)
     console.log('dataSource :>> ', dataSource);
    return (
        <div>
            <NewsPublish dataSource={dataSource} button={(id)=><Button type="primary" onClick={()=>handlePublish(id)}>发布</Button>}></NewsPublish>
        </div>
    )
}