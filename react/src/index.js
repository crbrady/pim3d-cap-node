import React from 'react';
import ReactDOM from 'react-dom';
import io from 'socket.io-client';
import WebFont from 'webfontloader';
import Toggle from 'react-toggle';
import './index.css';

const socket = io.connect("localhost:2000");
socket.on('message', msg => console.log(msg));



WebFont.load({
    google: {
        families: ['Archivo']
    }
});

var c1 = '#78839D';
var c2 = '#C1B7BA';
var c3 = 'white';//#ECD4C6
var c4 = 'white';//#FFE2BB
var c5 = '#FFC58B';

var blankImageBytes = '';

/*
#E6E2AF
#A7A37E
#EFECCA
#046380
#002F2F
 */



const topBarStyle = {
    margin: '0px',
    border: '0px',
    background: c1,
    width: '100%',
    height: '46px'
}


const horizontalSpacerStyle = {
    margin: '0px',
    border: '0px',
    width: '100%',
    height: '6px'
}

const camDivStyle = {
    margin: '5px ',
    width: '320px',
    height: '220px',
    border: '5px solid '+c3,
    float: 'left',
    borderRadius: '5px'
};

const camTopDiv = {
    margin: '0px ',
    width: '100%',
    height: '25px',
    background: c3
};

const camHeading = {
    fontFamily: 'Archivo',
    margin:'auto',
    lineHeight:'25px',
    verticalAlign:'middle'
}

const camMidDiv = {
    width: '100%',
    height: '150px',
    background: c4
};

const camBottomDiv = {
    width: '100%',
    height: '45px',
    background: c3
};

const camNameDiv = {
    top:'50%',
    textAlign:'left'
}

const mainTitleStyle = {
    float: 'left',
    color:'white',
    paddingLeft:'14px',
    paddingRight:'14px',
    fontFamily: 'Archivo',
    margin:'auto',
    lineHeight:'50px',
    verticalAlign:'middle',
    display: 'inline'
}

const refreshButtonStyle = {
    marginTop:'5px',
    fontSize:'15px',
    width:'100px',
    borderWidth:'0px',
    fontFamily: 'Archivo',
    lineHeight:'35px',
    verticalAlign:'middle',
    borderRadius: '20px',
    backgroundColor:c4
}

const statsPStyle = {
    fontFamily: 'Archivo',
    margin:'auto',
    lineHeight:'25px',
    verticalAlign:'middle',
    fontSize:'12px',
    display: 'inline'
}

const toggleLabel = {
    fontFamily: 'Archivo',
    marginRight:'5px',
    marginLeft:'5px',
    lineHeight:'22px',
    verticalAlign:'top',
    fontSize:'12px'
}

const columnStyleThird ={
    float: 'left',
    width: '33%',
    textAlign:'center'
}

const statsCol1 ={
    float: 'left',
    width: '35%',
    textAlign:'left'
}

const statsCol2 ={
    float: 'left',
    width: '20%',
    textAlign:'center'
}

const statsCol3 ={
    float: 'left',
    width: '45%',
    textAlign:'right'
}


const camControlCol1 ={
    float: 'left',
    width: '25%',
    textAlign:'left',
    lineHeight:'20px'
}

const camControlCol2 ={
    float: 'left',
    width: '45%',
    textAlign:'right',
    lineHeight:'20px'
}

const camControlCol3 ={
    float: 'left',
    width: '30%',
    textAlign:'right'
}

const fullPreviewButton={
    wdith:'100%'
}


//msg(ws.rQshiftBytes());
//<img src={"data:image/jpg;base64," + Base64.encode(data)}></img>

var status =[];

socket.on('heartbeats', msg => {
    status = JSON.parse(msg);
    console.log('heartbeats ='+msg +'\n' + status.length);
    console.log(status);

    RenderPage();
});

function Cam(props){
    console.log(props.status);

    const content = props.status.map((cam) =>
        <div style={camDivStyle} key={cam.name}>
            <div style={camTopDiv}>
                <div style={camNameDiv}>
                    <h4 style = {camHeading}>{cam.name}</h4>
                </div>
            </div>

            <div style={camMidDiv}>
                <img src={"http://localhost:8080/"+cam.name+"/thumb/asdf"}></img>
            </div>

            <div style={camBottomDiv}>
                <div>
                    <div style={statsCol1}>
                        <span style={statsPStyle}>
                            Mem: {parseInt(cam.freeRam/1000000)}M / {parseInt(cam.totalRam/1000000)}M
                        </span>
                    </div>
                    <div style={statsCol2}>
                        <span style={statsPStyle}>
                            OS: {cam.platform}
                        </span>
                    </div>
                    <div style={statsCol3}>
                        <span style={statsPStyle}>
                            Uptime: {parseInt(cam.uptime/86400)}d {parseInt(cam.uptime/3600)%24}h {parseInt(cam.uptime/60)%60}m
                        </span>
                    </div>

                </div>
                <div>
                    <CamControl />
                </div>
            </div>
        </div>
    );
    return (
        <div>
            {content}
        </div>
    );
}

class CamControl extends React.Component {
    render(){
        return(
            <div>
                <div style={camControlCol1}>
                    <button style={fullPreviewButton}>Full Preview</button>
                </div>
                <div style={camControlCol2}>
                    <span style={toggleLabel}>Rapid Preview</span>

                    <Toggle
                        // defaultChecked={this.state.baconIsReady}
                        // onChange={this.handleBaconChange}
                    />

                </div>
                <div style={camControlCol3}>
                    <span style={toggleLabel}>Enable</span>
                    <Toggle
                        // defaultChecked={this.state.baconIsReady}
                        // onChange={this.handleBaconChange}
                    />
                </div>
            </div>
        );
    }
}

class Cams extends React.Component {
    render() {
        document.body.style.backgroundColor = c2;
        document.body.style.margin = 0;
        return (
            <div>
                <div style={topBarStyle} >
                    <h2 style={mainTitleStyle}>RasScan</h2>
                    <button style={refreshButtonStyle}> Refresh </button>
                </div>
                <div style={horizontalSpacerStyle}>
                </div>
                <div>
                    <Cam status={status} />
                </div>
            </div>
        );
    }
}

function RenderPage() {
    ReactDOM.render(
        <Cams />,
        document.getElementById('root')
    );
}

RenderPage();


