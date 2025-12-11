import { LineChart } from '@mui/x-charts/LineChart';
import { TaskStoreItems } from "../Store/Task-items-store";
import { useContext } from 'react';
import { data } from 'react-router-dom';
export default function TheGraph({ maximizedView, setMaximizedView }) {
  const { newTask } = useContext(TaskStoreItems);
  // const xArray = ['apple','banana','lovely']
  // const yArray = [1,2,5]
  const xArray = newTask.map((item) => item.task)
  const yArray = newTask.map((item) => item.streak)
  const MaxStreak = Math.max(...yArray, 5)

  return (
    <div className='yello para-block'>
      <LineChart
        xAxis={[{ data: xArray, scaleType: 'point', valueFormatter: (value) => value }]}
        yAxis={[{
          min: 0,
          max: MaxStreak , valueFormatter: (value) => Math.floor(value).toString()
        }]}
        series={[{ data: yArray }]}
        height={300}
        onDoubleClick={() => {
          setMaximizedView(maximizedView ? 'Block1' : 'Block2');


        }}
      />
    </div>
  );
}

