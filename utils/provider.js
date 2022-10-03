const request = require('request')


const provider = (provider, callback) => {
    const url = 'https://cyber8-dev-gwapi.edsolabs.com/uaa-service/public-api/accounts/config?provider=' + provider + '&action=sign-in&callback_url=https:%2F%2Fcyber8-dev-account.edsolabs.com';
    request({ url: url, json: true }, (error, response) => {
        console.log(response.body)
        if (error) {
            callback('Unable to connect to server')
        } else if (response.body.data.length == 0) {
            callback('Provider not found')
        } else {
            // response.body.data.map(item => (
            //     {
            //         redirect_uri: item.redirect_uri,
            //         state: item.state
            //     }
            // ))
            callback(undefined, 
                response.body.data.map(item => (
                    {
                        redirect_uri: item.redirect_uri,
                        state: item.state
                    }
                ))
            )
        }
    })
}

module.exports = provider




