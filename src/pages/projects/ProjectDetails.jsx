import { useParams } from "react-router-dom";
import { useMemo, useState } from "react";
import { ChevronDown, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

import useFlowBoardContext from "../../context/FlowBoardContext";
import OwnersAvatarGroup from "../../components/avatar/OwnersAvatarGroup";
import {
  projectStatusBadgeMap,
  taskStatusBadgeMap,
} from "../../utils/taskHelpers";

import TaskForm from "../../components/form/TaskForm";

const ProjectDetails = () => {
  const { projectId } = useParams();
  const { projectsList, tasksList, tasksLoading, handleTaskFormModalOpening } =
    useFlowBoardContext();
  const [sortMode, setSortMode] = useState("newest");

  // Find Selected Project
  const selectedProject = projectsList.find(
    (project) => project._id === projectId,
  );

  // Status Filter (Table Filter)
  const [statusFilters, setStatusFilters] = useState({
    "To Do": false,
    "In Progress": false,
    Completed: false,
    Blocked: false,
  });

  const toggleStatus = (status) => {
    setStatusFilters((prev) => ({
      ...prev,
      [status]: !prev[status],
    }));
  };

  // Tasks only for this project
  const projectTasks = useMemo(() => {
    return tasksList.filter((task) => task.project?._id === projectId);
  }, [tasksList, projectId]);

  // Apply Filter
  const filteredTasks = useMemo(() => {
    const hasAnyFilter = Object.values(statusFilters).some(Boolean);

    if (!hasAnyFilter) return projectTasks;

    return projectTasks.filter((task) => statusFilters[task.status]);
  }, [projectTasks, statusFilters]);

  // Sort Tasks
  const sortedTasks = useMemo(() => {
    let tasks = [...filteredTasks];
    if (sortMode === "newest") {
      tasks.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }
    if (sortMode === "oldest") {
      tasks.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    }
    if (sortMode === "due") {
      tasks.sort(
        (a, b) => new Date(a.dueDate || "9999") - new Date(b.dueDate || "9999"),
      );
    }

    return tasks;
  }, [filteredTasks, sortMode]);

  // Guard States
  if (!selectedProject) {
    return <p className="text-error">Project not found.</p>;
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="text-3xl font-semibold tracking-tight">
            {selectedProject.name}
          </h1>

          <span
            className={`badge badge-sm ${
              projectStatusBadgeMap[selectedProject.status] || "badge-ghost"
            }`}
          >
            {selectedProject.status}
          </span>
        </div>

        <p className="text-base-content/60 max-w-xl">
          {selectedProject.description}
        </p>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        {/* Sort (UI Only) */}
        <div className="flex flex-wrap gap-2">
          <button
            className={`btn btn-sm ${sortMode === "newest" ? "btn-active" : "btn-ghost"}`}
            onClick={() => setSortMode("newest")}
          >
            Newest First
          </button>

          <button
            className={`btn btn-sm ${sortMode === "oldest" ? "btn-active" : "btn-ghost"}`}
            onClick={() => setSortMode("oldest")}
          >
            Oldest First
          </button>

          <button
            className={`btn btn-sm ${sortMode === "due" ? "btn-active" : "btn-ghost"}`}
            onClick={() => setSortMode("due")}
          >
            Due Date
          </button>
        </div>

        {/* Filter Dropdown */}
        <div className="flex items-center gap-3">
          <div className="dropdown dropdown-end">
            <button tabIndex={0} className="btn btn-sm flex items-center gap-1">
              Filter <ChevronDown size={15} />
            </button>

            <ul
              tabIndex={0}
              className="dropdown-content menu bg-base-100 rounded-box w-52 p-2 shadow z-20"
            >
              {/* Status Filters */}
              {Object.keys(statusFilters).map((status) => (
                <li key={status}>
                  <label
                    className="label cursor-pointer gap-2"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <input
                      type="checkbox"
                      className="checkbox checkbox-primary checkbox-xs"
                      checked={statusFilters[status]}
                      onChange={() => toggleStatus(status)}
                    />
                    <span className="label-text">{status}</span>
                  </label>
                </li>
              ))}

              {/* Clear Filters Button (Only If Active) */}
              {Object.values(statusFilters).some(Boolean) && (
                <li className="mt-1">
                  <button
                    className="btn btn-xs btn-ghost w-full"
                    onClick={() =>
                      setStatusFilters({
                        "To Do": false,
                        "In Progress": false,
                        Completed: false,
                        Blocked: false,
                      })
                    }
                  >
                    Clear filters
                  </button>
                </li>
              )}
            </ul>
          </div>

          {/* New Task Button */}
          <button
            className="btn btn-primary btn-sm"
            onClick={() =>
              handleTaskFormModalOpening({
                formMode: "create",
                taskToEdit: null,
                prefillProjectId: projectId, // Prefill Project
              })
            }
          >
            + New Task
          </button>

          {/* Modal */}
          <TaskForm />
        </div>
      </div>

      {/* Tasks Table */}
      <div className="card bg-base-300 shadow">
        <div className="card-body">
          <h2 className="card-title text-xl">
            Tasks in this Project ({filteredTasks.length})
          </h2>

          {tasksLoading ? (
            <p>Loading tasks...</p>
          ) : filteredTasks.length === 0 ? (
            <p className="text-base-content/60 mt-4">
              No tasks found in this project.
            </p>
          ) : (
            <div className="overflow-x-auto mt-4">
              <table className="table">
                {/* Table Head */}
                <thead>
                  <tr className="text-base-content/60">
                    <th>Task</th>
                    <th>Owners</th>
                    <th>Due</th>
                    <th>Status</th>
                    <th></th>
                  </tr>
                </thead>

                {/* Table Body */}
                <tbody>
                  {sortedTasks.map((task) => (
                    <tr key={task._id} className="hover">
                      {/* Task Name */}
                      <td className="font-medium">{task.name}</td>

                      {/* Owners */}
                      <td>
                        <OwnersAvatarGroup owners={task.owners} />
                      </td>

                      {/* Due Date */}
                      <td>
                        {task.dueDate
                          ? new Date(task.dueDate).toLocaleDateString("en-GB")
                          : "—"}
                      </td>

                      {/* Status */}
                      <td>
                        <span
                          className={`badge badge-sm whitespace-nowrap ${
                            taskStatusBadgeMap[task.status] || "badge-ghost"
                          }`}
                        >
                          {task.status}
                        </span>
                      </td>

                      {/* Action */}
                      <td>
                        <Link
                          to={`/tasks/${task._id}`}
                          className="btn btn-ghost btn-xs"
                        >
                          <ArrowRight size={16} />
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectDetails;
