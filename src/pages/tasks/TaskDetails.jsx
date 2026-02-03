import { useParams } from "react-router-dom";
import { useState } from "react";
import { Folder, Users, Calendar, Clock } from "lucide-react";
import { toast } from "react-toastify";

import useFlowBoardContext from "../../context/FlowBoardContext";
import api from "../../services/api";
import OwnersAvatarGroup from "../../components/avatar/OwnersAvatarGroup";
import {
  taskStatusBadgeMap,
  formatDate,
  getDaysRemaining,
} from "../../utils/taskHelpers";
import TaskForm from "../../components/form/TaskForm";
import ChangeProjectForm from "../../components/form/ChangeProjectForm";

const TaskDetails = () => {
  const {
    tasksList,
    tasksLoading,
    refreshTasksOnAdded,
    handleTaskFormModalOpening,
    handleChangeProjectModalOpening,
    workspacePreferences,
  } = useFlowBoardContext();
  const { taskId } = useParams();
  const [completeButtonLoading, setCompleteButtonLoading] = useState(false);
  const { showOverdueWarnings } = workspacePreferences;

  const selectedTask = tasksList.find((task) => task._id === taskId);

  const handleTaskCompletion = async (taskId) => {
    if (completeButtonLoading) return; // guard against double submit

    try {
      setCompleteButtonLoading(true);
      await api.put(`/tasks/${taskId}`, {
        status: "Completed",
      });

      refreshTasksOnAdded();
      toast.success("Successfully marked as completed");
    } catch (error) {
      console.error(error);
      toast.error(error.message);
    } finally {
      setCompleteButtonLoading(false);
    }
  };

  if (tasksLoading) {
    return <p>Loading task...</p>;
  }

  if (!selectedTask) {
    return <p className="text-error">Task not found.</p>;
  }

  const daysRemaining = getDaysRemaining(selectedTask.dueDate);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-3xl font-semibold tracking-tight">
              {selectedTask.name}
            </h1>

            <span
              className={`badge badge-sm ${
                taskStatusBadgeMap[selectedTask.status] || "badge-ghost"
              }`}
            >
              {selectedTask.status}
            </span>
          </div>

          <p className="text-base-content/60">{selectedTask.project?.name}</p>
        </div>
      </div>

      {/* ---------- Main Grid ---------- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* ---------- Left: Task Overview ---------- */}
        <div className="lg:col-span-2">
          <div className="card bg-base-300 shadow">
            <div className="card-body space-y-6">
              <h2 className="card-title">Task Overview</h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* Project */}
                <div className="space-y-1">
                  <p className="text-sm text-base-content/60">Project</p>
                  <div className="flex items-center gap-2">
                    <Folder size={16} />
                    <span>{selectedTask?.project?.name}</span>
                  </div>
                </div>

                {/* Team */}
                <div className="space-y-1">
                  <p className="text-sm text-base-content/60">Team</p>
                  <div className="flex items-center gap-2">
                    <Users size={16} />
                    <span>{selectedTask?.team?.name || "—"}</span>
                  </div>
                </div>

                {/* Owners */}
                <div className="space-y-2">
                  <p className="text-sm text-base-content/60">Owners</p>
                  <OwnersAvatarGroup owners={selectedTask.owners} />
                </div>

                {/* Tags */}
                <div className="space-y-2">
                  <p className="text-sm text-base-content/60">Tags</p>
                  <div className="flex flex-wrap gap-2">
                    {selectedTask?.tags.length > 0 ? (
                      selectedTask?.tags.map((tag) => (
                        <span
                          key={tag}
                          className="badge badge-warning badge-sm"
                        >
                          {tag}
                        </span>
                      ))
                    ) : (
                      <span className="text-sm text-base-content/50">
                        No Tags
                      </span>
                    )}
                  </div>
                </div>

                {/* Due Date */}
                <div className="space-y-1">
                  <div className="text-sm text-base-content/60">Due Date</div>
                  <div className="flex items-center gap-2">
                    <Calendar size={16} />
                    <span>{formatDate(selectedTask.dueDate)}</span>
                  </div>
                </div>

                {/* Estimated Time */}
                <div className="space-y-1">
                  <p className="text-sm text-base-content/60">Estimated Time</p>
                  <div className="flex items-center gap-2">
                    <Clock size={16} />
                    <span>
                      {selectedTask.timeToComplete
                        ? `${selectedTask.timeToComplete} days`
                        : "—"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* ---------- Right: Status & Actions ---------- */}
        <div className="space-y-6">
          {/* Status */}
          <div className="card bg-base-300 shadow">
            <div className="card-body space-y-3">
              <h2 className="card-title">Status</h2>

              <span
                className={`badge ${
                  taskStatusBadgeMap[selectedTask.status] || "badge-ghost"
                }`}
              >
                {selectedTask.status}
              </span>

              {showOverdueWarnings &&
                daysRemaining !== null &&
                selectedTask.status !== "Completed" && (
                  <p
                    className={`text-sm ${
                      daysRemaining < 0 ? "text-error" : "text-base-content/70"
                    }`}
                  >
                    {daysRemaining < 0
                      ? "Overdue"
                      : `${daysRemaining} days remaining`}
                  </p>
                )}

              <p className="text-sm text-base-content/60">
                Due: {formatDate(selectedTask.dueDate)}
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="card bg-base-300 shadow">
            <div className="card-body space-y-3">
              <h2 className="card-title">Actions</h2>

              {selectedTask.status !== "Completed" && (
                <button
                  disabled={completeButtonLoading}
                  onClick={() => handleTaskCompletion(taskId)}
                  className="btn btn-primary btn-sm w-full"
                >
                  {completeButtonLoading ? (
                    <>
                      <span className="loading loading-spinner loading-sm"></span>
                      Completing...
                    </>
                  ) : (
                    "Mark as Completed"
                  )}
                </button>
              )}

              <button
                className="btn btn-ghost btn-sm w-full"
                onClick={() =>
                  handleTaskFormModalOpening({
                    formMode: "edit",
                    taskToEdit: taskId,
                  })
                }
              >
                Edit Task
              </button>

              <TaskForm />

              <button
                className="btn btn-ghost btn-sm w-full"
                onClick={() =>
                  handleChangeProjectModalOpening({ taskToEdit: taskId })
                }
              >
                Move to Another Project
              </button>

              <ChangeProjectForm />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskDetails;
