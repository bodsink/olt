const createError = require('http-errors');
const util = require('util');
const exec = util.promisify(require('child_process').exec);
const { Telnet } = require('telnet-client');

const { OLT } = require('../Models/Model.Infra');


class Olt {

    Conn = async (hostname, id) => {
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
            return await connection.send(id);

        }
        catch (error) {
            throw new Error(error)

        }
    }

    State = async (hostname) => {
        try {
          
            let olt = await OLT.findOne({
                hostname: hostname
            }).then(data => data);

            if (!olt) {
                throw new Error('Olt tidak ditemukan')
            }

            let { stdout, stderr } = await exec("./Telnet/State.sh " +  olt.ip + ' '  + olt.telnet_port + ' ' + olt.telnet_user + ' ' + olt.telnet_pass  );
            if (stderr) {
                return stderr
            }

            if (stdout) {
                return stdout
            }

        }
        catch (error) {
            throw new Error(error)

        }
    }

    Clear = async (hostname) => {
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
            return await connection.send('clear tcp line 66 \n clear tcp line 67 \n clear tcp line 68 \n clear tcp line 69 \n clear tcp line 70 \n clear tcp line 71');

        }
        catch (error) {
            throw new Error(error)

        }
    }


}

module.exports = new Olt();