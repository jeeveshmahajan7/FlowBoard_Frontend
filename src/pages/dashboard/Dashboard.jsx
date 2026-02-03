import useFlowBoardContext from "../../context/FlowBoardContext";

import ProjectForm from "../../components/form/ProjectForm";
import TaskForm from "../../components/form/TaskForm";
import ProjectCard from "../../components/cards/ProjectCard";
import TaskCard from "../../components/cards/TaskCard";

const Dashboard = () => {
  const {
    projectsList,
    projectsLoading,
    projectsError,
    tasksList,
    tasksLoading,
    tasksError,
    openProjectModal,
    handleTaskFormModalOpening,
  } = useFlowBoardContext();

  return (
    <div>
      <h1 className="sr-only">Dashboard</h1>

      <div className="flex flex-col gap-10">
        {/* Projects Section */}
        <section className="space-y-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center justify-between">
            <h2 className="text-3xl font-semibold tracking-tight">Projects</h2>

            <button
              className="btn btn-primary min-w-35"
              onClick={openProjectModal}
            >
              + New Project
            </button>

            <ProjectForm />
          </div>

          {/* Projects List */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {projectsLoading ? (
              <p>Loading projects..</p>
            ) : projectsError ? (
              <p className="text-red-500">Error: {projectsError.message}</p>
            ) : projectsList.length > 0 ? (
              projectsList.map((project) => (
                <ProjectCard key={project._id} project={project} />
              ))
            ) : (
              <p>No projects found.</p>
            )}
          </div>
        </section>

        <div className="divider"></div>

        {/* Tasks Section */}
        <section className="space-y-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center justify-between">
            <h2 className="text-3xl font-semibold tracking-tight">My Tasks</h2>

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

          {/* Tasks List */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {tasksLoading ? (
              <p>Loading tasks..</p>
            ) : tasksError ? (
              <p className="text-red-500">Error: {tasksError.message}</p>
            ) : tasksList.length > 0 ? (
              tasksList.map((task) => <TaskCard key={task._id} task={task} />)
            ) : (
              <p>No tasks found.</p>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Dashboard;
