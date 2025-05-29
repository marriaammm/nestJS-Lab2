import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User {
    @Prop({ required: true, unique: true })
    email!: string;

    @Prop({ required: true, minlength: 8 })
    password!: string;

    @Prop()
    fullName!: string;

    @Prop({ min: 16, max: 60 })
    age!: number;

    @Prop({
        match: /^01\d{9}$/,
    })
    mobileNumber!: string;

    @Prop({ enum: ['admin', 'normal'], default: 'normal' })
    role!: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
