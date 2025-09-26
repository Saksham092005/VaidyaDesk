import { useContext } from "react";

import { PatientDashboardContext } from "./patientDashboardContext.js";

export function usePatientDashboard() {
    const context = useContext(PatientDashboardContext);
    if (!context) {
        throw new Error("usePatientDashboard must be used within a PatientDashboardProvider");
    }
    return context;
}
