import mongoose from "mongoose";

const { Schema } = mongoose;

const resourceSchema = new Schema(
	{
		name: {
			type: String,
			required: true,
			trim: true,
		},
		type: {
			type: String,
			required: true,
			enum: ["therapy_room", "equipment", "therapist_assistant", "other"],
			default: "therapy_room",
		},
		location: {
			type: String,
			trim: true,
		},
		description: {
			type: String,
			trim: true,
		},
		capacity: {
			type: Number,
			min: 1,
			default: 1,
		},
		isActive: {
			type: Boolean,
			default: true,
		},
		availability: {
			type: [
				new Schema(
					{
						dayOfWeek: { type: Number, min: 0, max: 6 },
						startTime: { type: String },
						endTime: { type: String },
					},
					{ _id: false },
				),
			],
			default: [],
		},
	},
	{ timestamps: true },
);

resourceSchema.index({ name: 1 }, { unique: true });

const Resource = mongoose.models.Resource || mongoose.model("Resource", resourceSchema);

export default Resource;
