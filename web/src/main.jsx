import React from 'react';
import { useState, useContext, useEffect } from 'react';
import { Routes, Route } from "react-router-dom";
import axios from 'axios';
import Navbar from './Navbar';
import Mynavbar from './Mynavbar';
import Login from './Login';
import Signup from './Signup';
import Product from './Product';
import { GlobalContext } from './context/Context';

const Main = () => {
    let { state, dispatch } = useContext(GlobalContext);


console.log("state",state);


    useEffect(() => {

        let baseUrl = ""
        if (window.location.href.split(":")[0] === "http") {
            baseUrl = "http://localhost:5001";

        }

        const getProfile = async () => {

            try {
                let response = await axios.get(`${baseUrl}/api/v1/profile`, {
                    withCredentials: true
                })

                console.log("response: ", response);


                dispatch({
                    type: 'USER_LOGIN',
                    payload:response.data
                })
            } catch (error) {

                console.log("axios error: ", error);

                dispatch({
                    type: 'USER_LOGOUT'
                })
            }



        }
        getProfile();

    }, [])

    useEffect(() => {

        // Add a request interceptor
        axios.interceptors.request.use(function (config) {
          // Do something before request is sent
          config.withCredentials = true;
          return config;
        }, function (error) {
          // Do something with request error
          return Promise.reject(error);
        });
    
        // Add a response interceptor
        axios.interceptors.response.use(function (response) {
          // Any status code that lie within the range of 2xx cause this function to trigger
          // Do something with response data
          return response;
        }, function (error) {
          // Any status codes that falls outside the range of 2xx cause this function to trigger
          // Do something with response error
          if (error.response.status === 401) {
            dispatch({
              type: 'USER_LOGOUT'
            })
          }
          return Promise.reject(error);
        });
      }, [])



    return (
        <>
            {
                (state.isLogin === true) ?
                    <Mynavbar />
                    : null
            }

            {

                (state.isLogin === false) ?
                    <Navbar />
                    : null
            }

            {

                (state.isLogin === true) ?

                    <Routes>
                        <Route path="/" element={<Product />} />
                    </Routes>
                    : null
            }

            {
                (state.isLogin === false) ?

                    <Routes>
                        <Route path="/" element={<Login />} />
                        <Route path="/signup" element={<Signup />} />
                        {/* <Route path="/product" element={<Product />} /> */}
                    </Routes>
                    : null
            }



            {(state.isLogin === null) ?

                <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: '100vh' }}>
                    <h1>Loading..........</h1>
                </div>

                : null}

        </>
    )
}

export default Main