import mongoose from 'mongoose';
import validator from 'validator';
import bcrypt from 'bcrypt';
import JWT from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import otpGenerator from 'otp-generator';

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: [true, "firstName is require"]
    },
    lastName: {
        type: String
    },
    email: {
        type: String,
        required: [true, 'Email is require'],
        unique: true,
        validate: validator.isEmail
    },
    password: {
        type: String,
        required: [true, 'password is require'],
        minlength: [6, "Password length should be greater than 6 character"],
        select: true
    },
    phoneNumber: {
        type: String,
        required: [true, 'Phone Number is require'],
        maxlength: [10, "phone number length should be 10 digit"],
        validate: validator.isMobilePhone
    },
    role: {
        type: String,
        enum: ['jobSeeker', 'employer', 'admin'],
        required: [true, 'Role is required']
    },
    isEmailVerified: {
        type: Boolean,
        default: false
    },
    emailVerificationOTP: String,
    emailVerificationExpiry: Date
}, {
    timestamps: true
});

//Hashing password 
userSchema.pre('save', async function (next) {
    try {
        if (!this.isModified('password')) return next();
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);

    } catch (error) {
        next(error);
    }
});

//Creating JWT
userSchema.methods.createJWT = function () {
    return JWT.sign({ userId: this._id, firstName: this.firstName, email: this.email, role: this.role, isEmailVerified: this.isEmailVerified }, process.env.JWT_SECRET_KEY, { expiresIn: '1h' });
};

userSchema.methods.comparePassword = function (userPassword) {
    return bcrypt.compare(userPassword, this.password);
};

// Generate OTP
userSchema.methods.generateVerificationOTP = function () {
    this.emailVerificationOTP = otpGenerator.generate(6, { digits: true, upperCaseAlphabets: false, lowerCaseAlphabets: false, specialChars: false });

    this.emailVerificationExpiry = Date.now() + 15 * 60 * 1000; // OTP expires in 15 minutes
};

// Send email with OTP
userSchema.methods.sendVerificationEmail = async function () {
    // Create nodemailer transporter
    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USERNAME,
            pass: process.env.EMAIL_PASSWORD
        }
    });

    // Send mail with defined transport object
    let info = await transporter.sendMail({
        from: '"UNOM TEAM" <shabittajs@gmail.com>',
        to: this.email,
        subject: 'Email Verification OTP',
        text: `Your OTP for email verification is: ${this.emailVerificationOTP}`
    });

    console.log('Email sent: %s', info.messageId);
};

// Verify OTP
userSchema.methods.verifyEmailOTP = function (otp) {
    if (otp === this.emailVerificationOTP && this.emailVerificationExpiry > Date.now()) {
        this.isEmailVerified = true;
        console.log('verifyMethodOtp =', this.isEmailVerified)
        return true;
    } else {
        console.log('verifyMethodOtp =', this.isEmailVerified)
        return false;
    }
};

export default mongoose.model('User', userSchema);
