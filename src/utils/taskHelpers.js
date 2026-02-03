export const taskStatusBadgeMap = {
  "To Do": "badge-warning",
  "In Progress": "badge-info",
  Completed: "badge-success",
  Blocked: "badge-error",
};

export const projectStatusBadgeMap = {
  "Not Started": "badge-warning",
  "In Progress": "badge-info",
  Completed: "badge-success",
  "On Hold": "badge-error",
};

// export const toggleStatus = (status) => {
//   setProjectStatusFilters((prev) => ({
//     ...prev,
//     [status]: !prev[status],
//   }));
// };
// Look how this can be added here ............

export const formatDate = (dateStr) => {
  if (!dateStr) return "-";
  return new Date(dateStr).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

export const getDaysRemaining = (dueDate) => {
  if (!dueDate) return null;
  const today = new Date();
  const due = new Date(dueDate);
  const diff = Math.ceil((due - today) / (1000 * 60 * 60 * 24));
  return diff;
};
