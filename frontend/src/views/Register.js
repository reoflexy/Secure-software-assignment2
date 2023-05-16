import React,{useState, useEffect} from 'react';
import {useNavigate} from 'react-router-dom'
import {Button, Accordion,Form, FormControl, FormGroup, Navbar,NavDropdown,Nav,Container,Card, Row,Col} from 'react-bootstrap'
import axios from 'axios'

export default function Register() {
  const navigate = useNavigate();

  const getCsrfToken = async () => {
    const { data } = await axios.get("http://localhost:5000/api/csrf-token");
    // log data received
    console.log("CSRF", data);
    // set default header with axios
    axios.defaults.headers["X-CSRF-TOKEN"] = data.csrfToken;
  };

  useEffect(() => {
    getCsrfToken();
  }, []);

  const initialFormData = Object.freeze({
    email: "",
    username: "",
    password: "",
    password2: ""
  });

  const [formData, setFormData] = useState(initialFormData);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [disabled, setDisabled] = useState(false);
  const [loading, setLoading] = useState(false);
  let regexEmail = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  function handleChange(e) {
    //console.log('working')
      setFormData({...formData,[e.target.name]: e.target.value.trim()})
      // alert('working')
      console.log(formData)
      
  }

  const HandleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (formData.username == "" || formData.username == null ) {
      window.scrollTo(0,0)
    return setError('Enter Valid username!');
    }
  
    if(formData.email == "" || (!regexEmail.test(formData.email))){
      window.scrollTo(0,0)
      return setError('Enter Valid Email!');
    }

    if(formData.password.length < 8){
      window.scrollTo(0,0)
      return setError('Password must be 8 chracters minimum!');
    }
  
    if(formData.password != formData.password2){
      window.scrollTo(0,0)
      return setError('Password Mismatch!');
    }

    

    const headers = {
      'Access-Control-Allow-Origin' : '*',
      'Access-Control-Allow-Credentials':true,
      'Access-Control-Allow-Methods':'GET,PUT,POST,DELETE,PATCH,OPTIONS',
    }

    axios.post('http://localhost:5000/api/blogsite/register', {
      username: formData.username,
      email: formData.email ,
      password:  formData.password,
    },{headers})
    .then((response) => {
      console.log(response);
      //navigate to dashboard
      if(response.data.message == 'success'){
        setFormData(initialFormData)
        sessionStorage.setItem('token',response.data.token)
        sessionStorage.setItem('user',formData.username)
        navigate('/dashboard',{replace: true})
      }
      else{
        setError(response.response.data.message)
      }
      
    }, (error) => {
      console.log(error);
     // return setError(error);
    });


  };


  const NavbarHome = () => {
    return(
        <>
        <Navbar bg="light" expand="lg">
      <Container fluid>
        <Navbar.Brand href="#">iAugust</Navbar.Brand>
        <Navbar.Toggle aria-controls="navbarScroll" />
        <Navbar.Collapse id="navbarScroll">
          <Nav
            className="me-auto my-2 my-lg-0"
            style={{ maxHeight: '100px' }}
            navbarScroll
          >
            <Nav.Link href="#action1">Home</Nav.Link>
            <Nav.Link href="#action2">Contact</Nav.Link>
            <Nav.Link href="#action3">Register</Nav.Link>
            <Nav.Link href="#action4">Login</Nav.Link>
            <NavDropdown title="Services" id="navbarScrollingDropdown">
              <NavDropdown.Item href="#action3">1</NavDropdown.Item>
              <NavDropdown.Item href="#action4">
                2
              </NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item href="#action5">
               3
              </NavDropdown.Item>
            </NavDropdown>
            {/* <Nav.Link href="#" disabled>
              Link
            </Nav.Link> */}
          </Nav>
          
        </Navbar.Collapse>
      </Container>
    </Navbar>

    <Nav className="justify-content-center" activeKey="/home">
        <Nav.Item>
          <Nav.Link href="/home">News</Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link eventKey="link-1">Events</Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link eventKey="link-2">Entertainment</Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link eventKey="link-3" >
            Lifestyle
          </Nav.Link>
        </Nav.Item>
      </Nav>
    </>
    )
}

const FooterHome = () => {
  return (
    <>
     <Navbar fixed='bottom'>
      <Container>
        <Navbar.Brand href="#home">iAugust blog</Navbar.Brand>
        <Navbar.Toggle />
        <Navbar.Collapse className="justify-content-end">
          <Navbar.Text>
            copyright: <a href="#login">2023</a>
          </Navbar.Text>
        </Navbar.Collapse>
      </Container>
    </Navbar>
    </>
  )
}


return(
<>
<div id='background'>
    <NavbarHome />
    <Container style={{ display: 'flex', justifyContent: 'center'}} fluid>
          
             <Form style={{width: '50%'}}>
              <h3 className='mt-3' style={{textAlign: 'center'}}>Register</h3>
              <h6 className='mt-3' style={{textAlign: 'center', color:'red'}}>{error}</h6>
              <Form.Group className="mb-3" controlId="formBasicText" >
        <Form.Label>Username</Form.Label>
        <Form.Control type="text" placeholder="Enter username"  name='username' onChange={handleChange} />
      </Form.Group>
      <Form.Group className="mb-3" controlId="formBasicEmail">
        <Form.Label>Email address</Form.Label>
        <Form.Control type="email" placeholder="Enter email"  name='email' onChange={handleChange} />
        <Form.Text className="text-muted">
          We'll never share your email with anyone else.
        </Form.Text>
      </Form.Group>

      <Form.Group className="mb-3" controlId="formBasicPassword">
        <Form.Label>Password</Form.Label>
        <Form.Control type="password" placeholder="Password"  name='password' onChange={handleChange} />
      </Form.Group>

      <Form.Group className="mb-3" controlId="formBasicPassword">
        <Form.Label>Confirm Password</Form.Label>
        <Form.Control type="password" placeholder="Password"  name='password2' onChange={handleChange}/>
      </Form.Group>
      
      <Button variant="primary" type="submit" disabled={disabled} onClick={HandleSubmit}>
        Submit
      </Button>
    </Form>
        
        </Container>
    <FooterHome/>
</div>
</>

)
}


