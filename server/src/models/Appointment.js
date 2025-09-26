import mongoose from "mongoose";

import { APPOINTMENT_STATUS_VALUES } from "../../../shared/constants/appointmentStatus.js";

const { Schema } = mongoose;

const appointmentSchema = new Schema(
	{
		practitioner: {
			type: Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		patient: {
			type: Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		treatmentId: {
			type: String,
			trim: true,
		},
		resource: {
			type: Schema.Types.ObjectId,
			ref: "Resource",
		},
		title: {
			type: String,
			required: true,
			trim: true,
		},
		description: {
			type: String,
			trim: true,
		},
		startTime: {
			type: Date,
			required: true,
		},
		endTime: {
			type: Date,
			required: true,
		},
		status: {
			type: String,
			enum: APPOINTMENT_STATUS_VALUES,
			default: "scheduled",
		},
		notes: {
			type: String,
			trim: true,
		},
		createdBy: {
			type: Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
	},
	{ timestamps: true },
);

appointmentSchema.index({ practitioner: 1, startTime: 1 });
appointmentSchema.index({ patient: 1, startTime: 1 });
appointmentSchema.index({ status: 1 });

appointmentSchema.pre("validate", function ensureEndAfterStart(next) {
	if (this.startTime && this.endTime && this.endTime <= this.startTime) {
		this.invalidate("endTime", "End time must be after start time");
	}
	next();
});

const Appointment =
	mongoose.models.Appointment || mongoose.model("Appointment", appointmentSchema);

export default Appointment;
