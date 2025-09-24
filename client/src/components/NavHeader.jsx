import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Image from 'react-bootstrap/Image';
import logo from '../assets/logo.png';
import { CgProfile } from "react-icons/cg";
import { NavLink } from 'react-router';
import { useAuth } from '../contexts/AuthContext';

export default function NavHeader() {

    const { isAuthenticated, user } = useAuth();

    return (
        <Navbar bg="dark" data-bs-theme="dark">
        <Container>
          <Navbar.Brand><Image src={logo} thumbnail fluid width={80} height={75}/></Navbar.Brand>
          <Nav className="me-auto">
            <NavLink to="/" className={({ isActive }) =>
                                isActive ? "nav-link active-link" : "nav-link"
                            }>Home</NavLink>
            <NavLink to="/instructions" className={({ isActive }) =>
                                isActive ? "nav-link active-link" : "nav-link"
                            }>Instructions</NavLink>
          </Nav>
          {isAuthenticated ? (
            <NavLink to={`/profile/${user.id}`}>
              <CgProfile size={30} color="white" />
            </NavLink>
          ) : null}
        </Container>
      </Navbar>
    )
}

