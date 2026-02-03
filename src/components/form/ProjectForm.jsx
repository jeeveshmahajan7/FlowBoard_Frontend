import { useState } from "react";
import { toast } from "react-toastify";

import api from "../../services/api";
import useFlowBoardContext from "../../context/FlowBoardContext";
import Modal from "../modal/Modal";

const ProjectForm = () => {
  const {
    isProjectModalOpen,
    closeProjectModal,
    refreshProjectsOnAdded,
  } = useFlowBoardContext();

  // create project
  const [newProjectName, setNewProjectName] = useState("");
  const [newProjectDescription, setNewProjectDescription] = useState("");
  const [newProjectStatus, setNewProjectStatus] = useState("Not Started");
  const [isCreatingProject, setIsCreatingProject] = useState(false); // project creation loading state

  // Central reset function
  const resetForm = () => {
    setNewProjectName("");
    setNewProjectDescription("");
    setNewProjectStatus("Not Started");
  };

  // Close modal handler
  const handleClose = () => {
    resetForm(); // to handle reset form fields while closing modal by clicking outside
    closeProjectModal();
  };

  const handleCreateProject = async (e) => {
    e.preventDefault();

    if (isCreatingProject) return; // guard against double submit (race conditions)

    try {
      setIsCreatingProject(true);

      await api.post("/projects", {
        name: newProjectName,
        description: newProjectDescription,
        status: newProjectStatus,
      });

      toast.success("Project Created Successfully");

      closeProjectModal(); // close Project Form Modal
      resetForm(); // clear input fields
      refreshProjectsOnAdded(); // refresh projects
    } catch (error) {
      console.error(error);
      toast.error(error.message || "Project creation failed");
    } finally {
      setIsCreatingProject(false);
    }
  };

  return (
    <>
      <Modal isOpen={isProjectModalOpen} onClose={handleClose}>
        <h3 className="font-bold text-lg">Create New Project</h3>

        {/* Add new project form */}

        <form onSubmit={handleCreateProject}>
          <fieldset className="fieldset" disabled={isCreatingProject}>
            <div className="py-4">
              <label className="fieldset-legend">Project Name</label>
              <input
                type="text"
                className="input"
                placeholder="Enter Project Name"
                value={newProjectName}
                onChange={(e) => setNewProjectName(e.target.value)}
              />

              <label className="fieldset-legend">Project Description</label>
              <input
                type="text"
                className="input"
                placeholder="Enter Project Description"
                value={newProjectDescription}
                onChange={(e) => setNewProjectDescription(e.target.value)}
              />

              <label className="fieldset-legend">Project Status</label>
              <select
                className="select"
                value={newProjectStatus}
                onChange={(e) => setNewProjectStatus(e.target.value)}
              >
                <option value="Not Started" defaultChecked>
                  Not Started
                </option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
                <option value="On Hold">On Hold</option>
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
                  {isCreatingProject ? (
                    <>
                      <span className="loading loading-spinner loading-sm"></span>
                      Creating...
                    </>
                  ) : (
                    "Create"
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

export default ProjectForm;
