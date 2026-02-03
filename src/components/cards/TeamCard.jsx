import { Link } from "react-router-dom";

const TeamCard = ({ team }) => {
  return (
    <div className="card w-full bg-base-300 shadow-sm flex flex-col min-h-[15rem] hover:shadow-lg hover:-translate-y-1 transition-all duration-200">
      <div className="card-body flex flex-col justify-between">
        <h2
          title={team.name}
          className="card-title text-3xl font-bold line-clamp-2"
        >
          {team.name}
        </h2>
        <div className="mt-3 line-clamp-2 text-base-content/70">
          {team.description}
        </div>
        <Link
          to={`/teams/${team._id}`}
          className="btn btn-sm btn-soft btn-primary w-full"
        >
          Manage
        </Link>
      </div>
    </div>
  );
};

export default TeamCard;
