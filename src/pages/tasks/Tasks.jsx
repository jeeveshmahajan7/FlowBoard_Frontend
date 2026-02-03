import { ChevronDown } from "lucide-react";

import useFlowBoardContext from "../../context/FlowBoardContext";
import TaskCard from "../../components/cards/TaskCard";
import TaskForm from "../../components/form/TaskForm";
import { useState } from "react";

const Tasks = () => {
  const { tasksList, tasksLoading, tasksError, handleTaskFormModalOpening } =
    useFlowBoardContext();

  // Filtering logic
  const [taskStatusFilters, setTaskStatusFilters] = useState({
    "To Do": false,
    "In Progress": false,
    Completed: false,
    Blocked: false,
  });

  const toggleStatus = (status) => {
    setTaskStatusFilters((prev) => ({
      ...prev,
      [status]: !prev[status],
    }));
  };

  const filteredTasks = tasksList.filter((task) => {
    // Are any checkboxes checked?
    const hasAnyFilter = Object.values(taskStatusFilters).some(Boolean); // some method will return true if atleast one task status is true
    // If none are checked, show everything
    if (!hasAnyFilter) return true;
    // Otherwise, only show matching statuses
    return taskStatusFilters[task.status];
  });

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center justify-between sm:justify-start sm:gap-4">
          <h1 className="text-3xl font-semibold tracking-tight">My Tasks</h1>

          <div className="dropdown dropdown-start">
            <button className="btn btn-sm flex items-center gap-1" tabIndex={0}>
              Filter <ChevronDown size={15} />
            </button>

            <ul
              tabIndex={0}
              className="dropdown-content menu bg-base-100 rounded-box z-10 w-44 p-2 shadow"
            >
              {Object.keys(taskStatusFilters).map((status) => (
                <li key={status}>
                  <label
                    className="label cursor-pointer gap-2"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <input
                      type="checkbox"
                      className="checkbox checkbox-primary checkbox-xs"
                      checked={taskStatusFilters[status]}
                      onChange={() => toggleStatus(status)}
                    />
                    <span className="label-text">{status}</span>
                  </label>
                </li>
              ))}

              {Object.values(taskStatusFilters).some(Boolean) && (
                <li className="mt-1">
                  <button
                    className="btn btn-xs btn-ghost w-full"
                    onClick={() =>
                      setTaskStatusFilters({
                        "To Do": false,
                        "In Progress": false,
                        Completed: false,
                        Blocked: false,
                      })
                    }
                  >
                    Clear filters
                  </button>
                </li>
              )}
            </ul>
          </div>
        </div>

        <button
          className="btn btn-primary min-w-35"
          onClick={() =>
            handleTaskFormModalOpening({
              formMode: "create",
              taskToEdit: "",
            })
          }
        >
          + New Task
        </button>

        <TaskForm />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Tasks List */}
        {tasksLoading ? (
          <p>Loading tasks..</p>
        ) : tasksError ? (
          <p className="text-red-500">Error: {tasksError.message}</p>
        ) : filteredTasks.length > 0 ? (
          filteredTasks.map((task) => (
            <TaskCard key={task._id} task={task} />
          ))
        ) : (
          <p>No tasks found.</p>
        )}
      </div>
    </div>
  );
};

export default Tasks;
