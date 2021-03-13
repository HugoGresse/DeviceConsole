import React, { Component } from 'react';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import { Row, Col, Button, notification } from 'antd';

import { getDevices, getNotification, isRegistered, getError, devicesActions } from '../../core/devices';
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

        if(this.props.error !== nextProps.error) {
            notification.open({
                message: 'Error: ' + nextProps.error,
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
                        setDeviceName={this.props.setDeviceName}
                        deleteDevice={this.props.deleteDevice}
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
    getError,
    (devices, auth, notification, isRegistered, error) => ({
        devices,
        auth,
        notification,
        isRegistered,
        error
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
