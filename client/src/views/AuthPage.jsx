import Form from 'react-bootstrap/Form';
import MyButton from '../components/MyButton';
import Container from 'react-bootstrap/Container';
import { useAuth } from '../contexts/AuthContext';
import { useActionState } from 'react';
import { useNavigate } from 'react-router';


export default function AuthPage() {

  const { login } = useAuth();
  const navigate = useNavigate();

  const [form, formAction, isPending] = useActionState(
    async (prevState, formData) => {
        const email = formData.get('email');
        const password = formData.get('password');
        const {user, error} = await login(email, password);
        if (error) {
          return { ...prevState, error: error };
        }
        if(user) navigate(`/`);        
    },
    { email: '', password: '', error: '' }
  );

  return (
    <Container className="mt-5 d-flex justify-content-center">
      <div style={{ width: '400px' }} >
        <h3 className="text-center mb-4">Authenticate for a better experience!</h3>
        <Form action={formAction}>
          <Form.Group className="mb-3" controlId="formEmail">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              placeholder="Enter your email"
              name="email"
              required
              defaultValue={form.email}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Enter your password"
              name="password"
              required
              defaultValue={form.password}
            />
          </Form.Group>
        <div className="d-flex justify-content-center">
            <MyButton text="Login" variant="dark" type="submit" />
        </div>
          {form.error && <div className="text-danger text-center mb-2">Something went wrong during the authentication</div>}
          {isPending && <div className="text-center">Logging in...</div>}
        </Form>
      </div>
    </Container>
  );
}