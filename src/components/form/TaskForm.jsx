import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Select from "react-select";

import useFlowBoardContext from "../../context/FlowBoardContext";
import { reactSelectStyles } from "../../styles/reactSelectStyles";
import useSystemTheme from "../../hooks/useSystemTheme";
import api from "../../services/api";
import Modal from "../modal/Modal";

const TaskForm = () => {
  const {
    tasksList,
    isTaskModalOpen,
    closeTaskModal,
    refreshTasksOnAdded,
    taskProjectPrefill,
    setTaskProjectPrefill,
    projectsList,
    teamsList,
    tagsList,
    taskFormMode,
    taskBeingEdited,
    setTaskBeingEdited,
    workspacePreferences,
  } = useFlowBoardContext();

  // dark or light theme of user
  const theme = useSystemTheme(); // for react-select component styling

  // create task
  const [newTaskName, setNewTaskName] = useState("");
  const [selectedTags, setSelectedTags] = useState([]);
  const [selectedProjectId, setSelectedProjectId] = useState("");
  const [selectedTeamId, setSelectedTeamId] = useState("");
  const [newTaskStatus, setNewTaskStatus] = useState("To Do");
  const [selectedDueDate, setSelectedDueDate] = useState("");
  const [selectedTimeToComplete, setSelectedTimeToComplete] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  // central reset function
  const resetForm = () => {
    // reset form fields
    setSelectedProjectId(taskProjectPrefill || "");
    setNewTaskName("");
    setSelectedTags([]);
    setSelectedTeamId("");
    setNewTaskStatus(workspacePreferences.defaultTaskStatus);
    setSelectedDueDate("");
    setSelectedTimeToComplete(1);

    // reset task being edited
    setTaskBeingEdited("");
  };

  // Close modal handler
  const handleClose = () => {
    resetForm(); // to handle reset form fields while closing modal by clicking outside
    setTaskProjectPrefill(""); // clearing prefill to prevent leakage
    closeTaskModal();
  };

  // Pre-fill task details if taskBeingEdited is present
  useEffect(() => {
    // ✅ If creating, apply default workspace status
    if (taskFormMode === "create") {
      setNewTaskStatus(workspacePreferences.defaultTaskStatus);
    }

    if (!taskBeingEdited || !tasksList || tasksList.length === 0) return;

    const currentTaskDetails = tasksList?.find(
      (task) => task._id === taskBeingEdited,
    );

    if (!currentTaskDetails) return;

    setSelectedProjectId(currentTaskDetails.project?._id || "");
    setNewTaskName(currentTaskDetails.name || "");
    setSelectedTags(currentTaskDetails.tags || []);
    setSelectedTeamId(currentTaskDetails.team?._id || "");
    setNewTaskStatus(currentTaskDetails.status || "To Do");
    setSelectedDueDate(
      currentTaskDetails.dueDate
        ? new Date(currentTaskDetails.dueDate).toISOString().split("T")[0]
        : "",
    );
    setSelectedTimeToComplete(currentTaskDetails.timeToComplete || 1);
  }, [taskBeingEdited, tasksList]);

  useEffect(() => {
  if (!isTaskModalOpen) return;

  // ✅ Only for CREATE mode
  if (taskFormMode === "create" && taskProjectPrefill) {
    setSelectedProjectId(taskProjectPrefill);
  }
}, [isTaskModalOpen, taskFormMode, taskProjectPrefill]);

  const handleTaskAction = async (e) => {
    e.preventDefault();

    if (isLoading) return; // guard against double submit (race condition)

    const isEditModeOn = taskFormMode === "edit";
    const url = isEditModeOn ? `/tasks/${taskBeingEdited}` : "/tasks";
    const method = isEditModeOn ? api.put : api.post;

    try {
      setIsLoading(true);

      await method(url, {
        name: newTaskName,
        project: selectedProjectId,
        team: selectedTeamId,
        tags: selectedTags,
        timeToComplete: selectedTimeToComplete,
        dueDate: selectedDueDate,
        status: newTaskStatus,
      });

      toast.success(
        `Task ${isEditModeOn ? "updated" : "created"} Successfully`,
      );

      handleClose(); // reset form fields and close task modal
      refreshTasksOnAdded(); // refresh tasks
    } catch (error) {
      console.error(error);
      toast.error(
        error.message ||
          `Task ${isEditModeOn ? "updation" : "creation"} failed`,
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Modal isOpen={isTaskModalOpen} onClose={handleClose}>
        <h3 className="font-bold text-lg">
          {taskFormMode === "create" ? "Create New Task" : "Edit Task Details"}
        </h3>

        {/* Add new project form */}

        <form onSubmit={handleTaskAction}>
          <fieldset className="fieldset" disabled={isLoading}>
            <div className="py-4">
              <label className="fieldset-legend">Select Project</label>
              <select
                className="select w-full"
                value={selectedProjectId}
                onChange={(e) => setSelectedProjectId(e.target.value)}
              >
                <option value="" disabled>
                  Select Project
                </option>
                {projectsList.map((project) => (
                  <option key={project._id} value={project._id}>
                    {project.name}
                  </option>
                ))}
              </select>

              <label className="fieldset-legend">Task Name</label>
              <input
                type="text"
                className="input w-full"
                placeholder="Enter Task Name"
                value={newTaskName}
                onChange={(e) => setNewTaskName(e.target.value)}
              />

              <label className="fieldset-legend">Tags</label>
              <Select
                isMulti
                styles={reactSelectStyles(theme)}
                placeholder="Select Tags"
                className="w-full text-sm"
                classNamePrefix="react-select"
                options={tagsList.map((tag) => ({
                  value: tag.name,
                  label: tag.name,
                }))}
                value={selectedTags.map((tagName) => ({
                  value: tagName,
                  label: tagName,
                }))}
                onChange={(selectedOptions) => {
                  setSelectedTags(
                    selectedOptions
                      ? selectedOptions.map((opt) => opt.value)
                      : [],
                  );
                }}
              />

              <label className="fieldset-legend">Task Status</label>
              <select
                className="select w-full"
                value={newTaskStatus}
                onChange={(e) => setNewTaskStatus(e.target.value)}
              >
                <option value="" disabled>
                  Select Status
                </option>
                <option value="To Do">To Do</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
                <option value="Blocked">Blocked</option>
              </select>

              <label className="fieldset-legend">Select Team</label>
              <select
                className="select w-full"
                value={selectedTeamId}
                onChange={(e) => setSelectedTeamId(e.target.value)}
              >
                <option value="" disabled>
                  Select Team
                </option>
                {teamsList.map((team) => (
                  <option key={team._id} value={team._id}>
                    {team.name}
                  </option>
                ))}
              </select>

              <div className="flex gap-3">
                <div className="flex-1">
                  <label className="fieldset-legend">Select Due Date</label>
                  <input
                    type="date"
                    className="input w-full"
                    value={selectedDueDate}
                    onChange={(e) => setSelectedDueDate(e.target.value)}
                  />
                </div>
                <div className="flex-1">
                  <label className="fieldset-legend">Estimated Time</label>
                  <input
                    type="number"
                    placeholder="Enter Time in Days"
                    className="input w-full"
                    value={selectedTimeToComplete}
                    onChange={(e) => setSelectedTimeToComplete(e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Form buttons */}
            <div className="modal-action">
              <div className="flex gap-3">
                <button
                  className="btn btn-error w-33"
                  type="button"
                  onClick={handleClose}
                >
                  Cancel
                </button>
                <button className="btn btn-primary w-33" type="submit">
                  {isLoading ? (
                    <>
                      <span className="loading loading-spinner loading-sm"></span>
                      {taskFormMode === "create"
                        ? "Creating..."
                        : "Updating..."}
                    </>
                  ) : taskFormMode === "create" ? (
                    "Create"
                  ) : (
                    "Update"
                  )}
                </button>
              </div>
            </div>
          </fieldset>
        </form>
      </Modal>
    </>
  );
};

export default TaskForm;
