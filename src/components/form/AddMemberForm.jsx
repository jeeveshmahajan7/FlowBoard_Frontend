import { useEffect, useState } from "react";
import { Search } from "lucide-react";
import { toast } from "react-toastify";

import Modal from "../modal/Modal";
import api from "../../services/api";
import useFlowBoardContext from "../../context/FlowBoardContext";

const AddMemberForm = ({ teamId, isOpen, onClose, existingMembers }) => {
  const { refreshTeamsOnAdded } = useFlowBoardContext();

  // Search + Results State
  const [searchText, setSearchText] = useState("");
  const [results, setResults] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [addLoading, setAddLoading] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    const fetchAllUsers = async () => {
      try {
        setLoading(true);

        const data = await api.get("/users?search=");

        // Remove already-added members
        const filtered = (data.users || []).filter(
          (user) => !existingMembers.some((member) => member._id === user._id),
        );

        setAllUsers(filtered);
        setResults(filtered);
      } catch (error) {
        toast.error("Failed to load users.");
      } finally {
        setLoading(false);
      }
    };

    fetchAllUsers();
  }, [isOpen]);

  // Filter Users on Search
  useEffect(() => {
    if (!searchText.trim()) {
      setResults(allUsers);
      return;
    }

    const filtered = allUsers.filter(
      (user) =>
        user.name.toLowerCase().includes(searchText.toLowerCase()) ||
        user.email.toLowerCase().includes(searchText.toLowerCase()),
    );

    setResults(filtered);
  }, [searchText, allUsers]);

  // Add Member Handler
  const handleAddMember = async (userId) => {
    if (addLoading) return;

    try {
      setAddLoading(true);

      await api.put(`/teams/${teamId}/members`, {
        userId,
      });

      toast.success("Member added successfully");

      refreshTeamsOnAdded();
      onClose();
    } catch (error) {
      toast.error(error.message);
    } finally {
      setAddLoading(false);
    }
  };

  // Reset Modal State on Close
  const handleClose = () => {
    setSearchText("");
    setResults([]);
    setAllUsers([]);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose}>
      <h3 className="font-bold text-lg">Add Member</h3>

      {/* Search Input */}
      <div className="mt-4 space-y-3">
        <label className="input input-bordered flex items-center gap-2">
          <Search size={16} className="opacity-60" />
          <input
            type="text"
            placeholder="Search by name or email..."
            className="grow"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
        </label>

        {/* Loading */}
        {loading && (
          <p className="text-sm text-base-content/60">Searching...</p>
        )}

        {/* Results */}
        {!loading && results.length > 0 && (
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {results.map((user) => (
              <div
                key={user._id}
                className="flex items-center justify-between p-3 rounded-xl bg-base-200"
              >
                <div>
                  <p className="font-medium">{user.name}</p>
                  <p className="text-xs text-base-content/60">{user.email}</p>
                </div>

                <button
                  className="btn btn-primary btn-xs"
                  disabled={addLoading}
                  onClick={() => handleAddMember(user._id)}
                >
                  Add
                </button>
              </div>
            ))}
          </div>
        )}

        {/* No Results */}
        {!loading && searchText.trim() && results.length === 0 && (
          <p className="text-sm text-base-content/50">
            No new users found (or they are already in the team).
          </p>
        )}
      </div>
    </Modal>
  );
};

export default AddMemberForm;
