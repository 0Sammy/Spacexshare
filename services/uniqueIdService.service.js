// services/uniqueIdService.js
const referralCodes = require("referral-codes");

class UniqueIdService {
  async generateUniqueUserId(User) {
    let userId;
    let isUnique = false;

    while (!isUnique) {
      const result = referralCodes.generate({
        prefix: "spacex-",
        length: 6,
        count: 1,
      });

      userId = result[0];
      const user = await User.findOne({ userId });

      if (!user) {
        isUnique = true;
      }
    }

    return userId;
  }
}

module.exports = new UniqueIdService();
