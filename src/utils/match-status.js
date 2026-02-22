import { MATCH_STATUS } from '../validation/matches.js';

export function getMatchStatus(startTime, endTime, now = new Date()) {
    const start = new Date(startTime);
    const end = new Date(endTime);

    if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
        return null;
    }

    if (now < start) {
        return MATCH_STATUS.SCHEDULED;
    }

    if (now >= end) {
        return MATCH_STATUS.FINISHED;
    }

    return MATCH_STATUS.LIVE;
}

/**
 * Synchronizes the match status based on current time and persists changes.
 *
 * @param {Object} match - The match object to check and update.
 * @param {Function} updateStatus - Async function to persist the new status (e.g., database update).
 * @returns {Promise<string>} The current/updated match status.
 *
 * @sideeffects
 * - Calls `updateStatus(nextStatus)` to persist the new status when it changes.
 * - Mutates the passed-in `match` object by setting `match.status = nextStatus` when status changes.
 *
 * @note Callers should be aware that the input `match` object is mutated in-place.
 */
export async function syncMatchStatus(match, updateStatus) {
    const nextStatus = getMatchStatus(match.startTime, match.endTime);
    if (!nextStatus) {
        return match.status;
    }
    if (match.status !== nextStatus) {
        await updateStatus(nextStatus);
        match.status = nextStatus;
    }
    return match.status;
}