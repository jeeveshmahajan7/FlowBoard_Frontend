import { useState } from "react";
import { toast } from "react-toastify";

import useFlowBoardContext from "../../context/FlowBoardContext";
import api from "../../services/api";
import Modal from "../modal/Modal";

const TeamForm = () => {
  const { isTeamModalOpen, closeTeamModal, refreshTeamsOnAdded } =
    useFlowBoardContext();

  const [teamName, setTeamName] = useState("");
  const [teamDescription, setTeamDescription] = useState("");
  const [loading, setLoading] = useState(false);

  const handleClose = () => {
    setTeamName("");
    setTeamDescription("");
    closeTeamModal();
  };

  const handleCreateTeam = async (e) => {
    e.preventDefault();
    if (loading) return;

    try {
      setLoading(true);

      await api.post("/teams", {
        name: teamName,
        description: teamDescription,
      });

      toast.success("Team created successfully");
      refreshTeamsOnAdded();
      handleClose();
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isTeamModalOpen} onClose={handleClose}>
      <h3 className="font-bold text-lg">Create New Team</h3>

      <form onSubmit={handleCreateTeam} className="space-y-4 mt-4">
        <input
          type="text"
          placeholder="Team Name"
          className="input input-bordered w-full"
          value={teamName}
          onChange={(e) => setTeamName(e.target.value)}
          required
        />

        <textarea
          placeholder="Team Description"
          className="textarea textarea-bordered w-full"
          value={teamDescription}
          onChange={(e) => setTeamDescription(e.target.value)}
        />

        <button className="btn btn-primary w-full" disabled={loading}>
          {loading ? (
            <>
              <span className="loading loading-spinner loading-sm"></span>
              Creating...
            </>
          ) : (
            "Create Team"
          )}
        </button>
      </form>
    </Modal>
  );
};

export default TeamForm;
