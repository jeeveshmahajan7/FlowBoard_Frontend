import api from "./api";

export const fetchCompletedLastWeek = () => api.get("/report/last-week");

export const fetchPendingWork = () => api.get("/report/pending");

export const fetchClosedByTeam = () =>
  api.get("/report/closed-tasks?groupBy=team");

export const fetchClosedByOwner = () =>
  api.get("/report/closed-tasks?groupBy=owner");
