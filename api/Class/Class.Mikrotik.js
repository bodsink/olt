const axios = require('axios');

const { Settings } = require('../Models/Model.Root');

class Mikrotik {
    addGroup = async (id) => {
        try {
            let Setting = await Settings.findOne({}).then(data => data);

            const headers = {
                'Authorization': Setting.Radius.user
            }

            return await axios.post(Setting.Radius.hostname + 'user-manager/user/group/add', id, {
                headers: headers
            })
                .then(content => content.data)
                .catch(error => error)



        }
        catch (error) {
            //throw new Error('Unable to get a token.')
            console.log(error)
        }
    }

    addBras = async (id) => {
        try {
            let Setting = await Settings.findOne({}).then(data => data);

            const headers = {
                'Authorization': Setting.Radius.user
            }

            return await axios.post(Setting.Radius.hostname + 'user-manager/user/add', id, {
                headers: headers
            })
                .then(content => content.data)
                .catch(error => error)

        }
        catch (error) {
            //throw new Error('Unable to get a token.')
            console.log(error)
        }
    }

    findBras = async (id) => {
        try {
            let Setting = await Settings.findOne({}).then(data => data);

            const headers = {
                'Authorization': Setting.Radius.user
            }

            return await axios.get(Setting.Radius.hostname + 'user-manager/user?name=' +id, {
                headers: headers
            })
                .then(content => content.data)
                .catch(error => error)

        }
        catch (error) {
            //throw new Error('Unable to get a token.')
            console.log(error)
        }
    }

}

module.exports = new Mikrotik();