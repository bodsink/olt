const axios = require('axios');
const moment = require('moment-timezone');
moment.locale('id');

const { Settings } = require('../Models/Model.Root');

async function Setting() {
    try {
        const data = await Settings.findOne({}).then(data => data);
        return data;

    } catch (error) {
        console.log(error)
        return next(
            createError(500, error));
    }
}

class Acs {
    CekOnt = async (id) => {
        try {

            const set = await Setting().then(data => data);
            const headers = {
                'CF-Access-Client-Id': set.Acs.ClientId,
                'CF-Access-Client-Secret': set.Acs.ClientSecret,
                'Content-Type': 'application/json',
            }
            return await axios.get(set.Acs.url + 'devices/?query={' + id + '}', {
                headers: headers
            })
                .then(content => content.data)
                .catch(error => error)

        } catch (error) {
            //throw new Error('Unable to get a token.')
            console.log(error)
        }
    }

    RebootOnt = async (id) => {
        try {

            const set = await Setting().then(data => data);
            let reboot = {
                "name": "reboot"
            };
            const headers = {
                'CF-Access-Client-Id': set.Acs.ClientId,
                'CF-Access-Client-Secret': set.Acs.ClientSecret,
                'Content-Type': 'application/json',
            }
            return await axios.post(set.Acs.url + 'devices/' + id + '/tasks?timeout=30&connection_request', reboot, {
                headers: headers
            })
                .then(content => content.data)
                .catch(error => error)

        } catch (error) {
            //throw new Error('Unable to get a token.')
            console.log(error)
        }
    }

    GantiPassWifi = async (id1, id2) => {
        try {

            const set = await Setting().then(data => data);

            let form = {
                "name": "setParameterValues",
                "parameterValues": [
                    [
                        "InternetGatewayDevice.LANDevice.1.WLANConfiguration.1.KeyPassphrase",
                        id2
                    ]
                ]
            }

            const headers = {
                'CF-Access-Client-Id': set.Acs.ClientId,
                'CF-Access-Client-Secret': set.Acs.ClientSecret,
                'Content-Type': 'application/json',
            }
            return await axios.post(set.Acs.url + 'devices/' + id1 + '/tasks?timeout=30&connection_request', form, {
                headers: headers
            })
                .then(content => content.data)
                .catch(error => error)

        } catch (error) {
            //throw new Error('Unable to get a token.')
            console.log(error)
        }
    }

    AddObject = async (id,wan) => {
        try {

            const set = await Setting().then(data => data);

            let form = {
                "name": "addObject",
                "objectName": wan
            }

            const headers = {
                'CF-Access-Client-Id': set.Acs.ClientId,
                'CF-Access-Client-Secret': set.Acs.ClientSecret,
                'Content-Type': 'application/json',
            }
            return await axios.post(set.Acs.url + 'devices/' + id + '/tasks?timeout=30&connection_request', form, {
                headers: headers
            })
                .then(content => content.data)
                .catch(error => error)

        } catch (error) {
            //throw new Error('Unable to get a token.')
            console.log(error)
        }
    }

    setParamater = async (id,form) => {
        try {

            const set = await Setting().then(data => data);

           
            const headers = {
                'CF-Access-Client-Id': set.Acs.ClientId,
                'CF-Access-Client-Secret': set.Acs.ClientSecret,
                'Content-Type': 'application/json',
            }
            return await axios.post(set.Acs.url + 'devices/' + id + '/tasks?timeout=30&connection_request', form, {
                headers: headers
            })
                .then(content => content.data)
                .catch(error => error)

        } catch (error) {
            //throw new Error('Unable to get a token.')
            console.log(error)
        }
    }

    SetTags = async (id,tags) => {
        try {

            const set = await Setting().then(data => data);
           
            const headers = {
                'CF-Access-Client-Id': set.Acs.ClientId,
                'CF-Access-Client-Secret': set.Acs.ClientSecret,
                'Content-Type': 'application/json',
            }
            return await axios.post(set.Acs.url + 'devices/' + id + '/tags/' + tags, {
                headers: headers
            })
                .then(content => content.data)
                .catch(error => error)

        } catch (error) {
            //throw new Error('Unable to get a token.')
            console.log(error)
        }
    }

    Summon = async (id) => {
        try {

            const set = await Setting().then(data => data);
            let refresh = {
                "name": "refreshObject",
                "objectName": ""
            };
            const headers = {
                'CF-Access-Client-Id': set.Acs.ClientId,
                'CF-Access-Client-Secret': set.Acs.ClientSecret,
                'Content-Type': 'application/json',
            }
            return await axios.post(set.Acs.url + 'devices/' + id + '/tasks?timeout=100&connection_request', refresh, {
                headers: headers
            })
                .then(content => content.data)
                .catch(error => error)

        } catch (error) {
            //throw new Error('Unable to get a token.')
            console.log(error)
        }
    }
}


module.exports = new Acs();