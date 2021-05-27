import React from "react";
import {withRouter} from "react-router-dom";


function History(props){
    const {history}= props;

    const goBack = ()=>{
        history.goBack();
    }
    const goForward = ()=>{
        history.goForward();
    }

    return(
        <div className="col-2" >
            <span className="navigation" onClick={goBack} >
                <img src="https://img.icons8.com/windows/32/ffffff/back.png" alt=""/>
            </span>

            <span className="navigation" onClick={goForward} >
                <img src="https://img.icons8.com/windows/32/ffffff/forward.png" alt=""/>
            </span>
        </div>
    )
}

export default withRouter(History)