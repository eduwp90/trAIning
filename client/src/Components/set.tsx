import { InputNumber, Form, Select, Radio, Button,  } from 'antd';
import React from 'react';
import 'antd/dist/antd.css';
import './components.css'
const { Option } = Select;

type SetProps = {
  id: number;
  removeSet:  (key: number) => void;
}

const Set: React.FC<SetProps> = ({id, removeSet }) => {

  return (<div className="set-Div">

    <Form.Item name={[id, 'exer']}>
      <Select
        placeholder="exercise"
        style={{ width: 120 }}
      >
      <Option value="sit-up">sit-up</Option>
      <Option value="push-up">push-up</Option>
      </Select>
    </Form.Item>

    <Form.Item name={[id, 'reps']}>
      <InputNumber
        placeholder="Reps"
        min={1} max={30}
      />
    </Form.Item>

    <Form.Item name={[id, 'rest']}>
      <Radio.Group size="small">
        <Radio.Button value={0}>0 min</Radio.Button>
        <Radio.Button value={1}>1 min</Radio.Button>
        <Radio.Button value={3}>3 min</Radio.Button>
        <Radio.Button value={5}>5 min</Radio.Button>
      </Radio.Group>
      </Form.Item>
    <Button onClick={() => removeSet(id)}>Remove set</Button>
  </div>);
}

export default Set