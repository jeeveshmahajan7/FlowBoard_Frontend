import { useEffect, useState } from "react";
import {
  fetchCompletedLastWeek,
  fetchPendingWork,
  fetchClosedByTeam,
  fetchClosedByOwner,
} from "../../services/reports.service";

import CompletedLastWeekChart from "./components/CompletedLastWeekChart";
import PendingWorkChart from "./components/PendingWorkChart";
import ClosedByTeamChart from "./components/ClosedByTeamChart";
import ClosedByOwnerChart from "./components/ClosedByOwnerChart";

const Reports = () => {
  const [completedTasks, setCompletedTasks] = useState([]);
  const [pendingDays, setPendingDays] = useState(0);
  const [closedByTeam, setClosedByTeam] = useState([]);
  const [closedByOwner, setClosedByOwner] = useState([]);

  useEffect(() => {
    fetchCompletedLastWeek().then((res) => setCompletedTasks(res.tasks));
    fetchPendingWork().then((res) => setPendingDays(res.pendingDaysOfWork));
    fetchClosedByTeam().then((res) => setClosedByTeam(res.data));
    fetchClosedByOwner().then((res) => setClosedByOwner(res.data));
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-semibold">Reports</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card bg-base-200 p-4">
          <h2 className="font-semibold mb-2">Tasks Completed (Last 7 Days)</h2>
          <CompletedLastWeekChart tasks={completedTasks} />
        </div>

        <div className="card bg-base-200 p-4">
          <h2 className="font-semibold mb-2">Pending Work (Days)</h2>
          <PendingWorkChart days={pendingDays} />
        </div>

        <div className="card bg-base-200 p-4">
          <h2 className="font-semibold mb-2">Tasks Closed by Team</h2>
          <ClosedByTeamChart dataSet={closedByTeam} />
        </div>

        <div className="card bg-base-200 p-4">
          <h2 className="font-semibold mb-2">Tasks Closed by Owner</h2>
          <ClosedByOwnerChart dataSet={closedByOwner} />
        </div>
      </div>
    </div>
  );
};

export default Reports;
