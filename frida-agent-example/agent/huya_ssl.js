function ssl_ping() {
    Java.perform(function () {

        const connection = Java.use('javax.net.ssl.HttpsURLConnection');
        connection.setHostnameVerifier.implementation = function () {
            console.log(arguments);
            return true
        }

    })
}


function main() {
    ssl_ping();
}


setImmediate(main)