import { Pie } from 'react-chartjs-2';

const GenderChart = ({ genderStats }) => {
  const data = {
    labels: ['Male', 'Female'],
    datasets: [
      {
        data: [genderStats.male, genderStats.female],
        backgroundColor: ['#36A2EB', '#FF6384'],
        hoverBackgroundColor: ['#36A2EB', '#FF6384'],
      },
    ],
  };

  return <Pie data={data} />;
};

export default GenderChart;