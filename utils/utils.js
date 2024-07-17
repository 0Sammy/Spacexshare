const referralCodes = require('referral-codes')

class Util {

    generateUserId() {
        const result = referralCodes.generate({
            length: 10,
            count: 1
        })

        return result[0]
    }

}

module.exports = new Util()