import { createContext, useContext, useEffect, useState } from "react";
import useFetch from "../hooks/useFetch";

const FlowBoardContext = createContext();
const useFlowBoardContext = () => useContext(FlowBoardContext);

export default useFlowBoardContext;

export const FlowBoardProvider = ({ children }) => {
  const API = "https://flow-board-backend-phi.vercel.app";
  // ---------- Auto-Refresh Controls ----------
  const [projectsList, setProjectsList] = useState([]);
  const [refreshProjects, setRefreshProjects] = useState(false); // state to auto refresh projects

  const [teamsList, setTeamsList] = useState([]);
  const [refreshTeams, setRefreshTeams] = useState(false); // state to auto refresh teams

  const [tagsList, setTagsList] = useState([]);
  const [refreshTags, setRefreshTags] = useState(false); // state to auto refresh tags

  const [tasksList, setTasksList] = useState([]);
  const [refreshTasks, setRefreshTasks] = useState(false); // state to auto refresh tags

  // ---------- Workspace Preferences (Persistent) ----------
  const [workspacePreferences, setWorkspacePreferences] = useState(() => {
    const saved = localStorage.getItem("flowboard-preferences");
    return saved
      ? JSON.parse(saved)
      : {
          defaultTaskStatus: "To Do",
          showOverdueWarnings: true,
        };
  });

  // ---------- helper function to update and persist ----------
  const updateWorkspacePreferences = (newPrefs) => {
    setWorkspacePreferences(newPrefs);
    localStorage.setItem("flowboard-preferences", JSON.stringify(newPrefs));
  };

  // ---------- Modal Controls ----------
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [isChangeProjectModalOpen, setIsChangeProjectModalOpen] =
    useState(false);
  const [isTeamModalOpen, setIsTeamModalOpen] = useState(false);

  // ---------- Form Mode controls (Create / Edit) ----------
  const [projectFormMode, setProjectFormMode] = useState("create");
  const [taskFormMode, setTaskFormMode] = useState("create");
  const [taskBeingEdited, setTaskBeingEdited] = useState("");
  const [taskProjectPrefill, setTaskProjectPrefill] = useState("");
  // to prefill project name while creating a task from Project Details page

  const handleTaskFormModalOpening = ({
    formMode,
    taskToEdit,
    prefillProjectId,
  }) => {
    setTaskFormMode(formMode);
    setTaskBeingEdited(taskToEdit || "");

    // Prefill Support
    if (prefillProjectId) {
      setTaskProjectPrefill(prefillProjectId);
    } else {
      setTaskProjectPrefill("");
    }

    openTaskModal();
  };

  // change project modal control
  const handleChangeProjectModalOpening = ({ taskToEdit }) => {
    setTaskBeingEdited(taskToEdit);
    openChangeProjectModal();
  };

  // ---------- Modal opening and closing ----------
  const openProjectModal = () => setIsProjectModalOpen(true);
  const closeProjectModal = () => setIsProjectModalOpen(false);
  const openTaskModal = () => setIsTaskModalOpen(true);
  const closeTaskModal = () => setIsTaskModalOpen(false);
  const openChangeProjectModal = () => setIsChangeProjectModalOpen(true);
  const closeChangeProjectModal = () => setIsChangeProjectModalOpen(false);
  const openTeamModal = () => setIsTeamModalOpen(true);
  const closeTeamModal = () => setIsTeamModalOpen(false);

  // ---------- logic to auto refresh projects ----------
  const refreshProjectsOnAdded = () => {
    setRefreshProjects((prev) => !prev);
  };

  // fetch projects
  const {
    data: projectsData,
    loading: projectsLoading,
    error: projectsError,
  } = useFetch(`${API}/projects`, [refreshProjects]); // useFetch re-fetches data when refreshProjects dependency toggles

  useEffect(() => {
    if (projectsData?.projects) {
      setProjectsList(projectsData.projects);
    }
  }, [projectsData]); // updates the projects list when new projects data is fetched

  // ---------- logic to auto refresh teams ----------
  const refreshTeamsOnAdded = () => {
    setRefreshTeams((prev) => !prev);
  };

  // fetch teams
  const {
    data: teamsData,
    loading: teamsLoading,
    error: teamsError,
  } = useFetch(`${API}/teams`, [refreshTeams]); // useFetch re-fetches data when refreshTeams dependency toggles

  useEffect(() => {
    if (teamsData?.teams) {
      setTeamsList(teamsData.teams);
    }
  }, [teamsData]); // updates the teams list when new projects data is fetched

  // ---------- logic to auto refresh tags ----------
  const refreshTagsOnAdded = () => {
    setRefreshTags((prev) => !prev);
  };

  // fetch tags
  const {
    data: tagsData,
    loading: tagsLoading,
    error: tagsError,
  } = useFetch(`${API}/tags`, [refreshTags]);

  useEffect(() => {
    if (tagsData?.tags) {
      setTagsList(tagsData.tags);
    }
  }, [tagsData]);

  // ---------- logic to auto refresh tasks ----------
  const refreshTasksOnAdded = () => {
    setRefreshTasks((prev) => !prev);
  };

  const {
    data: tasksData,
    loading: tasksLoading,
    error: tasksError,
  } = useFetch(`${API}/tasks`, [refreshTasks]);

  useEffect(() => {
    if (tasksData?.tasks) {
      setTasksList(tasksData.tasks);
    }
  }, [tasksData]);

  return (
    <FlowBoardContext.Provider
      value={{
        workspacePreferences,
        updateWorkspacePreferences,
        projectsList,
        projectsLoading,
        projectsError,
        refreshProjectsOnAdded,
        taskProjectPrefill,
        setTaskProjectPrefill,
        teamsList,
        teamsLoading,
        teamsError,
        refreshTeamsOnAdded,
        tagsList,
        tagsLoading,
        tagsError,
        refreshTagsOnAdded,
        tasksList,
        tasksLoading,
        tasksError,
        refreshTasksOnAdded,
        isProjectModalOpen,
        setIsProjectModalOpen,
        isTaskModalOpen,
        setIsTaskModalOpen,
        isChangeProjectModalOpen,
        setIsChangeProjectModalOpen,
        openProjectModal,
        closeProjectModal,
        openTaskModal,
        closeTaskModal,
        openChangeProjectModal,
        closeChangeProjectModal,
        isTeamModalOpen,
        openTeamModal,
        closeTeamModal,
        taskFormMode,
        handleTaskFormModalOpening,
        handleChangeProjectModalOpening,
        taskBeingEdited,
        setTaskBeingEdited,
      }}
    >
      {children}
    </FlowBoardContext.Provider>
  );
};
