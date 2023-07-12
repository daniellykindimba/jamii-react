import {CheckOutlined, CloseOutlined} from "@ant-design/icons";
import {
  Alert,
  Button,
  Descriptions,
  Divider,
  Drawer,
  Popconfirm,
  Timeline,
  message,
} from "antd";
import moment from "moment";
import {useState, useEffect} from "react";
import simpleRestProvider from "../../api";
import configs from "../../configs";
import {KikobaData, KikobaLoanRequestData} from "../../interfaces";
import {KikobaLoanRequestApproversComponent} from "./kikoba_loan_request_approvers_status";
import {ThousandsFormatterComponent} from "./thousands_formatter";

interface Props {
  kikoba: KikobaData | any;
  onUpdate?: any;
}

interface LoanRequestApproveProps {
  request: any;
  onUpdate: any;
}

interface LoanRequestCheckData {
  isApproved: boolean;
  isRejected: boolean;
}

const LoanRequestApproveCheck: React.FC<LoanRequestApproveProps> = (
  props: LoanRequestApproveProps
) => {
  const [data, setData] = useState<LoanRequestCheckData>({
    isApproved: false,
    isRejected: false,
  });

  const getData = async () => {
    await simpleRestProvider.custom!({
      method: "get",
      url:
        configs.apiUrl +
        `/kikoba/loan/request/approver/${props.request.id}/check`,
    })
      .then((res) => {
        if (res.data.success) {
          setData({
            isApproved: res.data.isAccepted,
            isRejected: res.data.isRejected,
          });
        }
      })
      .catch((err) => {
        return {data: null};
      });
  };

  const approveRequest = async (id: number) => {
    await simpleRestProvider.custom!({
      method: "get",
      url: configs.apiUrl + `/kikoba/loan/request/${id}/approve`,
    })
      .then((res) => {
        if (res.data.success) {
          message.success(res.data.message);
          props.onUpdate();
        } else {
          message.error(res.data.message);
        }
      })
      .catch((err) => {
        return {data: null};
      });
  };

  const rejectRequest = async (id: number) => {
    await simpleRestProvider.custom!({
      method: "get",
      url: configs.apiUrl + `/kikoba/loan/request/${id}/reject`,
    })
      .then((res) => {
        if (res.data.success) {
          message.success(res.data.message);
          props.onUpdate();
        } else {
          message.error(res.data.message);
        }
      })
      .catch((err) => {
        return {data: null};
      });
  };

  useEffect(() => {
    getData();
  }, [props.request]);

  return (
    <>
      <span>
        {data.isApproved && (
          <Alert
            type="success"
            description="You already approved this request"
            style={{padding: 5}}
          />
        )}

        {data.isRejected && (
          <Alert
            type="error"
            description="You already rejected this request"
            style={{padding: 5}}
          />
        )}
      </span>
      <span>
        {!data?.isApproved && (
          <Popconfirm
            title="Approve this loan request"
            description="Are you sure to approve this loan?"
            placement="topRight"
            onConfirm={() => approveRequest(props.request.id)}
            onCancel={() => {}}
            okText="Yes"
            cancelText="No"
          >
            <Button icon={<CheckOutlined />}>Approve</Button>
          </Popconfirm>
        )}

        {!data.isRejected && (
          <Popconfirm
            title="Reject this loan request"
            description="Are you sure to reject this loan?"
            placement="topRight"
            onConfirm={() => rejectRequest(props.request.id)}
            onCancel={() => {}}
            okText="Yes"
            cancelText="No"
          >
            <Button icon={<CloseOutlined />}>Reject</Button>
          </Popconfirm>
        )}
      </span>
    </>
  );
};

export const LoansRequestsComponent: React.FC<Props> = (props: Props) => {
  const [request, setRequest] = useState<KikobaLoanRequestData>();
  const [requests, setRequests] = useState<KikobaLoanRequestData[]>([]);
  const [approversModal, setApproversModal] = useState<boolean>(false);

  const handleApproversModal = async (request: KikobaLoanRequestData) => {
    setRequest(request);
    setApproversModal(true);
  };

  const getRequests = async () => {
    await simpleRestProvider.custom!({
      method: "get",
      url: configs.apiUrl + `/kikoba/${props.kikoba.id}/loan/requests`,
    })
      .then((res) => {
        setRequests(res.data.data);
      })
      .catch((err) => {
        return {data: null};
      });
  };

  const onUpdate = async () => {
    getRequests();
    props.onUpdate();
  };

  useEffect(() => {
    getRequests();
  }, []);

  return (
    <>
      <div
        style={{
          marginTop: 20,
          maxHeight: "70vh",
          overflowY: "auto",
          overflowX: "hidden",
          paddingTop: 20,
        }}
      >
        {requests.length === 0 && (
          <Alert type="info" message="No loan requests found" />
        )}

        <Timeline
          items={requests.map((request) => {
            return {
              color: "green",
              children: (
                <>
                  <Descriptions title="" column={1}>
                    <Descriptions.Item label="Requested By">
                      {request.kikobaMember.member.firstName}{" "}
                      {request.kikobaMember.member.middleName}{" "}
                      {request.kikobaMember.member.lastName}
                      <span style={{position: "absolute", right: 0}}>
                        <Button
                          size="small"
                          style={{float: "right"}}
                          danger
                          onClick={() => handleApproversModal(request)}
                        >
                          Approvers
                        </Button>
                      </span>
                    </Descriptions.Item>
                    <Descriptions.Item label="Loan Amount">
                      <ThousandsFormatterComponent amount={request.amount} />
                    </Descriptions.Item>
                    <Descriptions.Item label="Requested On">
                      {moment(request.createdAt).format("LLL")}
                    </Descriptions.Item>
                  </Descriptions>

                  <div
                    style={{display: "flex", justifyContent: "space-between"}}
                  >
                    <LoanRequestApproveCheck
                      request={request}
                      onUpdate={onUpdate}
                    />
                  </div>

                  <Divider style={{backgroundColor: "orange"}} />
                </>
              ),
            };
          })}
        />
      </div>

      <Drawer
        title="Approvers"
        placement="right"
        width={"25vw"}
        destroyOnClose={true}
        onClose={() => setApproversModal(false)}
        open={approversModal}
        footer={[]}
      >
        <KikobaLoanRequestApproversComponent
          loan={request}
          onUpdate={onUpdate}
        />
      </Drawer>
    </>
  );
};
