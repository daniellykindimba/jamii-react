import {PlusOutlined, SearchOutlined} from "@ant-design/icons";
import {Button, Card, Col, Form, Input, List, Modal, Row, Tag} from "antd";
import {useState, useEffect} from "react";
import {useParams} from "react-router-dom";
import simpleRestProvider from "../../api";
import configs from "../../configs";
import {KikobaData, KikobaMemberData} from "../../interfaces";
import {KikobaMemberAddInitialShareForm} from "./form/kikoba_member_add_initial_shares";

interface searchFormData {
  key: string;
}

interface Props {
  kikoba: KikobaData | any;
  onUpdate?: any;
}

export const KikobaMembersToAddInitialSharesComponent: React.FC<Props> = (
  props: Props
) => {
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [members, setMembers] = useState<KikobaMemberData[]>([]);
  const [member, setMember] = useState<KikobaMemberData | null>(null);
  const [searchForm] = Form.useForm<searchFormData>();
  const [addShareModal, setAddShareModal] = useState(false);
  let {id} = useParams<{id: string}>();

  const getMembers = async (
    start: number,
    key: string = "",
    limit: number = 50
  ) => {
    setLoading(true);
    const {data} = await simpleRestProvider.custom!<KikobaMemberData | any>({
      url:
        configs.apiUrl +
        `/kikoba/${id}/members?page=${start}&limit=${limit}&q=${key}`,
      method: "get",
    })
      .then((res) => {
        return res;
      })
      .catch((error) => {
        return {data: null};
      });
    if (data) {
      setTotal(data.pagination.total);
      setPage(data.pagination.page);
      setLimit(data.pagination.limit);
      setMembers(data.data);
    }
    setLoading(false);
  };

  const handleAddingShare = (member: KikobaMemberData) => {
    setMember(member);
    setAddShareModal(true);
  };

  useEffect(() => {
    getMembers(1);
  }, []);

  return (
    <>
      <Row style={{marginTop: 30}}>
        <Col span={24}>
          <Form<searchFormData>
            layout="vertical"
            form={searchForm}
            onFinish={(values) => {
              getMembers(1, values.key, 25);
            }}
          >
            <Form.Item name="key">
              <Input
                size="large"
                placeholder="Search ..."
                prefix={<SearchOutlined />}
                autoComplete="off"
                allowClear
              />
            </Form.Item>
          </Form>
        </Col>
      </Row>
      <Card 
      style={{
        maxHeight: "65vh",
        overflowY: "auto",
      }}>
        <List
          bordered
          dataSource={members}
          renderItem={(m) => (
            <List.Item
              actions={[
                <Button
                  icon={<PlusOutlined />}
                  onClick={() => handleAddingShare(m)}
                ></Button>,
              ]}
            >
              {m.contributionName && <>{m.contributionName}</>}
              {!m.contributionName && (
                <>
                  {m.member.firstName} {m.member.middleName} {m.member.lastName}
                  {m.nickname && (
                    <Tag color="green" style={{marginLeft: 10}}>
                      {m.nickname}
                    </Tag>
                  )}
                </>
              )}
            </List.Item>
          )}
        />
      </Card>

      <Modal
        title={
          <>
            <span>Adding Initial Share for</span>
            <Tag color="green" style={{marginLeft: 5}}>
              {member?.contributionName && <>{member?.contributionName}</>}
              {!member?.contributionName && (
                <>
                  {member?.member.firstName} {member?.member.middleName}{" "}
                  {member?.member.lastName}
                </>
              )}
            </Tag>
          </>
        }
        width={"25vw"}
        destroyOnClose={true}
        open={addShareModal}
        onOk={() => setAddShareModal(false)}
        onCancel={() => setAddShareModal(false)}
        footer={[]}
      >
        <KikobaMemberAddInitialShareForm
          kikoba={props.kikoba}
          member={member}
          onFinish={props.onUpdate}
        />
      </Modal>
    </>
  );
};
