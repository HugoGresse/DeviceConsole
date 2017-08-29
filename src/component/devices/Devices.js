import React, { Component } from 'react';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import platform from 'platform';
import { Row, Col, Button, Input, Icon, notification } from 'antd';

import { getDevices, getNotification, isRegistered, devicesActions } from '../../core/devices';
import { getAuth } from '../../core/auth';

import DeviceList from './DeviceList'


export class Devices extends Component {


    constructor() {
        super();

        this.state = {
            deviceName: this.getDeviceName()
        };

        this.registerCurrentDevice = this.registerCurrentDevice.bind(this)
        this.onRegisteNameChange = this.onRegisteNameChange.bind(this)
        this.openNotificationLink = this.openNotificationLink.bind(this)
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
            name += ' ' + platform.os
        }
        return name
    }

    componentWillMount() {
        this.props.loadDevices(this.props.auth.id)
        this.props.listenNotification()
        if (this.props.auth.deviceUuid) {
            // If the device is already registered, monitor notification token refresh
            this.props.monitorTokenRefresh(this.props.auth.id, this.props.deviceUuid)
        }
    }

    componentWillUnmount() {
        this.props.unloadDevices()
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.notification != nextProps.notification) {

            const btn = (
                <Button type="primary" size="small" onClick={this.openNotificationLink}>
                    Open
                </Button>
            );

            notification.open({
                message: nextProps.notification.title,
                description: nextProps.notification.body,
                icon: <img src={nextProps.notification.icon} />,
                btn,
                duration: 15
            });
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

    openNotificationLink() {
        window.open(this.props.notification.click_action, '_blank');
    }

    render() {
        const register = !this.props.isRegistered &&
            <Row>
                <Col span={16}>
                    <Input placeholder="" value={this.state.deviceName} onChange={this.onRegisteNameChange} />
                </Col>
                <Col span={8}>
                    <Button type="primary" onClick={this.registerCurrentDevice}>
                        Register
                    </Button>
                </Col>
            </Row >

        return (
            <Row>
                <Col span={24}>
                    <h1>Devices</h1>
                    {register}
                    <br />
                    <DeviceList devices={this.props.devices} />
                </Col>
            </Row>
        );
    }
}


//=====================================
//  CONNECT
//-------------------------------------

const mapStateToProps = createSelector(
    getDevices,
    getAuth,
    getNotification,
    isRegistered,
    (devices, auth, notification, isRegistered) => ({
        devices,
        auth,
        notification,
        isRegistered
    })
);

const mapDispatchToProps = Object.assign(
    {},
    devicesActions
);

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Devices);
