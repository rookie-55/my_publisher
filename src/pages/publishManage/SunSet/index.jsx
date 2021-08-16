import { Button } from 'antd'
import React from 'react'
import NewsPublish from '../../../components/NewsPublish'
import usePublish from '../usePubilsh'


export default function SunSet () {
     const{dataSource,handleDelete} = usePublish(3)
    //  console.log('dataSource :>> ', dataSource);
    return (
        <div>
            <NewsPublish dataSource={dataSource} button={(id)=><Button danger onClick={()=>handleDelete(id)}>删除</Button>}></NewsPublish>
        </div>
    )
}