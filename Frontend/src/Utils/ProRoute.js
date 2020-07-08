import React, { useContext } from 'react'
import { Route, Redirect } from 'react-router-dom'
import { AuthContext } from '../Context/AuthContext'

export default function ProRoute ({component: Component, ...rest}) {

    const { user } = useContext(AuthContext)

    return (
        <Route
            {...rest}
            render={(props) =>
                !user ? <Redirect to='/login' /> : <Component {...props} />}
        />
    )

}