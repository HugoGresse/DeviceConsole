import React, { Component } from 'react';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import platform from 'platform';
import { Row, Col, Modal, Input, Icon } from 'antd';

import { isRegistered, getCurrentDevice, devicesActions } from '../../core/devices';
import { getAuth } from '../../core/auth';

export class Register extends Component {

    constructor() {
        super();

        this.state = {
            deviceName: this.getDeviceName(),
            modal: null
        };

        this.registerCurrentDevice = this.registerCurrentDevice.bind(this)
        this.onRegisteNameChange = this.onRegisteNameChange.bind(this)
        this.getModalContent = this.getModalContent.bind(this)
    }

    getDeviceName() {
        let name = platform.name;
        if (platform.manufacturer) {
            name += ' ' + platform.manufacturer
        }
        if (platform.product) {
            name += ' ' + platform.product
        }
        if (platform.os) {
            if (platform.os.toString().startsWith('OS X')) {
                name += ' OS X'
            } else {
                name += ' ' + platform.os
            }
        }
        return name
    }

    componentDidUpdate(prevProps, prevState) {
        if (this.props.device && !this.props.device.deviceRegistrationToken && !prevState.modal && !this.state.modal) {
            this.setState({
                modal: Modal.info({
                    title: 'Your device is not fully registered',
                    okText: 'Discard',
                    content: (
                        <div>
                            {this.getModalContent()}
                        </div>
                    ),
                    onOk() { },
                })
            })
        } else if (prevState.modal && this.props.device.deviceRegistrationToken && this.state.modal) {
            prevState.modal.destroy()
            this.setState({
                modal: null
            })
        }
    }

    registerCurrentDevice() {
        this.props.createDevice(this.props.auth.id, this.state.deviceName, platform.os.toString())
    }

    onRegisteNameChange(event) {
        this.setState({
            deviceName: event.target.value
        })
    }

    getModalContent() {
        if (Notification.permission !== "granted") {
            this.props.requestNotificationPermission(this.props.auth.id)
            return <p>You need to accept browser notifcation request. Asking for it now.</p>
        } else {
            this.props.getAndUpdateToken(this.props.auth.id)
            return <p>Notification granted, retrieving your token now...<br /> (this popup will close automatically)</p>
        }
    }

    render() {
        const register = !this.props.isRegistered &&
            <Row>
                <Col span={24}>
                    Register this device
                </Col>
                <Col xs={24} sm={12}>
                    <Input
                        placeholder=""
                        addonAfter={<Icon type="right-circle" onClick={this.registerCurrentDevice} />}
                        value={this.state.deviceName}
                        onChange={this.onRegisteNameChange}
                        onPressEnter={this.registerCurrentDevice} />
                </Col>
            </Row>

        return (
            <div style={{marginTop: "16px"}}>
                {register}
            </div>
        );
    }
}


const mapStateToProps = createSelector(
    getAuth,
    isRegistered,
    getCurrentDevice,
    (auth, isRegistered, device) => ({
        auth,
        isRegistered,
        device
    })
);


const mapDispatchToProps = Object.assign(
    {},
    devicesActions
);

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Register);
