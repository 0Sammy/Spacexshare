const { Schema, model, default: mongoose } = require("mongoose");
const uniqueIdService = require("../services/uniqueIdService.service");
const bcrypt = require("bcrypt");
const crypto = require("crypto");

const accountSchema = new Schema({
  bitcoinAddress: {
    type: String,
    trim: true,
    default: "",
  },
  ethereumAddress: {
    type: String,
    trim: true,
    default: "",
  },
  bitcoinCashAddress: {
    type: String,
    trim: true,
    default: "",
  },
  tronAddress: {
    type: String,
    trim: true,
    default: "",
  },
  bnbBEP2Address: {
    type: String,
    trim: true,
    default: "",
  },
  bnbBEP20Address: {
    type: String,
    trim: true,
    default: "",
  },
  usdtERC20Address: {
    type: String,
    trim: true,
    default: "",
  },
  usdtTRC20Address: {
    type: String,
    trim: true,
    default: "",
  },
});

referralSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
});

//Remove the ID as unique
const userSchema = new Schema(
  {
    userId: {
      type: String,
      trim: true,
      unique: true,
    },
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    phoneNumber: {
      type: String,
    },
    country: {
      type: String,
    },
    address: {
      type: String,
    },
    state: {
      type: String,
    },
    postalCode: {
      type: String,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      required: true,
      enum: ["user", "admin"],
      default: "user",
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    account: {
      type: accountSchema,
      default: {},
    },
    hasDeposited: {
      type: Boolean,
      default: false,
    },
    referrals: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    referredBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    kyc: {
      fullName: String,
      address: String,
      city: String,
      state: String,
      country: String,
      gender: String,
      governmentIssuedId: {
        idType: String,
        pictures: [String],
      },
      isVerified: {
        type: Boolean,
        default: false,
      },
      awaitingVerification: {
        type: Boolean,
      },
      submittedAt: {
        type: Date,
        default: Date.now(),
      },
    },
    passwordResetExpires: Date,
    passwordResetToken: String,
  },
  {
    timestamps: true,
    toObject: {
      virtuals: true,
    },
    toJSON: {
      virtuals: true,
    },
  },
);

userSchema.virtual("transactions", {
  ref: "Transaction",
  localField: "_id",
  foreignField: "user",
});

// Generate a userID
userSchema.pre("save", async function (next) {
  if (this.isNew) {
    this.userId = await uniqueIdService.generateUniqueUserId(this.constructor);
  }
  next();
});

/**
 * hash user's password on save
 */
userSchema.pre("save", async function (next) {
  if (this.isNew || this.isModified("password")) {
    // hashing users password
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(this.password, salt);

    // saving it to their user data object
    this.password = hash;
    next();
  }
});

userSchema.methods.isPasswordCorrect = async function (
  enteredPassword,
  userPassword,
) {
  return await bcrypt.compare(enteredPassword, userPassword);
};

userSchema.methods.genPasswordResetToken = async function () {
  const token = crypto.randomBytes(20).toString("hex");

  // hash token
  const hash = bcrypt.hash(token, 5);

  this.passwordResetToken = hash;
  this.passwordResetExpires = Date.now() + 1000 * 60 * 10;

  await this.save();

  return token;
};

const User = model("User", userSchema);

module.exports = User;
