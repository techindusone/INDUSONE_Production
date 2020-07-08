import React from 'react'
import { Switch, Route } from 'react-router-dom'
import Home from './Home'
import Tutorials from './Tutorials/Tutorials'
import ProblemsCanvas from './Problems/ProblemsCanvas'
import Discussions from './Blogs/Discussions'
import Login from './Auth/Login'
import Register from './Auth/Register'
import Navbar from './Elements/Navbar'
import Admin from './Admin/Admin'
import ProRoute from '../Utils/ProRoute'
import AuthRoute from '../Utils/AuthRoute'
import Blog from './Blogs/Blog'
import { LinkedInPopUp } from 'react-linkedin-login-oauth2';
import QuestionCardsList from './Problems/Questions/QuestionList';
import ProblemInterface from './Problems/ProblemInterface';
import ManageProblems from './Admin/Problems/ManageProblems'
import ManageStudents from './Admin/Students/ManageStudents'
import ManageBlogs from './Admin/Blogs/ManageBlogs'
import Profile from './Profile/Profile'

export default function Main() {
    return (
        <main>
            <Navbar/>
            <Switch>
                <Route exact path='/' component={Home} />
                <Route exact path="/linkedin" component={LinkedInPopUp} />
                <ProRoute exact path='/home' component={Home} />
                {/* <ProRoute exact path='/tutorials' component={Home} /> */}
                {/* <ProRoute exact path='/tutorials' component={Tutorials} /> */}
                {/* <ProRoute exact path='/problems' component={Problems} /> */}
                {/* <Route exact path='/updateblog' component={UpdateBlog}/> */}
                <Route exact path='/topics' component={ProblemsCanvas} />
                <Route exact path='/problems' component={ProblemInterface} />
                <Route exact path='/tutorials' component={Tutorials} />
                <Route exact path='/questions' component={QuestionCardsList} />
                <ProRoute exact path='/blogs' component={Discussions} />
                <Route exact path='/blog' component={Blog} />
                <ProRoute path='/admin' component={Admin} />
                <ProRoute path='/profile' component={Profile} />
                <AuthRoute exact path='/login' component={Login} />
                <AuthRoute exact path='/register' component={Register} />
                <ProRoute exact path='/admin/students' component={ManageStudents}/>
                <ProRoute exact path='/admin/blogs' component={ManageBlogs}/>
                <ProRoute exact path='/admin/problems' component={ManageProblems}/>
            </Switch>
        </main>
    )
}
