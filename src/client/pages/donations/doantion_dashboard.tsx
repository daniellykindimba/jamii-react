/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable react-hooks/exhaustive-deps */
import {
  SearchOutlined,
  DeleteOutlined,
  EditOutlined,
  OrderedListOutlined,
  PlusOutlined,
  ArrowDownOutlined,
  ArrowUpOutlined,
} from "@ant-design/icons";
import {
  useActiveAuthProvider,
  useGetIdentity,
  useNavigation,
} from "@refinedev/core";
import {
  Button,
  Card,
  Col,
  Form,
  Grid,
  Input,
  Modal,
  Popconfirm,
  Row,
  Statistic,
  Table,
  message,
} from "antd";
import {useState, useEffect} from "react";
import {useParams} from "react-router-dom";
import simpleRestProvider from "../../../api";
import configs from "../../../configs";
import {DonationData, RegionData} from "../../../interfaces";
import {CreateDonationForm} from "../../components/form/create_donation_form";
import moment from "moment";
import {EditDonationForm} from "../../components/form/edit_donation_form";
import {DonationMembersComponent} from "./components/donation_members";
import {DonationsComponent} from "./components/donations";
import {DonationDisbursementsComponent} from "./components/disbursements";

interface Props {
  onUpdate?: any;
  donation?: DonationData;
}

export const DonationDashboard: React.FC<Props> = (props: Props) => {
  const authProvider = useActiveAuthProvider();
  const {data: user} = useGetIdentity({
    v3LegacyAuthProviderCompatible: Boolean(authProvider?.isLegacy),
  });
  const [randKey, setRandKey] = useState(Math.random());
  const [loading, setLoading] = useState(false);

  const [totalDonators, setTotalDonators] = useState(
    props.donation?.totalDonators
  );
  const [totalDonations, setTotalDonations] = useState(
    props.donation?.totalDonations
  );
  const [totalDisbursements, setTotalDisbursements] = useState(
    props.donation?.totalDisbursements
  );

  const getDonation = async () => {
    setLoading(true);
    const {data} = await simpleRestProvider.custom!<DonationData | any>({
      url: configs.apiUrl + `/donation/${props.donation?.id}`,
      method: "get",
    })
      .then((res) => {
        return res;
      })
      .catch((error) => {
        return {data: null};
      });

    if (data) {
      if (data.success) {
        setTotalDonators(data.data.totalDonators);
        setTotalDonations(data.data.totalDonations);
        setTotalDisbursements(data.data.totalDisbursements);
      }
    }
    setLoading(false);
  };

  const handleOnUpdate = () => {
    getDonation();
    setRandKey(Math.random());
  };

  useEffect(() => {
    console.log(props.donation?.user.id);
    console.log(user);
    console.log(props.donation?.user.id === user?.id);
    console.log(props.donation);
  }, []);

  return (
    <>
      <Card size="small">
        <Row gutter={16}>
          <Col span={8}>
            <Card bordered={false} size="small">
              <Statistic
                title="Donors"
                value={totalDonators}
                precision={0}
                valueStyle={{color: "#3f8600"}}
                prefix={<ArrowUpOutlined />}
              />
            </Card>
          </Col>
          <Col span={8}>
            <Card bordered={false} size="small">
              <Statistic
                title="Total Donations"
                value={totalDonations}
                precision={2}
                valueStyle={{color: "#055E2B"}}
                prefix={<ArrowUpOutlined />}
              />
            </Card>
          </Col>
          {props.donation?.user.id === user?.id && (
            <Col span={8}>
              <Card bordered={false} size="small">
                <Statistic
                  title="Total Disbursements"
                  value={totalDisbursements}
                  precision={2}
                  valueStyle={{color: "#055E2B"}}
                  prefix={<ArrowUpOutlined />}
                />
              </Card>
            </Col>
          )}
        </Row>
      </Card>
      <Row>
        <Col span={8}>
          <DonationMembersComponent
            donation={props.donation}
            onUpdate={handleOnUpdate}
            randKey={randKey}
          />
        </Col>

        <Col span={8}>
          <DonationsComponent
            donation={props.donation}
            onUpdate={handleOnUpdate}
            randKey={randKey}
          />
        </Col>

        {props.donation?.user.id === user?.id && (
          <Col span={8}>
            <DonationDisbursementsComponent
              donation={props.donation}
              onUpdate={handleOnUpdate}
              randKey={randKey}
            />
          </Col>
        )}
      </Row>
    </>
  );
};
