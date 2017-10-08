import React, {Component} from 'react'
import {Row, Col, Button, Input, Popconfirm} from 'antd'
import Time from 'react-time'
import InlineEdit from 'react-edit-inline'


class DeviceItem extends Component {

    constructor() {
        super();
        this.state = {
            inputMessage: ''
        }
        this.sendNotification = this.sendNotification.bind(this)
        this.onNameChange = this.onNameChange.bind(this)
        this.onMessageChange = this.onMessageChange.bind(this)
        this.onDeleteClick = this.onDeleteClick.bind(this)
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevProps.device.sendingNotification && !this.props.device.sendingNotification) {
            this.setState({
                inputMessage: ''
            })
        }
    }

    sendNotification(value) {
        // Check empty string
        if (!this.state.inputMessage || /^\s*$/.test(this.state.inputMessage)) {
            return;
        }
        this.props.sendNotification(this.props.device, this.state.inputMessage)
    }

    onNameChange(changes) {
        this.props.setDeviceName(this.props.device.key, changes.name)
    }

    onMessageChange(event) {
        this.setState({inputMessage: event.target.value})
    }

    onDeleteClick(event) {
        this.props.deleteDevice(this.props.device)
    }

    render() {
        const nameSuffix = (this.props.device.itIsMe) ? '(me)' : ''
        const loading = this.props.device.sendingNotification

        return (
            <Row className="data-row">
                <Col xs={24} sm={10}>
                    <InlineEdit
                        validate={this.customValidateText}
                        activeClassName="editing"
                        text={this.props.device.name}
                        paramName="name"
                        change={this.onNameChange}
                    />
                    {nameSuffix}
                </Col>
                <Col xs={24} sm={4}>
                    <Time value={this.props.device.updatedAt} titleFormat="YYYY/MM/DD HH:mm" relative/>
                </Col>
                <Col xs={24} sm={10}>
                    <Row>
                        <Col xs={24} sm={16} className="inputWithButton">
                            <Input
                                placeholder="Send a link"
                                disabled={loading}
                                addonAfter={<Button loading={loading} icon='right-circle'
                                                    onClick={this.sendNotification}/>}
                                value={this.state.inputMessage}
                                onPressEnter={this.sendNotification}
                                onChange={this.onMessageChange}/>
                        </Col>
                        <Col xs={24} sm={{span: 2, offset: 6}} className="topMarginSm">
                            <Popconfirm title="Are you sure to remove this device?"
                                        onConfirm={this.onDeleteClick}
                                        okText="Delete"
                                        cancelText="Cancel">
                                <Button type="primary" shape="circle" icon="delete"/>
                            </Popconfirm>
                        </Col>
                    </Row>
                </Col>
            </Row>
        );
    }
}

export default DeviceItem;
