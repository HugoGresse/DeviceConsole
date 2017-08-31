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

    sendNotification(value) {
        this.props.sendNotification(this.props.device, this.state.inputMessage)
    }

    onMessageChange(event) {
        this.setState({inputMessage: event.target.value})
    }

    render() {
        const name = this.props.device.name + ((this.props.device.itIsMe) ? '(me)' : '');
        return (
            <Row style={{ marginTop: '10px' }}>
                <Col span={10}>
                    {name}
                </Col>
                <Col span={4}>
                    <Time value={this.props.device.updatedAt} titleFormat="YYYY/MM/DD HH:mm" relative />
                </Col>
                <Col span={10}>
                    <Row style={{ marginTop: '-10px' }} >
                        <Col span={16}>
                            <Input
                            placeholder=""
                            onPressEnter={this.sendNotification}
                            value={this.state.inputMessage}
                            onChange={this.onMessageChange} />
                        </Col>
                        <Col span={8}>
                            <Button
                                onClick={this.sendNotification}
                                type="primary" icon="right-square">
                                Send
                            </Button>
                        </Col>
                    </Row >
                </Col>
            </Row>
        );
    }
}

export default DeviceItem;