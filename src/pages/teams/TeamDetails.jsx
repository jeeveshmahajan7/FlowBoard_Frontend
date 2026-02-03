import { useParams } from "react-router-dom";
import { Users, Plus } from "lucide-react";
import { useState } from "react";
import { toast } from "react-toastify";

import useFlowBoardContext from "../../context/FlowBoardContext";
import OwnersAvatarGroup from "../../components/avatar/OwnersAvatarGroup";
import api from "../../services/api";
import AddMemberForm from "../../components/form/AddMemberForm";

const TeamDetails = () => {
  // Get userId of logged in user
  const token = localStorage.getItem("token");
  let loggedInUserId = null;
  if (token) {
    const decoded = JSON.parse(atob(token.split(".")[1]));
    loggedInUserId = decoded.userId;
  }

  const { teamId } = useParams();
  const { teamsList, teamsLoading, refreshTeamsOnAdded } =
    useFlowBoardContext();
  const [removingUserId, setRemovingUserId] = useState(null);

  const [isAddMemberOpen, setIsAddMemberOpen] = useState(false);

  const handleRemoveMember = async (userId) => {
    try {
      setRemovingUserId(userId);

      await api.delete(`/teams/${teamId}/members/${userId}`);

      toast.success("Member removed");
      refreshTeamsOnAdded();
    } catch (error) {
      toast.error(error.message);
    } finally {
      setRemovingUserId(null);
    }
  };

  const selectedTeam = teamsList.find((team) => team._id === teamId);

  if (teamsLoading) return <p>Loading team...</p>;
  if (!selectedTeam) return <p className="text-error">No team found.</p>;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">
          {selectedTeam.name}
        </h1>
        <p className="text-base-content/60 mt-2">{selectedTeam.description}</p>
      </div>

      {/* Members Section */}
      <div className="card bg-base-300 shadow">
        <div className="card-body space-y-5">
          {/* Title + Add Button */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="card-title flex items-center gap-2">
              <Users size={18} />
              Members ({selectedTeam.members?.length || 0})
            </h2>

            <button
              className="btn btn-primary btn-sm"
              onClick={() => setIsAddMemberOpen(true)}
            >
              <Plus size={16} />
              Add Member
            </button>
          </div>

          {/* Avatar Group */}
          <OwnersAvatarGroup owners={selectedTeam.members} />

          {/* Full Member List */}
          <div className="space-y-2 mt-2">
            {selectedTeam.members.map((member) => (
              <div
                key={member._id}
                className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between p-3 rounded-xl bg-base-200"
              >
                <div>
                  <p className="font-medium flex gap-2">
                    {member.name}
                    {member._id === loggedInUserId && (
                      <span className="badge badge-sm badge-primary">You</span>
                    )}
                  </p>
                  <p className="text-sm text-base-content/60">{member.email}</p>
                </div>

                <button
                  className="btn btn-xs btn-outline btn-error"
                  onClick={() => handleRemoveMember(member._id)}
                  disabled={removingUserId === member._id}
                >
                  {removingUserId === member._id ? (
                    <>
                      <span className="loading loading-spinner loading-xs"></span>
                      Removing...
                    </>
                  ) : (
                    "Remove"
                  )}
                </button>
              </div>
            ))}
          </div>

          {/* Empty State */}
          {selectedTeam.members.length === 0 && (
            <p className="text-base-content/50">No members added yet.</p>
          )}
        </div>
      </div>

      {/* Add Member Modal */}
      <AddMemberForm
        teamId={teamId}
        isOpen={isAddMemberOpen}
        onClose={() => setIsAddMemberOpen(false)}
        existingMembers={selectedTeam.members}
      />
    </div>
  );
};

export default TeamDetails;
