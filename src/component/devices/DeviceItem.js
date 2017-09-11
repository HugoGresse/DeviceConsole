import React, { Component } from 'react';
import { Row, Col, Button, Input } from 'antd';
import Time from 'react-time'


class DeviceItem extends Component {

    constructor() {
        super();
        this.state = {
            inputMessage: ''
        }
        this.sendNotification = this.sendNotification.bind(this);
        this.onMessageChange = this.onMessageChange.bind(this);
    }


    componentDidUpdate(prevProps, prevState) {
        if (prevProps.device.sendingNotification && !this.props.device.sendingNotification) {
            this.setState({
                inputMessage : ''
            })
        }
    }


    sendNotification(value) {
        // Check empty string
        if(!this.state.inputMessage || /^\s*$/.test(this.state.inputMessage) ){
            return;
        }
        this.props.sendNotification(this.props.device, this.state.inputMessage)
    }

    onMessageChange(event) {
        this.setState({ inputMessage: event.target.value })
    }

    render() {
        const name = this.props.device.name + ((this.props.device.itIsMe) ? '(me)' : '')
        const loading = this.props.device.sendingNotification

        return (
            <Row style={{ marginTop: '16px' }}>
                <Col xs={24} sm={10}>
                    {name}
                </Col>
                <Col xs={24} sm={4}>
                    <Time value={this.props.device.updatedAt} titleFormat="YYYY/MM/DD HH:mm" relative />
                </Col>
                <Col xs={24} sm={10}>
                    <Row>
                        <Col xs={24} sm={16} className="inputWithButton">
                            <Input
                                placeholder="Send notification"
                                disabled={loading}
                                addonAfter={<Button loading={loading} icon='right-circle' onClick={this.sendNotification} />}
                                value={this.state.inputMessage}
                                onPressEnter={this.sendNotification}
                                onChange={this.onMessageChange} />
                        </Col>
                    </Row >
                </Col>
            </Row>
        );
    }
}

export default DeviceItem;
