import mongoose from "mongoose";

const userAccountModel = new mongoose.Schema({
    _id: {
        type: String,
        required: true,
        alias: 'login'
    },
    password: {
        type: String,
        required: true,
    },
    fullName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    country: {
        type: String,
        required: true,
    },
    birthday: {
        type: Date,
        required: true,
    },
    dateCreated: {
        type: Date,
        default: Date.now,
    },
    role:{
        type: String,
        enum: ['user', 'admin'],
        default: 'user',
    },
    blocked: {
        // Block a user
        // await User.updateOne({ _id: userId }, { blocked: true });
        type: Boolean,
        default: false
    }
}, {
    versionKey: false,
    toJSON: {
        transform(doc, ret) {
            ret.id = ret._id;
            delete ret._id;

            // Format dateCreated
            if (ret.dateCreated) {
                const isoString = ret.dateCreated.toISOString(); // e.g. "2025-06-23T12:00:00.000Z"
                const [date, timeWithMs] = isoString.split('T');
                const time = timeWithMs.slice(0, 8); // "12:00:00"

                ret.dateCreated = `${date} ${time}`;
            }
            if (ret.birthday) {
                const birth = new Date(ret.birthday);
                // Optional: format birthday as YYYY-MM-DD only
                ret.birthday = birth.toISOString().split('T')[0];
            }
        }
    }
});

export default mongoose.model("UserAccount", userAccountModel, 'usersAccount');
