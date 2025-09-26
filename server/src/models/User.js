import mongoose from "mongoose";

const { Schema } = mongoose;

const userSchema = new Schema(
	{
		name: {
			type: String,
			required: true,
			trim: true,
		},
		email: {
			type: String,
			required: true,
			unique: true,
			lowercase: true,
			trim: true,
		},
		password: {
			type: String,
			required: true,
			minlength: 6,
		},
		role: {
			type: String,
			enum: ["practitioner", "patient", "admin"],
			default: "patient",
		},
		practitionerId: {
			type: Schema.Types.ObjectId,
			ref: "User",
			default: null,
		},
		isActive: {
			type: Boolean,
			default: true,
		},
	},
	{
		timestamps: true,
	},
);


userSchema.method("toSafeObject", function toSafeObject() {
	const { password: _password, __v: _version, ...rest } = this.toObject();
	return rest;
});

userSchema.set("toJSON", {
	transform: (_doc, ret) => {
		delete ret.password;
		delete ret.__v;
		return ret;
	},
});

const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;
