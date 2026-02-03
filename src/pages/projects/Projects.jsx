import { ChevronDown } from "lucide-react";
import { useState } from "react";

import useFlowBoardContext from "../../context/FlowBoardContext";
import ProjectForm from "../../components/form/ProjectForm";
import ProjectCard from "../../components/cards/ProjectCard";

const Projects = () => {
  const { projectsList, projectsLoading, projectsError, openProjectModal } =
    useFlowBoardContext();

  // Filtering logic
  const [projectStatusFilters, setProjectStatusFilters] = useState({
    "Not Started": false,
    "In Progress": false,
    Completed: false,
    "On Hold": false,
  });

  const toggleStatus = (status) => {
    setProjectStatusFilters((prev) => ({
      ...prev,
      [status]: !prev[status],
    }));
  };

  const filteredProjects = projectsList.filter((project) => {
    // Are any checkboxes checked?
    const hasAnyFilter = Object.values(projectStatusFilters).some(Boolean); // some method returns true if atleast one filter is true
    // If none are checked, show everything
    if (!hasAnyFilter) return true;
    // Otherwise, only show matching statuses
    return projectStatusFilters[project.status]; // filter if the project status is true in statusFilters array
  });

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center justify-between sm:justify-start sm:gap-4">
          <h1 className="text-3xl font-semibold tracking-tight">Projects</h1>

          <div className="dropdown dropdown-start">
            <button className="btn btn-sm flex items-center gap-1" tabIndex={0}>
              Filter <ChevronDown size={15} />
            </button>

            <ul
              tabIndex={0}
              className="dropdown-content menu bg-base-100 rounded-box z-10 w-44 p-2 shadow"
            >
              {Object.keys(projectStatusFilters).map((status) => (
                <li key={status}>
                  <label
                    className="label cursor-pointer gap-2"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <input
                      type="checkbox"
                      className="checkbox checkbox-primary checkbox-xs"
                      checked={projectStatusFilters[status]}
                      onChange={() => toggleStatus(status)}
                    />
                    <span className="label-text">{status}</span>
                  </label>
                </li>
              ))}

              {Object.values(projectStatusFilters).some(Boolean) && (
                <li className="mt-1">
                  <button
                    className="btn btn-xs btn-ghost w-full"
                    onClick={() =>
                      setProjectStatusFilters({
                        "Not Started": false,
                        "In Progress": false,
                        Completed: false,
                        "On Hold": false,
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

        <button className="btn btn-primary min-w-35" onClick={openProjectModal}>
          + New Project
        </button>

        <ProjectForm />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Projects List */}

        {projectsLoading ? (
          <p>Loading projects..</p>
        ) : projectsError ? (
          <p className="text-red-500">Error: {projectsError.message}</p>
        ) : filteredProjects.length > 0 ? (
          filteredProjects.map((project) => (
            <ProjectCard key={project._id} project={project} />
          ))
        ) : (
          <p>No projects found.</p>
        )}
      </div>
    </div>
  );
};

export default Projects;
