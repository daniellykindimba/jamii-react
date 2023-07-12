import {Button, Col, List, Popconfirm, Row, Tag, message} from "antd";
import {useState, useEffect} from "react";
import simpleRestProvider from "../../api";
import configs from "../../configs";
import {KikobaLoanApproverData, KikobaLoanRequestData} from "../../interfaces";
import {SyncOutlined} from "@ant-design/icons";

interface Props {
  loan: KikobaLoanRequestData | any;
  viewOnly?: boolean;
  onUpdate?: any;
}

interface KikobaLoanRequestApproversStatusData {
  approver: KikobaLoanApproverData;
  isApproved: boolean;
  isRejected: boolean;
  isPending: boolean;
}

export const KikobaLoanRequestApproversComponent: React.FC<Props> = (
  props: Props
) => {
  const [loading, setLoading] = useState(true);
  const [recomputing, setRecomputing] = useState(false);
  const [approvers, setApprovers] = useState<
    KikobaLoanRequestApproversStatusData[]
  >([]);

  const getApprovers = async () => {
    setLoading(true);
    const {data} = await simpleRestProvider.custom!({
      url:
        configs.apiUrl +
        `/kikoba/member/loan/${props.loan.id}/approvers/status`,
      method: "get",
    })
      .then((res) => {
        return res;
      })
      .catch(() => {
        return {data: null};
      });
    console.log(data);
    if (data) {
      setApprovers(data.data);
    }
    setLoading(false);
  };

  const recomputeApproval = async () => {
    setRecomputing(true);
    const {data} = await simpleRestProvider.custom!({
      url:
        configs.apiUrl +
        `/kikoba/member/loan/${props.loan.id}/recompute/approval/status`,
      method: "get",
    })
      .then((res) => {
        return res;
      })
      .catch(() => {
        return {data: null};
      });
    if (data) {
      if (data.success) {
        props.onUpdate();
      }
    }
    setRecomputing(false);
  };

  useEffect(() => {
    getApprovers();
  }, []);

  return (
    <>
      <Row>
        {!props.viewOnly && (
          <Col span={24}>
            <Popconfirm
              title="Recomputing Loan Approval"
              description="System will re-compute and re-evaluate the Approval status of this loan request. Are you sure?"
              overlayStyle={{
                width: 300,
              }}
              onConfirm={() => recomputeApproval()}
              onCancel={() => {}}
              okText="Yes"
              cancelText="No"
            >
              <Button
                loading={recomputing}
                icon={<SyncOutlined />}
                style={{float: "right"}}
              >
                Re-compute Approval
              </Button>
            </Popconfirm>
          </Col>
        )}

        <Col span={24} style={{marginTop: 10}}>
          <List
            bordered
            loading={loading}
            dataSource={approvers}
            renderItem={(m) => (
              <List.Item actions={[]}>
                {m.approver.kikobaMember.member.firstName}{" "}
                {m.approver.kikobaMember.member.middleName}{" "}
                {m.approver.kikobaMember.member.lastName}{" "}
                <span style={{float: "right"}}>
                  {m.isApproved && <Tag color="green">Approved</Tag>}

                  {m.isRejected && <Tag color="red">Rejected</Tag>}

                  {m.isPending && <Tag color="blue">Pending</Tag>}
                </span>
              </List.Item>
            )}
          />
        </Col>
      </Row>
    </>
  );
};
