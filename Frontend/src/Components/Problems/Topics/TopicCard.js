import React from 'react';
import { useHistory } from 'react-router-dom';


export default function TopicCard(props) {
    const history = useHistory()
    const handleSubmit = (problemStatements)=>{
        history.push('/questions',{problemStatements : problemStatements});

    };
    const {topic,problemStatements} = props;
    return (
        <div>
            <div class="ui fluid card" style={{border: 'none', boxShadow: '0 6px 20px -5px rgba(0,0,0,0.24)'}}>
                <div class="content">
                    <div class="header">{topic}</div>
                    <div class="description" style={{fontWeight: 700}}>15% Companies test this topic</div>
                </div>
                <div class="extra content">
                    <a  class="button" onClick = {() => {handleSubmit(problemStatements)}} style={{color: 'white', cursor: 'pointer', borderRadius: '0', boxShadow: '0 8px 6px -6px #7971EA'}} >Start Solving <i aria-hidden="true" class="icon angle right white"></i></a>
                </div>
            </div>
        </div>)
    
}
