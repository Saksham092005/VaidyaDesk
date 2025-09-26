import TherapyTemplate from "../models/TherapyTemplate.js";

export const createTemplate = (payload) => TherapyTemplate.create(payload);

export const listTemplates = (filters = {}) => TherapyTemplate.find(filters).sort({ name: 1 });

export const findTemplateById = (id) => TherapyTemplate.findById(id);
