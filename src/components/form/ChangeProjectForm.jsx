import { useEffect, useState } from "react";
import { toast } from "react-toastify";

import useFlowBoardContext from "../../context/FlowBoardContext";
import Modal from "../modal/Modal";
import api from "../../services/api";

const ChangeProjectForm = () => {
  const {
    projectsList,
    isChangeProjectModalOpen,
    closeChangeProjectModal,
    taskBeingEdited,
    tasksList,
    refreshTasksOnAdded,
  } = useFlowBoardContext();

  useEffect(() => {
    if (!taskBeingEdited || !tasksList.length) return;

    // finding current task to show it pre-selected
    const currentTask = tasksList.find((task) => task._id === taskBeingEdited);
    if (!currentTask?.project?._id) return;

    // Guard: do not overwrite if already in sync
    if (updatedProjectId === currentTask.project._id) return;

    setUpdatedProjectId(currentTask.project._id);
  }, [taskBeingEdited, tasksList]);

  // Close modal handler
  const handleClose = async () => {
    closeChangeProjectModal();
  };

  // change project details
  const [updatedProjectId, setUpdatedProjectId] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleChangeProject = async (e) => {
    e.preventDefault();

    if (isLoading) return; // guard against double submit race condition

    try {
      setIsLoading(true);

      await api.put(`/tasks/${taskBeingEdited}`, {
        project: updatedProjectId,
      });

      toast.success("Task project changed Successfully");

      handleClose();
      refreshTasksOnAdded();
    } catch (error) {
      console.error(error);
      toast.error(error.message || "Project updation failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Modal isOpen={isChangeProjectModalOpen} onClose={handleClose}>
        <h3 className="font-bold text-lg">Change Project</h3>

        {/* Change project form */}
        <form onSubmit={handleChangeProject}>
          <fieldset className="fieldset">
            <div className="py-4">
              <label className="fieldset-legend">Select New Project</label>

              <select
                className="select w-full"
                value={updatedProjectId}
                onChange={(e) => setUpdatedProjectId(e.target.value)}
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
                      Updating...
                    </>
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

export default ChangeProjectForm;
