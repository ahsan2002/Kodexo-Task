import { useFormik } from 'formik';
import * as yup from 'yup';
import axios from 'axios'
import { useState } from "react";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


let baseUrl = ""
if (window.location.href.split(":")[0] === "http") {
  baseUrl = "http://localhost:5001";

}


function Signup() {
  const [result, setResult] = useState("");
  const [passwordShown, setPasswordShown] = useState(false);

  const togglePassword = () => {
    // When the handler is invoked
    // inverse the boolean state of passwordShown
    setPasswordShown(!passwordShown);
  };


  const myFormik = useFormik({
    initialValues: {
      firstName: '',
      lastName: '',
      Email: '',
      Password: '',
      confirmPassword: ''
    },
    validationSchema:
      yup.object({
        firstName: yup
          .string('Enter your product name')
          .required('first name is required')
          .min(3, "please enter more then 3 characters ")
          .max(10, "please enter within 20 characters "),

        lastName: yup
          .string('Enter your product name')
          .required('last name is required')
          .min(3, "please enter more then 3 characters ")
          .max(10, "please enter within 20 characters "),

        Email: yup
          .string('Enter your email')
          .email("enter valid email address")
          .required('email is required'),

        Password: yup
          .string('Enter your password')
          .required('password is required')
          .min(6, "please enter more then 3 characters "),

        confirmPassword: yup
          .string('Enter your password again')
          .required("Please re-enter your password")
          .oneOf([yup.ref("Password")], "Passwords do not match")
      }),
    onSubmit: (values) => {
      console.log("values: ", values);
      myFormik.resetForm({ values: '' });



      axios.post(`${baseUrl}/api/v1/register`, {
        firstName: values.firstName,
        lastName: values.lastName,
        email: values.Email,
        password: values.Password
      })
        .then(response => {
          console.log("response: ", response.data);
          toast(`${response.data.message}`);

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
          <h1 className="heading">SignUp</h1>
        </div>
        <form className='inputf' onSubmit={myFormik.handleSubmit}>
          <input
            id="firstName"
            placeholder="First Name"
            value={myFormik.values.firstName}
            onChange={myFormik.handleChange}
          />
          {
            (myFormik.touched.firstName && Boolean(myFormik.errors.firstName)) ?
              <span style={{ color: "red" }}>{myFormik.errors.firstName}</span>
              :
              null
          }
          <br />
          <input
            id="lastName"
            placeholder="Last Name"
            value={myFormik.values.lastName}
            onChange={myFormik.handleChange}
          />
          {
            (myFormik.touched.lastName && Boolean(myFormik.errors.lastName)) ?
              <span style={{ color: "red" }}>{myFormik.errors.lastName}</span>
              :
              null
          }

          <br />
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
          <input
            id="confirmPassword"
            placeholder="Confirm Password"
            type={passwordShown ? "text" : "password"}
            value={myFormik.values.confirmPassword}
            onChange={myFormik.handleChange}
          />
          {
            (myFormik.touched.confirmPassword && Boolean(myFormik.errors.confirmPassword)) ?
              <span style={{ color: "red" }}>{myFormik.errors.confirmPassword}</span>
              :
              null
          }
          <br />
          <div className="button">
            <button type="submit"> Submit </button>
          </div>

        </form>

        <br />
        <br />

      </div>


      <p>{result}</p>



    </>

  );
}

export default Signup;