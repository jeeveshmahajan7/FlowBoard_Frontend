import { Pie } from "react-chartjs-2";
import { getChartColors } from "../../../utils/chartColours";

const ClosedByTeamChart = ({ dataSet }) => {
  if (!dataSet?.length) {
    return <p className="text-sm opacity-70">No data available</p>;
  }

  const labels = dataSet.map((item) => item.name);
  const values = dataSet.map((item) => item.count);

  const data = {
    labels,
    datasets: [
      {
        label: "Tasks Closed",
        data: values,
        backgroundColor: getChartColors(values.length),
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

export default ClosedByTeamChart;
