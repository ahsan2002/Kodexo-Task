import { useFormik } from 'formik';
import * as yup from 'yup';
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import Product from './Product';
import { useState,useContext } from 'react';
import { GlobalContext } from './context/Context';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


let baseUrl = ""
if (window.location.href.split(":")[0] === "http") {
  baseUrl = "http://localhost:5001";

}


function Login() {
  // const navi=useNavigate();
  const [passwordShown, setPasswordShown] = useState(false);
  let { state, dispatch } = useContext(GlobalContext);

  const togglePassword = () => {
    // When the handler is invoked
    // inverse the boolean state of passwordShown
    setPasswordShown(!passwordShown);
  };

  const myFormik = useFormik({
    initialValues: {
      Email: '',
      Password: '',
    },
    validationSchema:
      yup.object({
        Email: yup
          .string('Enter your email')
          .email("enter valid email address")
          .required('email is required'),

        Password: yup
          .string('Enter your password')
          .required('password is required')
          .min(6, "please enter more then 3 characters "),

      }),
    onSubmit: (values) => {
      console.log("values: ", values);
      myFormik.resetForm({ values: '' });

      axios.post(`${baseUrl}/api/v1/login`, {
        email: values.Email,
        password: values.Password
      })
        .then(response => {
          console.log("response: ", response.data);
          // navi("/Product");
          toast(`${response.data.message}`);
          setTimeout(() => {
            dispatch({
              type: 'USER_LOGIN',
              payload: response.data.profile
            }) 
          }, 3000);
        })

        .catch(err => {
          console.log("error: ", err);
          toast(`${err.response.data.message}`);
        })


    },
  });





  return (
    <>
    <ToastContainer />
      <div className='container'>
        <div className="header">
          <h1 className="heading">Login</h1>
        </div>
        <form className='inputf' onSubmit={myFormik.handleSubmit}>
          <input
            id="Email"
            placeholder="Email Address"
            value={myFormik.values.Email}
            onChange={myFormik.handleChange}
          />
          {
            (myFormik.touched.Email && Boolean(myFormik.errors.Email)) ?
              <span style={{ color: "red" }}>{myFormik.errors.Email}</span>
              :
              null
          }

          <br />
          <input
            id="Password"
            placeholder="Password"
            type={passwordShown ? "text" : "password"}
            value={myFormik.values.Password}
            onChange={myFormik.handleChange}
          />
          {
            (myFormik.touched.Password && Boolean(myFormik.errors.Password)) ?
            <span style={{ color: "red" }}>{myFormik.errors.Password}</span>
            :
            null
          }
          <br />
          <button className='myeye' type='button' onClick={togglePassword}>show password</button>

          <br />
          <div className="button">
            <button type="submit"> Submit </button>
          </div>

        </form>

        <br />
        <br />

      </div>




    </>

  );
}

export default Login;