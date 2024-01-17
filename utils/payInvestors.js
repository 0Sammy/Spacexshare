const Email = require("../utils/mail.util");
const Transaction = require("../models/transaction.model");
const transactionService = require("../services/transaction.service");
const userService = require("../services/user.service");
const {
  starterPercent,
  regularPercent,
  proPercent,
  elitePercent,
} = require("../config");

const _getPayoutAmount = (plan, amount) => {
  switch (plan) {
    case "starter":
      return (amount + starterPercent * amount).toFixed(2);
      break;
    case "regular":
      return (amount + regularPercent * amount).toFixed(2);
      break;
    case "pro":
      return (amount + proPercent * amount).toFixed(2);
      break;
    case "elite":
      return (amount + elitePercent * amount).toFixed(2);
      break;
    default:
      return 0;
      break;
  }
};

const payInvestors = async () => {
  try {
    // Fetch all investments where there status is active and have not been fulfilled
    const pendingInvestments = await Transaction.find({
      $and: [
        { type: "investment" },
        { isFulfilled: { $ne: true } },
        { expiresAt: { $lte: Date.now() } },
      ],
    });

    // console.log(pendingInvestments)

    await pendingInvestments.forEach(async (investment) => {
      try {
        const amount = _getPayoutAmount(investment.plan, investment.amount);

        const earningData = {
          user: investment.user._id,
          type: "earning",
          amount,
          status: "successful",
          plan: investment.plan,
        };

        await transactionService.create(earningData);

        // Update investment
        await Transaction.findByIdAndUpdate(
          investment._id,
          { isFulfilled: true, active: false },
          {
            upsert: true,
            new: true,
          },
        );
        //Client Notification
        const user = await userService.findOne({ _id: earningData.user._id });
        new Email(user, ".", earningData.amount).sendPayout();

      } catch (e) {
        console.log(e);
      }
    });
    console.log(
      `Investors last paid at ${new Intl.DateTimeFormat("en-US", {
        dateStyle: "full",
        timeStyle: "long",
      }).format(Date.now())}`,
    );
  } catch (error) {
    console.error(error);
  }
};

module.exports = payInvestors;
