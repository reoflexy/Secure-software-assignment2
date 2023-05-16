import React,{useEffect,useState} from 'react'
import axios from 'axios'
import {useNavigate} from 'react-router-dom'
import {Button, Accordion,Form, Navbar,NavDropdown,Nav,Container,Card, Row,Col} from 'react-bootstrap'

export default function Dashboard() {
  const [posts,setPosts] = useState([]);
  const navigate = useNavigate();

  const initialFormData = Object.freeze({
    email: "",
    search: "",
    password: "",
    password2: ""
  });

  const [formData, setFormData] = useState(initialFormData);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [disabled, setDisabled] = useState(false);
  const [loading, setLoading] = useState(false);
  let regexEmail = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;


  useEffect(() => {
    const headers = {
      'Access-Control-Allow-Origin' : '*',
      'Access-Control-Allow-Credentials':true,
      'Access-Control-Allow-Methods':'GET,PUT,POST,DELETE,PATCH,OPTIONS',
    }

     axios.get('http://localhost:5000/api/blogsite/posts',
    {headers})
    .then((response) => {
      //console.log(response.data);
      setPosts(response.data)
      //navigate to dashboard
      
      //navigate('/otp',{state:{username: formData.username, password: formData.password} })
    }, (error) => {
      console.log(error);
     // return setError(error);
    });
  },[])


  const search = async (e) => {
    e.preventDefault();
    setError('');
    if (formData.search == "" || formData.search == null ) {
      window.scrollTo(0,0)
    return setError('Enter Valid search!');
    }

    //clean against sql injection
    

    const headers = {
      'Access-Control-Allow-Origin' : '*',
      'Access-Control-Allow-Credentials':true,
      'Access-Control-Allow-Methods':'GET,PUT,POST,DELETE,PATCH,OPTIONS',
    }

    axios.get('http://localhost:5000/api/blogsite/search', {
      params: {
        search: formData.search,
      }
    },{headers})
    .then((response) => {
      console.log(response);
      //navigate to dashboard
      setPosts(response.data.data)
      //navigate('/otp',{state:{username: formData.username, password: formData.password} })
    }, (error) => {
      console.log(error);
     // return setError(error);
    });


  };

  const toDetails = (postObject) => {
    navigate('/postdetails',{state:{post: postObject } })
  }

  function handleChange(e) {
    //console.log('working')
      setFormData({...formData,[e.target.name]: e.target.value})
      // alert('working')
      console.log(formData)
      
  }

  const logout = () => {
sessionStorage.removeItem('token')
sessionStorage.removeItem('user')
navigate('/',{replace: true})
  }


return(
<>
<div id='background'>
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
             <Nav.Link href="/">Home</Nav.Link>
            <Nav.Link href="#">Contact</Nav.Link>
            <Nav.Link href="/register">Register</Nav.Link>
            <Nav.Link onClick={logout}>Logout</Nav.Link>
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
          <Form className="d-flex">
            <Form.Control
              type="search"
              placeholder="Search"
              className="me-2"
              aria-label="Search"
              name='search'
              onChange={handleChange}
            />
            <Button onClick={search} variant="outline-success">Search</Button>
          </Form>
        </Navbar.Collapse>
      </Container>
    </Navbar>

    <Nav className="justify-content-center" activeKey="/home">
        <Nav.Item>
          <Nav.Link href="/post">Add post</Nav.Link>
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

      <Nav className="justify-content-left" activeKey="/home">
        <Nav.Item>
          <Nav.Link href="/home">{sessionStorage.getItem('user')}</Nav.Link>
        </Nav.Item>
       
      </Nav>
    <Container fluid>
            <Row>

        {posts.length > 0 && posts.map((item,index) => {
          return(
            <Col key={index} lg={4} sm={6} xs={12} md={6}>

    <Card className='mt-2' style={{ width: '100%' }}>
      <Card.Body>
        <Card.Title>{item.title} </Card.Title>
        <Card.Subtitle className="mb-2 text-muted">{item.created_by} </Card.Subtitle>
        <Card.Text>
        {item.body}
        </Card.Text>
        <Card.Link onClick={() => toDetails(item)} >Read more...</Card.Link>
      </Card.Body>
    </Card>
          
            </Col>
          )
        }) }
            
            


            </Row>
        
        </Container>
    <FooterHome/>
</div>
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


