/* eslint-disable jsx-a11y/anchor-is-valid */
import {Breadcrumb, Modal, Table, Tag, message} from "antd";
import {useEffect, useState} from "react";
import {Link} from "react-router-dom";
import {KikobaLoanData} from "../../interfaces";
import simpleRestProvider from "../../api";
import configs from "../../configs";
import {KikobaLoanRequestApproversComponent} from "../components/kikoba_loan_request_approvers_status";
import {CurrencyFormatter} from "../../components/currency/currency_formatter";

interface Props {}

export const ClientLoans: React.FC<Props> = (props: Props) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [loans, setLoans] = useState<KikobaLoanData[]>([]);
  const [loan, setLoan] = useState<KikobaLoanData | null>(null);
  const [approvalModal, setApprovalModal] = useState<boolean>(false);

  const columns = [
    {
      title: "Kikoba Name",
      dataIndex: "kikobaName",
      key: "kikobaName",
      render: (_: any, record: KikobaLoanData) => <>{record.kikoba.name}</>,
    },
    {
      title: "Loan Amount",
      dataIndex: "loanAmount",
      key: "loanAmount",
      render: (_: any, record: KikobaLoanData) => (
        <>
          <CurrencyFormatter amount={record.amount} currency="TZS" />
        </>
      ),
    },
    {
      title: "Paid Loan Amount",
      dataIndex: "paidLoanAmount",
      key: "paidLoanAmount",
      render: (_: any, record: KikobaLoanData) => (
        <>
          <CurrencyFormatter amount={record.paidAmount} currency="TZS" />
        </>
      ),
    },
    {
      title: "Approved",
      key: "approved",
      render: (_: any, record: KikobaLoanData) => (
        <>
          <a
            onClick={() => {
              handleApprovalModal(record);
            }}
          >
            {record.isApproved ? (
              <Tag color="green">Approved</Tag>
            ) : (
              <Tag color="red">Pending</Tag>
            )}
          </a>
        </>
      ),
    },
  ];

  const getLoans = async (
    key: string = "",
    page: number = 1,
    pageSize: number = 25
  ) => {
    setLoading(true);
    const data = await simpleRestProvider.custom!({
      method: "get",
      url:
        configs.apiUrl +
        `/kikobas/me/all/loans?page=${page}&limit=${pageSize}&q=${key}`,
    })
      .then((res) => {
        return res;
      })
      .catch((err) => {
        message.error("Error in getting loans");
        return {data: null};
      });
    if (data.data) {
      setLoans(data.data.data);
    }
    setLoading(false);
  };

  const handleApprovalModal = (loan: KikobaLoanData) => {
    setLoan(loan);
    setApprovalModal(true);
  };

  useEffect(() => {
    getLoans();
  }, []);

  return (
    <>
      <Breadcrumb
        separator=">"
        items={[
          {
            title: <Link to={"/home"}>Home</Link>,
          },
          {
            title: "My Loans",
          },
        ]}
      />
      <Table
        size="small"
        loading={loading}
        dataSource={loans}
        columns={columns}
      />

      <Modal
        title="Loan Approvers"
        open={approvalModal}
        width={"40vw"}
        onOk={() => setApprovalModal(false)}
        onCancel={() => setApprovalModal(false)}
        footer={[]}
      >
        <KikobaLoanRequestApproversComponent
          viewOnly={true}
          loan={loan}
          onUpdate={() => {}}
        />
      </Modal>
    </>
  );
};
