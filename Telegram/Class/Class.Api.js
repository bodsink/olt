const axios = require('axios');



class Api {

    Paket = async (id) => {
        try {

            const headers = {
                'Authorization': process.env.token
               // 'Content-Type': 'application/json',
            }
            return await axios.post(process.env.api + '/layanan/produk', id, {
                headers: headers
            })
                .then(content => content.data)
                .catch(error => error)

        }catch (error) {
            //throw new Error('Unable to get a token.')
            console.log(error)
        }
    }

    SN = async (sn) => {
        try {

            const headers = {
                'Authorization': process.env.token
               // 'Content-Type': 'application/json',
            }
            return await axios.get(process.env.api + '/olt/'+process.env.olt+'/onu/' + sn, {
                headers: headers
            })
                .then(content => content.data)
                .catch(error => error)

        }catch (error) {
            //throw new Error('Unable to get a token.')
            console.log(error)
        }
    }


    GponState = async () => {
        try {

            const headers = {
                'Authorization': process.env.token
               // 'Content-Type': 'application/json',
            }
            return await axios.get(process.env.api + '/olt/'+process.env.olt+'/state', {
                headers: headers
            })
                .then(content => content.data)
                .catch(error => error)

        }catch (error) {
            //throw new Error('Unable to get a token.')
            console.log(error)
        }
    }



}




module.exports = new Api();