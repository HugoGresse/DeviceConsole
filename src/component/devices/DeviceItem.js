import React, { Component } from 'react';
import { Row, Col, Button, Input, Icon } from 'antd';
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

    sendNotification(value) {
        this.props.sendNotification(this.props.device, this.state.inputMessage)
    }

    onMessageChange(event) {
        this.setState({inputMessage: event.target.value})
    }

    render() {
        const name = this.props.device.name + ((this.props.device.itIsMe) ? '(me)' : '');
        return (
            <Row style={{ marginTop: '16px' }}>
                <Col xs={24} md={10}>
                    {name}
                </Col>
                <Col xs={24} md={4}>
                    <Time value={this.props.device.updatedAt} titleFormat="YYYY/MM/DD HH:mm" relative />
                </Col>
                <Col xs={24}  md={10}>
                    <Row >
                        <Col span={16}>
                            <Input
                            placeholder="Send notification"
                            addonAfter={<Icon type="right-circle" onClick={this.sendNotification} />}
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
