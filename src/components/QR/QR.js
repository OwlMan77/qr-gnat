
    import React from 'react'
    import { QRImage } from 'react-qrbtf'

    import './QR.css'
     
    export class QR extends React.Component {
     
        constructor(props) {
            super(props)
            this.getRandomNumber = this.getRandomNumber.bind(this)
        }
         getRandomNumber() {
            return Math.floor(Math.random() * 101)
        }
    
        render() {
            const randomNumber1 = this.getRandomNumber()
            const randomNumber2 = this.getRandomNumber()
            return (            
            <div className="QR" style={{
                left: `${randomNumber1 > 50 ? `calc(${randomNumber1}% - 75px)` : `${randomNumber1}%`}`,
                top: `${randomNumber2 > 50 ? `calc(${randomNumber2}% - 75px)` : `${randomNumber2}%`}`
            }}>
            <QRImage posType="round" size={100} darkColor="#7C0A02" image={this.props.image} value={this.props.url} level="M"/> </div>)
        }
    }