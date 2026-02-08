import { Bar } from "react-chartjs-2";

const CompletedLastWeekChart = ({ tasks }) => {
  if (!tasks || tasks.length === 0) {
    return <p className="text-sm opacity-70">No data available</p>;
  }

  const data = {
    labels: ["Count"],
    datasets: [
      {
        label: "Tasks Completed",
        data: [tasks.length],
        backgroundColor: ["#06B6D4"], // cyan highlight
      },
    ],
  };

  return <Bar data={data} />;
};

export default CompletedLastWeekChart;
