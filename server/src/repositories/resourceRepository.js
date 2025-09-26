import Resource from "../models/Resource.js";

export const createResource = (payload) => Resource.create(payload);

export const listActiveResources = () => Resource.find({ isActive: true }).sort({ name: 1 });

export const findResourceById = (id) => Resource.findById(id);
