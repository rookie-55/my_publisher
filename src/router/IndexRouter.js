import { HashRouter, Redirect, Route, Switch } from 'react-router-dom'
import Detail from '../client/Detail'
import News from '../client/News'
import Login from '../pages/Login'
import NewsSendBox from '../pages/NewsSendBox'

export default function IndexRouter() {
    return (
        <HashRouter>
            <Switch>
                <Route path="/login" component={Login} />
                <Route path="/news" component={News} />
                <Route path="/detail/:id" component={Detail} />
                {/* <Route path="/" component={NewsSendBox} /> */}
                <Route path="/" render={()=>
                    localStorage.getItem("token")?
                    <NewsSendBox></NewsSendBox>:
                    <Redirect to="/login"/>
                } />
                
            </Switch>
        </HashRouter>
    )
}
