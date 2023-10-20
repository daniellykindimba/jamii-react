/* eslint-disable jsx-a11y/anchor-is-valid */
import {Typography} from "antd";
const {Text} = Typography;

interface Props {
  amount: number;
  currency?: string;
}

export const CurrencyFormatter: React.FC<Props> = (props: Props) => {
  return (
    <Text strong>
      {props.amount?.toLocaleString("en-US", {
        style: "currency",
        currency: props.currency ? props.currency : "TSH",
      })}
    </Text>
  );
};
