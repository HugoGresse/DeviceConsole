import React, { Component } from 'react';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import platform from 'platform';
import { Row, Col, Button, Input } from 'antd';

import { getDevices, devicesActions } from '../../core/devices';
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
    }

    getDeviceName() {
        let name = platform.name;
        if (platform.manufacturer) {
            name += ' ' + platform.manufacturer
        }
        if (platform.product) {
            name += ' ' + platform.product
        }
        return name
    }

    componentWillMount() {
        this.props.loadDevices(this.props.auth.id)
    }

    componentWillUnmount() {
        this.props.unloadDevices()
    }

    registerCurrentDevice() {
        this.props.createDevice(this.props.auth.id, this.state.deviceName,)
    }

    onRegisteNameChange(event) {
        this.setState({
            deviceName : event.target.value
        })
    }

    render() {
        let register = "";

        register =
            <Row>
                <Col span={6}>
                    <Input placeholder="" value={this.state.deviceName} onChange={this.onRegisteNameChange}/>
                </Col>
                <Col span={6}>
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
    (devices, auth) => ({
        devices,
        auth
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
