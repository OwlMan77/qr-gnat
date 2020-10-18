import React from 'react'
import Authentication from '../../util/Authentication/Authentication'
import { QR } from '../QR/QR'

import './App.css'

export default class App extends React.Component{
    constructor(props){
        super(props)
        this.Authentication = new Authentication()

        //if the extension is running on twitch or dev rig, set the shorthand here. otherwise, set to null. 
        this.twitch = window.Twitch ? window.Twitch.ext : null
        this.state={
            finishedLoading:false,
            theme:'light',
            isVisible:true,
            isValidTime: false,
            url: 'https://www.twitch.tv/sendainex',
            time: null,
            image: 'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fcdn.mobilesyrup.com%2Fwp-content%2Fuploads%2F2015%2F04%2FGlitch-Wizard-Gif-1.gif&f=1&nofb=1'
        }

        this.timer = null;
        this.timeCheck = this.timeCheck.bind(this);

    }

    contextUpdate(context, delta){
        if(delta.includes('theme')){
            this.setState(()=>{
                return {theme:context.theme}
            })
        }
    }

    visibilityChanged(isVisible){
        this.setState(()=>{
            return {
                isVisible
            }
        })
    }

    timeCheck(time) {
        console.log(time)

        switch(time) {
            case '20:09':
                this.setState((_previousState) => ({
                    isValidTime: true ,
                    url:'https://www.twitch.tv/sendainex',
                    time: time,
                    image: 'https://external-content.duckduckgo.com/iu/?u=http%3A%2F%2Fillusion.scene360.com%2Fwp-content%2Fuploads%2F2015%2F06%2Fkidmograph-01.gif&f=1&nofb=1'
                }))
                break;
            case '20:11':
                this.setState((_previousState) => ({
                    isValidTime: true ,
                    url:'https://www.twitch.tv/sendainex',
                    time: time,
                    image: 'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fcdn.mobilesyrup.com%2Fwp-content%2Fuploads%2F2015%2F04%2FGlitch-Wizard-Gif-1.gif&f=1&nofb=1'
                }))
                break;
            default:
                this.setState((_previousState) => ({
                    isValidTime: false ,
                    url:'https://www.twitch.tv/sendainex',
                    time: time,
                    image: 'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fcdn.mobilesyrup.com%2Fwp-content%2Fuploads%2F2015%2F04%2FGlitch-Wizard-Gif-1.gif&f=1&nofb=1'
                }))
        }
    }

    componentDidMount() {
            this.timer = setInterval(() => this.timeCheck(`${new Date().getHours()}:${new Date().getMinutes() < 10? `0${new Date().getMinutes()}`: new Date().getMinutes()}`), 20000)

        if(this.twitch){
            this.twitch.onAuthorized((auth)=>{
                this.Authentication.setToken(auth.token, auth.userId)
                if(!this.state.finishedLoading){
                    // if the component hasn't finished loading (as in we've not set up after getting a token), let's set it up now.

                    // now we've done the setup for the component, let's set the state to true to force a rerender with the correct data.
                    this.setState(()=>{
                        return {finishedLoading:true}
                    })
                }
            })

            this.twitch.listen('broadcast',(target,contentType,body)=>{
                this.twitch.rig.log(`New PubSub message!\n${target}\n${contentType}\n${body}`)
                // now that you've got a listener, do something with the result... 

                // do something...

            })

            this.twitch.onVisibilityChanged((isVisible,_c)=>{
                this.visibilityChanged(isVisible)
            })

            this.twitch.onContext((context,delta)=>{
                this.contextUpdate(context,delta)
            })
        }
    }

    componentWillUnmount(){
        if(this.twitch){
            this.twitch.unlisten('broadcast', ()=>console.log('successfully unlistened'))
        }
        clearInterval(this.timer)
        this.timer = null
    }
    
    render(){
        if(this.state.finishedLoading && this.state.isVisible && this.state.isValidTime){
            return (
                <div className="App">
                    <QR url={this.state.url} image={this.state.image}></QR>
                </div>
            )
        }else{
            return (
                <div className="App">
                </div>
            )
        }

    }
}