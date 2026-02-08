import { Pie } from "react-chartjs-2";
import { getChartColors } from "../../../utils/chartColours";

const ClosedByOwnerChart = ({ dataSet }) => {
  if (!dataSet || dataSet.length === 0) {
    return <p className="text-sm opacity-70">No data available</p>;
  }

  const data = {
    labels: dataSet.map((item) => item.name),
    datasets: [
      {
        label: "Tasks Closed",
        data: dataSet.map((item) => item.count),
        backgroundColor: getChartColors(dataSet.length),
        borderColor: "#0f172a",
        borderWidth: 2,
      },
    ],
  };

  const options = {
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
    },
  };

  return (
    <div className="h-72">
      <Pie data={data} options={options} />
    </div>
  );
};

export default ClosedByOwnerChart;
