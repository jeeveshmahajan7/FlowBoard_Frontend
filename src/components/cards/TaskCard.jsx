import { Link } from "react-router-dom";

import { taskStatusBadgeMap } from "../../utils/taskHelpers";

const TaskCard = ({ task }) => {
  return (
    <div className="card w-full bg-base-300 shadow-sm flex flex-col min-h-[15rem] hover:shadow-lg hover:-translate-y-1 transition-all duration-200">
      <div className="card-body flex flex-col justify-between">
        <div className="flex flex-col gap-3">
          <span className={`badge badge-xs ${taskStatusBadgeMap[task.status]}`}>
            {task.status.charAt(0).toUpperCase() + task.status.slice(1)}
          </span>
          <h2
            title={task.name}
            className="text-3xl font-bold line-clamp-2 min-h-[3.5rem]"
          >
            {task.name}
          </h2>
          <div className="text-xs line-clamp-3 text-base-content/70">
            Due on:{" "}
            {task.dueDate
              ? new Date(task.dueDate).toLocaleDateString("en-GB", {
                  timeZone: "UTC",
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })
              : "—"}
          </div>
        </div>

        <Link
          to={`/tasks/${task._id}`}
          className="btn btn-sm btn-soft btn-primary w-full"
        >
          Details
        </Link>
      </div>
    </div>
  );
};

export default TaskCard;
