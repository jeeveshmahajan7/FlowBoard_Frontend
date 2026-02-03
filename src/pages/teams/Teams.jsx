import { Link } from "react-router-dom";

import useFlowBoardContext from "../../context/FlowBoardContext";
import TeamCard from "../../components/cards/TeamCard";
import TeamForm from "../../components/form/TeamForm";

const Teams = () => {
  const { teamsList, teamsLoading, teamsError, openTeamModal } =
    useFlowBoardContext();

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center  sm:justify-between ">
        <h1 className="text-3xl font-semibold tracking-tight">Teams</h1>
        <button className="btn btn-primary min-w-35" onClick={openTeamModal}>
          + New Team
        </button>

        <TeamForm />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {teamsLoading ? (
          <p>Loading teams..</p>
        ) : teamsError ? (
          <p className="text-red-500">Error: {error.message}</p>
        ) : teamsList.length > 0 ? (
          teamsList.map((team) => <TeamCard key={team._id} team={team} />)
        ) : (
          <p>No teams found.</p>
        )}
      </div>
    </div>
  );
};

export default Teams;
