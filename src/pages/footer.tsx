/* eslint-disable jsx-a11y/anchor-is-valid */
import {Row, Col, Card, Typography, Tag, message} from "antd";
import ColorModeComponent from "../components/colorMode";

const {Text} = Typography;

//a functional component
const AppFooter = () => {
  return (
    <Row
      style={{
        bottom: 0,
        left: 0,
        right: 0,
      }}
    >
      <Col span={24}>
        <Card
          style={{
            display: "flex",
            justifyContent: "center",
          }}
        >
          {/* define menu for privacy policies, cookies , contacts, services */}
          <a onClick={() => message.info("Privacy Policies")}>
            <Tag style={{fontSize: 16, padding: 3}} color="green">
              Privacy Policies
            </Tag>
          </a>
          <a onClick={() => message.info("Cookies")}>
            <Tag style={{fontSize: 16, padding: 3}} color="green">
              Cookies
            </Tag>
          </a>
          <a onClick={() => message.info("About")}>
            <Tag style={{fontSize: 16, padding: 3}} color="green">
              About
            </Tag>
          </a>
          <a onClick={() => message.info("Services")}>
            <Tag style={{fontSize: 16, padding: 3}} color="green">
              Services
            </Tag>
          </a>
          <a onClick={() => message.info("Help")}>
            <Tag style={{fontSize: 16, padding: 3}} color="green">
              Help
            </Tag>
          </a>

          <span
            style={{
              position: "absolute",
              right: 20,
            }}
          >
            <ColorModeComponent />
          </span>
        </Card>
        <Card>
          <div style={{display: "flex", justifyContent: "center"}}>
            <Text>
              <span style={{fontWeight: "bold"}}>Powered by</span>{" "}
              <a href="https://olbongo.co.tz" target="_blank" rel="noreferrer">
                <span style={{color: "red"}}>Olbongo Inc.</span>
              </a>
            </Text>
          </div>
        </Card>
      </Col>
    </Row>
  );
};

export default AppFooter;
