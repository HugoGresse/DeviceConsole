import React, { Component } from 'react';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import { Row, Col, Button, notification } from 'antd';

import { getDevices, getNotification, isRegistered, devicesActions } from '../../core/devices';
import { getAuth } from '../../core/auth';

import DeviceList from './DeviceList'
import Register from './Register'


export class Devices extends Component {

    constructor() {
        super();

        this.openNotificationLink = this.openNotificationLink.bind(this)
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
        if (this.props.notification !== nextProps.notification) {
            const btn = (
                <Button type="primary" size="small" onClick={this.openNotificationLink}>
                    Open
                </Button>
            );

            notification.open({
                message: nextProps.notification.title,
                description: nextProps.notification.body,
                icon: <img src={nextProps.notification.icon} alt="" />,
                btn,
                duration: 15
            });
        }

    }

    openNotificationLink() {
        window.open(this.props.notification.click_action, '_blank');
    }

    render() {
        return (
            <Row>
                <Col span={24}>
                    <h1>Devices</h1>
                    <Register
                        auth={this.props.auth}
                        />
                    <br />
                    <DeviceList
                        devices={this.props.devices}
                        sendNotification={this.props.sendNotification}
                    />
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
