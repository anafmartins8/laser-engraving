import { Container, Row, Col } from "react-bootstrap";
import { BsInfoLg } from "react-icons/bs";

function Info() {
  return (
    <div className="right-component">
      <div className="icon-title">
        <BsInfoLg />
      </div>
      <div className="icon-content">
        <Container fluid>
          <Row>
            <Col className="centered">
              In case of a non-identifiable character or in case of a non-valid
              result, introduce:
            </Col>
          </Row>
          <Row className="ml-5">
            <Col md="auto" className="centered">
              $
            </Col>
            <Col className="pl-0">
              -<span className="ml-3" />
              Continental logo
            </Col>
          </Row>
          <Row className="ml-5">
            <Col md="auto" className="centered">
              !
            </Col>
            <Col className="pl-0">
              {" "}
              -<span className="ml-3" />
              Character “C” together with character “o”
            </Col>
          </Row>
          <Row className="ml-5">
            <Col md="auto" className="centered">
              @
            </Col>
            <Col className="pl-0">
              -<span className="ml-3" />
              Character “/“
            </Col>
          </Row>
          <Row className="ml-5">
            <Col md="auto" className="centered">
              #
            </Col>
            <Col className="pl-0">
              -<span className="ml-3" />
              Non-identifiable character
            </Col>
          </Row>
        </Container>
      </div>
    </div>
  );
}

export default Info;
