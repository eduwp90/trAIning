import { InputNumber, Form, Select, Radio, Button } from "antd";
import { CloseOutlined } from "@ant-design/icons";
import React from "react";
import "antd/dist/antd.less";
import "./components.less";
const { Option } = Select;

type SetProps = {
  id: number;
  removeSet: (key: number) => void;
};

const Set: React.FC<SetProps> = ({ id, removeSet }) => {
  return (
    <div className="set-Div">
      <div className="set-Div_inputs">
        <Form.Item
          name={[id, "exer"]}
          label="Select Exercise"
          rules={[
            {
              required: true
            }
          ]}>
          <Select size="large" placeholder="exercise" style={{ width: 120 }}>
            <Option value="push-ups">push ups</Option>
            <Option value="squats">squats</Option>
            <Option value="lunges">lunges</Option>
            <Option value="jumping-jacks">jumping jacks</Option>
            <Option value="side-squats">side squats</Option>
          </Select>
        </Form.Item>

        <Form.Item
          name={[id, "reps"]}
          label="Nº of repetitions"
          rules={[
            {
              required: true
            }
          ]}>
          <InputNumber size="large" placeholder="Reps" min={1} max={60} style={{ width: 120 }} />
        </Form.Item>

        <Form.Item
          name={[id, "rest"]}
          label="Rest time"
          rules={[
            {
              required: true
            }
          ]}>
          <Radio.Group size="large" buttonStyle="solid">
            <Radio.Button value={0}>0 min</Radio.Button>
            <Radio.Button value={1}>1 min</Radio.Button>
            <Radio.Button value={3}>3 min</Radio.Button>
            <Radio.Button value={5}>5 min</Radio.Button>
          </Radio.Group>
        </Form.Item>
      </div>

      <Button id="round_button" onClick={() => removeSet(id)}>
        <CloseOutlined />
      </Button>
    </div>
  );
};

export default Set;
