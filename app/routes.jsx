import React from 'react';
import {HashRouter, Route, Switch, Redirect} from 'react-router-dom'
import Page from './common/Page';
import Index from './Index';
import News from './component/news/News';
import NewsEdit from './component/news/NewsEdit';
import SignIn from "./component/signin/SignIn";
import Dashboard from "./component/dashboard/Dashboard";
import User from "./component/user/User";
import Admin from "./component/admin/Admin";
import AdminEdit from "./component/admin/AdminEdit";
import Roles from "./component/admin/Roles";
import RoleEdit from "./component/admin/RoleEdit";
import Banners from "./component/banner/Banners";
import Articles from "./component/article/Articles";
import ArticleEdit from "./component/article/ArticleEdit";
import Custcases from "./component/custcase/Custcases";
import CustcaseEdit from "./component/custcase/CustcaseEdit";
import Custevals from "./component/custeval/Custevals";
import CustevalEdit from "./component/custeval/CustevalEdit";

const routes = (
    <HashRouter>
        <Switch>
            <Route path='/' children={() => (
                <Page>
                    <Switch>
                        <Redirect exact from='/' to='/app/dashboard/index'/>
                        <Route path='/' exact component={Index}/>
                        <Route path='/signin' component={SignIn}/>
                        <Route path='/app' children={() => (
                            <Index>
                                <Route path='/app/dashboard/index' component={Dashboard}/>

                                <Route path={'/app/admin/admins'} component={Admin}/>
                                <Route path={'/app/admin/admin-edit/:id'} component={AdminEdit}/>
                                <Route path={'/app/admin/roles'} component={Roles}/>
                                <Route path={'/app/admin/role-edit/:id'} component={RoleEdit}/>

                                <Route path={'/app/info/user'} component={User}/>
                                <Route path={'/app/info/news'} component={News}/>

                                <Route path={"/app/info/edit/news-edit/:id"} component={NewsEdit}/>
                                <Route path={'/app/info/banners'} component={Banners}/>
                                <Route path={'/app/info/articles'} component={Articles}/>
                                <Route path={'/app/info/article-edit/:id'} component={ArticleEdit}/>
                                <Route path={'/app/info/custcases'} component={Custcases}/>
                                <Route path={'/app/info/custcase-edit/:id'} component={CustcaseEdit}/>
                                <Route path={'/app/info/custevals'} component={Custevals}/>
                                <Route path={'/app/info/custeval-edit/:id'} component={CustevalEdit}/>

                            </Index>
                        )}/>
                    </Switch>
                </Page>
            )}>
            </Route>
        </Switch>
    </HashRouter>
);

export default routes;