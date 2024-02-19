const createError = require('http-errors');
const { Telnet } = require('telnet-client');

const { OLT } = require('../Models/Model.Infra');


class Olt {
    
    Conn = async (hostname,id) => {
        try {
            const connection = new Telnet();

            let olt = await OLT.findOne({
                hostname: hostname
            }).then(data => data);
    
            if (!olt) {
                throw new Error('Olt tidak ditemukan')
            }
    
            const params = {
                host: olt.ip,
                port: olt.telnet_port,
                shellPrompt: olt.hostname + '#', // hostname kemudian karakter setelah hostname
                timeout: 3500,
                loginPrompt: 'Username:',
                passwordPrompt: 'Password:',
                username: olt.telnet_user,
                password: olt.telnet_pass,
                failedLoginMatch: '%Error 20209: No username or bad password',
                pageSeparator: ' - '
            }
    
    
            await connection.connect(params);
            return  await connection.shell(id);

        }
        catch (error) {
            throw new Error(error)
            console.log(error)
           // return error
           
        }
    }


}

module.exports = new Olt();