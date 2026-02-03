import { useState } from "react";
import { Trash2, LogOut, ShieldAlert } from "lucide-react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

import useFlowBoardContext from "../../context/FlowBoardContext";
import api from "../../services/api";
import { taskStatusBadgeMap } from "../../utils/taskHelpers";

const Settings = () => {
  const navigate = useNavigate();

  const {
    workspacePreferences,
    updateWorkspacePreferences,
    tasksList,
    refreshTasksOnAdded,
  } = useFlowBoardContext();

  // Modal + Delete State
  const [taskToDelete, setTaskToDelete] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Preferences
  const { defaultTaskStatus, showOverdueWarnings } = workspacePreferences;

  // Logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    toast.success("Logged out successfully ✅");
    navigate("/login");
  };

  // Delete Single Task
  const handleDeleteTask = async () => {
    if (!taskToDelete || deleteLoading) return;

    try {
      setDeleteLoading(true);

      await api.delete(`/tasks/${taskToDelete._id}`);

      toast.success("Task deleted successfully ✅");
      refreshTasksOnAdded();
      setTaskToDelete(null);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setDeleteLoading(false);
    }
  };

  // Delete Completed Tasks (Bulk Cleanup)
  const handleDeleteCompletedTasks = async () => {
    const completedTasks = tasksList.filter(
      (task) => task.status === "Completed",
    );

    if (completedTasks.length === 0) {
      toast.info("No completed tasks to delete.");
      return;
    }

    try {
      toast.info("Deleting completed tasks...");

      await Promise.all(
        completedTasks.map((task) => api.delete(`/tasks/${task._id}`)),
      );

      toast.success("All completed tasks deleted ✅");
      refreshTasksOnAdded();
    } catch (error) {
      toast.error("Something went wrong while deleting tasks.");
    }
  };

  return (
    <div className="space-y-10">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Settings</h1>
        <p className="text-base-content/60 mt-2">
          Manage your FlowBoard workspace preferences and safety controls.
        </p>
      </div>

      {/* Profile Section */}
      <section className="card bg-base-300 shadow">
        <div className="card-body space-y-4">
          <h2 className="card-title text-xl">Account</h2>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <p className="font-medium">Signed in</p>
              <p className="text-sm text-base-content/60">
                Your session is active.
              </p>
            </div>

            <button onClick={handleLogout} className="btn btn-error btn-sm">
              <LogOut size={16} />
              Logout
            </button>
          </div>
        </div>
      </section>

      {/* Preferences Section */}
      <section className="card bg-base-300 shadow">
        <div className="card-body space-y-6">
          <h2 className="card-title text-xl">Workspace Preferences</h2>

          {/* Default Status */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <p className="text-sm text-base-content/70">
              Default status for new tasks
            </p>

            <select
              className="select select-bordered select-sm w-full sm:w-52"
              value={defaultTaskStatus}
              onChange={(e) =>
                updateWorkspacePreferences({
                  ...workspacePreferences,
                  defaultTaskStatus: e.target.value,
                })
              }
            >
              <option>To Do</option>
              <option>In Progress</option>
              <option>Blocked</option>
              <option>Completed</option>
            </select>
          </div>

          {/* Toggle Overdue */}
          <div className="flex items-center justify-between">
            <p className="text-sm text-base-content/70">
              Show overdue warnings
            </p>

            <input
              type="checkbox"
              className="toggle toggle-primary toggle-sm"
              checked={showOverdueWarnings}
              onChange={() =>
                updateWorkspacePreferences({
                  ...workspacePreferences,
                  showOverdueWarnings: !showOverdueWarnings,
                })
              }
            />
          </div>

          <p className="text-xs text-base-content/50">
            Preferences are saved locally and applied instantly ✅
          </p>
        </div>
      </section>

      {/* Danger Zone */}
      <section className="card bg-base-300 border border-error/40 shadow">
        <div className="card-body space-y-5">
          <div className="flex items-center gap-2">
            <ShieldAlert className="text-error" size={20} />
            <h2 className="card-title text-xl text-error">Danger Zone</h2>
          </div>

          <p className="text-sm text-base-content/60">
            These actions are permanent. Use carefully.
          </p>

          {/* Bulk Delete Completed */}
          <button
            onClick={handleDeleteCompletedTasks}
            className="btn btn-error btn-sm w-full sm:w-fit"
          >
            <Trash2 size={16} />
            Delete All Completed Tasks
          </button>

          {/* Single Task Delete List */}
          <div className="space-y-3">
            <h3 className="font-medium text-base-content/80">
              Delete a specific task
            </h3>

            {tasksList.length > 0 ? (
              tasksList.map((task) => (
                <div
                  key={task._id}
                  className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-3 rounded-xl bg-base-200"
                >
                  <div>
                    <p className="font-medium">{task.name}</p>
                    <span
                      className={`badge badge-sm ${
                        taskStatusBadgeMap[task.status] || "badge-ghost"
                      }`}
                    >
                      {task.status}
                    </span>
                  </div>

                  <button
                    className="btn btn-outline btn-error btn-sm"
                    onClick={() => setTaskToDelete(task)}
                  >
                    Delete
                  </button>
                </div>
              ))
            ) : (
              <p className="text-sm text-base-content/50">No tasks found.</p>
            )}
          </div>
        </div>
      </section>

      {/* Delete Confirmation Modal */}
      {taskToDelete && (
        <dialog className="modal modal-open">
          <div className="modal-box bg-base-300">
            <h3 className="font-bold text-lg">Delete Task?</h3>

            <p className="py-3 text-base-content/70">
              Are you sure you want to delete:
              <span className="font-semibold"> {taskToDelete.name}</span>?
              <br />
              This action cannot be undone.
            </p>

            <div className="modal-action">
              <button
                className="btn btn-ghost"
                onClick={() => setTaskToDelete(null)}
              >
                Cancel
              </button>

              <button
                className="btn btn-error"
                disabled={deleteLoading}
                onClick={handleDeleteTask}
              >
                {deleteLoading ? (
                  <>
                    <span className="loading loading-spinner loading-sm"></span>
                    Deleting...
                  </>
                ) : (
                  "Yes, Delete"
                )}
              </button>
            </div>
          </div>
        </dialog>
      )}
    </div>
  );
};

export default Settings;
