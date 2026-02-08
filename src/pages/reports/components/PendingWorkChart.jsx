import { Bar } from "react-chartjs-2";

const PendingWorkChart = ({ days }) => {
  if (!days || days.length === 0) {
    return <p className="text-sm opacity-70">No data available</p>;
  }

  const data = {
    labels: ["Pending Work"],
    datasets: [
      {
        label: "Days",
        data: [days],
        backgroundColor: ["#F97316"], // orange highlight
      },
    ],
  };

  const options = {
    responsive: true,
  };

  return <Bar data={data} options={options} />;
};

export default PendingWorkChart;
