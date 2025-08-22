import mongoose from 'mongoose';

const sentenceSchema = new mongoose.Schema({
    level: {
        type: String,
        required: true,
        enum: ['A1', 'A2', 'B1', 'B2'] },
    _id: {
        type: String,
        required: true,
        alias: 'en'
    },
    am: {
        type: String,
        required: true
    },
    ru: {
        type: String,
        required: true
    },
    hw: {
        type: String,
        required: true
    }

},{
    versionKey: false,
    toJSON: {
        transform(doc, ret) {
            ret.en = ret._id;
            delete ret._id;
        }
    }
    }
);


export default mongoose.model('sentences', sentenceSchema, 'sentences')
