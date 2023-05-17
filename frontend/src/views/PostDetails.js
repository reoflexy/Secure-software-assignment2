import React,{useState, useEffect} from 'react';
import {useLocation,useNavigate} from 'react-router-dom'
import {Button, Accordion,Form, FormControl, FormGroup, Navbar,NavDropdown,Nav,Container,Card, Row,Col} from 'react-bootstrap'
import axios from 'axios'

export default function PostDetails() {
  const {state} = useLocation();
  const navigate = useNavigate();
  const postObject = state
  console.log(postObject)

  const [csrfToken,setcsrfToken] = useState('')

  const getCsrfToken = async () => {
    const { data } = await axios.get("http://localhost:5000/api/csrf-token");
    // log data received
    console.log("CSRF", data);
    // set default header with axios
    axios.defaults.headers["X-CSRF-TOKEN"] = data.csrfToken;
    setcsrfToken(data.csrfToken)
  };

  useEffect(() => {
    
  }, []);

  const initialFormData = Object.freeze({
    email: "",
    comment: "",
    password: "",
    password2: ""
  });

  const [formData, setFormData] = useState(initialFormData);
  const [error, setError] = useState('');
  const [comments, setComments] = useState([])
  const [success, setSuccess] = useState('');
  const [disabled, setDisabled] = useState(false);
  const [loading, setLoading] = useState(false);
  let regexEmail = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  useEffect(() => {
    if(sessionStorage.getItem('user') == "" || sessionStorage.getItem('user') == null){
      navigate('/',{replace: true})
    }
    //console.log(postObject.post.id)
    getCsrfToken();

    const headers = {
      "X-CSRF-TOKEN": csrfToken,
      'Access-Control-Allow-Origin' : '*',
      'Access-Control-Allow-Credentials':true,
      'Access-Control-Allow-Methods':'GET,PUT,POST,DELETE,PATCH,OPTIONS',
    }

     axios.get('http://localhost:5000/api/blogsite/comments',
     {
      params: {
        postId: postObject.post.id,
      }
     },
    {headers})
    .then((response) => {
      //console.log(response.data.data);
      setComments(response.data.data)
      //navigate to dashboard
      
      //navigate('/otp',{state:{username: formData.username, password: formData.password} })
    }, (error) => {
      console.log(error);
     // return setError(error);
    });
  },[success])


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

  const HandleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('')
    if (formData.comment == "" || formData.comment == null ) {
      window.scrollTo(0,0)
    return setError('Enter Valid comment!');
    }

   
    //clean against sql injection
    

    const headers = {
      'authorization' : `Bearer ${sessionStorage.getItem('token')} `,
      'Access-Control-Allow-Origin' : '*',
      'Access-Control-Allow-Credentials':true,
      'Access-Control-Allow-Methods':'GET,PUT,POST,DELETE,PATCH,OPTIONS',
    }

    axios.post('http://localhost:5000/api/blogsite/addcomment', {
      username: postObject.post.created_by,
      message:  formData.comment,
      postId: postObject.post.id,
    },{headers})
    .then((response) => {
      //console.log(response.data);
      
      if(response.data.message == 'success'){
        setFormData(initialFormData)
        setSuccess('Comment Added')
      }
      else{
        setError('Comment failed')
      }
      
      //navigate to dashboard
      
      //navigate('/otp',{state:{username: formData.username, password: formData.password} })
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
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
    <Card className='m-2' style={{width: '50%'}}>
      <Card.Body>
      <h6 className='mt-3' style={{textAlign: 'center', }}>Creator- {postObject.post.created_by}</h6>

      </Card.Body>
    
    </Card>
    
    <Card className='m-2' style={{width: '50%'}}>
      <Card.Body>
        <h6 className='mt-3' style={{textAlign: 'center',}}>message -  {postObject.post.body}</h6>
      </Card.Body>
    
    </Card>
    
    <h3 className='mt-3' style={{textAlign: 'center'}}>Comments</h3>

    {
comments.map((item,index) => {
  return(
    <h6 key={index} className='m-3' style={{textAlign: 'left', }}> {item.created_by} - {item.body} </h6>
  )
})
    }

    </div>
    

    <Container style={{ display: 'flex', justifyContent: 'center'}} fluid>

    
          
             <Form style={{width: '50%'}}>
              <h3 className='mt-3' style={{textAlign: 'center'}}>Add comment</h3>
              <h6 className='mt-3' style={{textAlign: 'center', color:'red'}}>{error}</h6>
              <h3 className='mt-3' style={{textAlign: 'center', color:'green'}}>{success}</h3>

              <Form.Group className="mb-3" controlId="formBasicText">
        <Form.Label>Content</Form.Label>
        <Form.Control as="textarea" rows={3} type="text" value={formData.comment} placeholder="Type Comment"  name='comment' onChange={handleChange} />
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


