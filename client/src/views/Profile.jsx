import GameHistory from '../components/GameHistory';
import { useAuth } from '../contexts/AuthContext';
import MyButton from '../components/MyButton';
import { useNavigate } from 'react-router';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

export default function Profile() {
    const { user, logout, } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    }

    return (
        <Container
          className="mt-5 p-4 shadow rounded"
          style={{
            background: "linear-gradient(135deg, #f8fafc 0%, #e0e7ef 100%)",
            maxWidth: 700,
          }}
        >
          <h1 className="mb-4 text-center" style={{ fontWeight: 700, color: "#343a40" }}>
            👤 Profile
          </h1>
          <Row className="mb-4 justify-content-center align-items-center gap-3">
            <Col xs="auto">
              <div
                className="d-flex flex-column align-items-center p-3 rounded"
                style={{
                  background: "#fff",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
                  minWidth: 220,
                }}
              >
                <p className="mb-1" style={{ fontWeight: 600 }}>
                  {user.name}
                </p>
                <p className="mb-0" style={{ color: "#495057" }}>
                  <b>Email:</b> {user.email}
                </p>
              </div>
            </Col>
          </Row>
          <div className="mb-4">
            <h2 className="text-center mb-3" style={{ color: "#0d6efd" }}>
              🕹️ Game History
            </h2>
            <GameHistory userId={user.id} />
          </div>
          <div className="d-flex justify-content-center mt-4">
            <MyButton
              text="🚪 Logout"
              variant="dark"
              onClick={handleLogout}
              style={{ minWidth: 120, fontWeight: 600, fontSize: "1.1rem" }}
            />
          </div>
        </Container>
    );
}