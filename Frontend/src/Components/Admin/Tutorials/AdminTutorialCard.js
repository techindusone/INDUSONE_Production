import React from 'react';
// import { useHistory } from 'react-router-dom';


export default function AdminTutorialCard({tutorial,setEditTutorial,delete_tutorial}) {
    // const history = useHistory()

    return (
        <div>
            {tutorial ?
            (
                <div class="ui card" style={{ borderRadius: "0", width: "100%", boxShadow: '0 6px 20px -5px rgba(0,0,0,0.2)' }} >
                    <div class="content">
                        <div class="container">
                            <div class="row">
                                <div class="col-lg-8" style={{ marginBottom: "10px" }} >
                                    <h1 style={{ paddingTop: "0px", paddingBottom: "-30px" }} >{tutorial.title}</h1>
                                </div>
                                <div class="col-lg-3" style={{ marginTop: "15px", display: "block", }} >
                                    <a class="button" onClick={() => setEditTutorial(tutorial)} style={{ color: 'white', cursor: 'pointer', borderRadius: '0', boxShadow: '0 8px 6px -6px #7971EA' }} >Modify Problem<i aria-hidden="true" class="icon angle right white"></i></a>
                                </div>
                                <div class="col-lg-1" style={{ marginTop: "15px", display: "block", }} >
                                    <a onClick={() => delete_tutorial(tutorial)} style={{color :'red', cursor: 'pointer', borderRadius: '0', textAlign: 'center', fontFamily: 'Montserrat', fontWeight: '500'}} >Delete<i aria-hidden="true" class="icon delete calendar" style={{width: '100%', height: '2vh', color: '#fc0366'}}></i></a>
                                </div>
                            </div>
                            <br/>
                        </div>
                    </div>
                </div>
            ):<>a</>}
        </div>
    )

}