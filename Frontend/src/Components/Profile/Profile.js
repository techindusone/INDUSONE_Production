import React, { useContext } from 'react'
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import CheckoutForm from '../Payments/CheckoutForm'
import { AuthContext } from '../../Context/AuthContext'
import { NoUnusedFragmentsRule } from 'graphql';

const stripePromise = loadStripe("pk_test_YOoGz6GiPV9K8ky8gdWFYVKz003YOibHYz")

export default function Profile() {

    const { user, userData, logout } = useContext(AuthContext)
    return (

        <div style={{ padding: '15vw', paddingTop: '25vh' }}>
            <div className='ui grid container' style={{ boxShadow: '0 20px 57px 0 rgba(51,51,51,0.1)' }}>
                <div className='ui row' style={{ marginBottom: "10px", marginTop: "10px", display: "flex", justifyContent: "spaceBetween" }}>

                    <div class="col-lg-5" >
                        <div class="row">
                            <div className="col-lg-4">
                            </div>
                            <div className="col-lg-8">
                                <h1 style={{ fontWeight:"350",fontFamily: 'Montserrat'}}>Name</h1>
                            </div>
                        </div>                    </div>
                    <div class="col-lg-2">
                        <h1 style={{ textAlign: "center" }}></h1>
                    </div>
                    <div class="col-lg-5">
                        <div class="row">
                            <div className="col-lg-8">
                                <p style={{textAlign: "right",fontSize:"20px", fontFamily: 'Montserrat',fontWeight:"400" }} > {userData.firstName + ' ' + userData.lastName} </p>
                            </div>
                            <div className="col-lg-4">
                            </div>
                        </div>
                    </div>
                </div>
                <div className='ui row' style={{ marginBottom: "10px", display: "flex", justifyContent: "space-between" }}>
                    <div class="col-lg-5">
                        <div class="row">
                            <div className="col-lg-4">
                            </div>
                            <div className="col-lg-8">
                                <h1 style={{ fontWeight:"350",fontFamily: 'Montserrat'}}>E mail</h1>
                            </div>
                        </div>
                    </div>
                    <div class="col-lg-2">
                        <h1 style={{ textAlign: "center" }}></h1>
                    </div>
                    <div class="col-lg-5">
                        <div class="row">
                            <div className="col-lg-8">
                                <p style={{ marginTop: "10px", textAlign: "right",fontFamily: 'Montserrat',fontWeight:"400" }}> {userData.email} </p>
                            </div>
                            <div className="col-lg-4">
                            </div>
                        </div>
                    </div>
                </div>
                <div className='ui row' style={{ marginBottom: "10px", display: "flex", justifyContent: "space-between" }}>
                    <div class="col-lg-5">
                        <div class="row">
                            <div className="col-lg-4">
                            </div>
                            <div className="col-lg-8">
                                <h1 style={{ fontWeight:"350",fontFamily: 'Montserrat'}}>Username</h1>
                            </div>
                        </div>
                    </div>
                    <div class="col-lg-2">
                        <h1 style={{ textAlign: "center" }}></h1>
                    </div>
                    <div class="col-lg-5">
                        <div class="row">
                            <div className="col-lg-8">
                                <p style={{ marginTop: "10px", textAlign: "right",fontFamily: 'Montserrat',fontWeight:"400" }}>{userData.username}</p>
                            </div>
                            <div className="col-lg-4">
                            </div>
                        </div>
                    </div>
                </div>
                <div className='ui row' style={{ marginBottom: "10px", display: "flex", justifyContent: "space-between" }}>
                    <div class="col-lg-5">
                        <div class="row">
                            <div className="col-lg-4">
                            </div>
                            <div className="col-lg-8">
                                <h1 style={{ fontWeight:"350",fontFamily: 'Montserrat'}}>Phone</h1>
                            </div>
                        </div>
                    </div>
                    <div class="col-lg-2">
                        <h1 style={{ textAlign: "center" }}></h1>
                    </div>
                    <div class="col-lg-5">
                        <div class="row">
                            <div className="col-lg-8">
                                <p style={{ marginTop: "10px", textAlign: "right",fontFamily: 'Montserrat',fontWeight:"400" }}> {userData.phone} </p>
                            </div>
                            <div className="col-lg-4">
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Elements stripe={stripePromise}>
                <CheckoutForm />
            </Elements>
        </div>
    )
}