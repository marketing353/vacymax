import { UserPreferences, OptimizationResult } from "../types";
import HolidayWorker from '../workers/optimization.worker?worker';

// Helper function kept in main thread for UI usage
export const getHolidayDescription = (name: string): string => {
    const n = name.toLowerCase();
    if (n.includes('christmas')) return "Major holiday. Ideal for family.";
    if (n.includes('thanksgiving')) return "Perfect for travel.";
    if (n.includes('easter') || n.includes('good friday')) return "Great spring break.";
    if (n.includes('new year')) return "Fresh start.";
    if (n.includes('labor') || n.includes('labour')) return "End of summer.";
    if (n.includes('memorial') || n.includes('anzac') || n.includes('remembrance')) return "Day of reflection.";
    if (n.includes('independence') || n.includes('canada') || n.includes('australia')) return "National celebration.";
    return "Public Holiday. Extend for a break.";
};

// --- WORKER INTEGRATION ---
let worker: Worker | null = null;
const pendingMap = new Map<string, { resolve: (val: any) => void, reject: (err: any) => void }>();

export const generateVacationPlan = (prefs: UserPreferences): Promise<OptimizationResult> => {
    if (!worker) {
        // Instantiate the worker
        worker = new HolidayWorker();

        // Handle responses
        worker.onmessage = (e: MessageEvent) => {
            const { id, success, result, error } = e.data;
            const handler = pendingMap.get(id);
            if (handler) {
                if (success) {
                    handler.resolve(result);
                } else {
                    console.error("Worker optimization failed:", error);
                    handler.reject(new Error(error));
                }
                pendingMap.delete(id);
            }
        };

        worker.onerror = (e) => {
            console.error("Worker error:", e);
        };
    }

    return new Promise((resolve, reject) => {
        const id = Math.random().toString(36).substr(2, 9);
        pendingMap.set(id, { resolve, reject });
        worker!.postMessage({ id, prefs });
    });
};