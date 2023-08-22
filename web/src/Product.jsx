import { useFormik } from 'formik';
import * as yup from 'yup';
import axios from "axios";
import { useEffect, useState } from 'react';
import DeleteSharpIcon from '@mui/icons-material/DeleteSharp';
import EditSharpIcon from '@mui/icons-material/EditSharp';

let baseUrl = ""
if (window.location.href.split(":")[0] === "http") {
  baseUrl = "http://localhost:5001";

}

function Product() {

  const [products, setProducts] = useState([]);
  const [loadProduct, setLoadProduct] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [update, setupdate] = useState(false);


  const getAllProducts = async () => {
    try {
      const response = await axios.get(`${baseUrl}/api/v1/products`)
      console.log("response: ", response.data);

      setProducts(response.data.data)

    } catch (error) {
      console.log("error in getting all products", error);
    }
  }

  const deleteProduct = async (id) => {
    try {
      const response = await axios.delete(`${baseUrl}/api/v1/product/${id}`)
      console.log("response: ", response.data);

      setLoadProduct(!loadProduct)

    } catch (error) {
      console.log("error in getting all products", error);
    }
  }

  const editMode = (product) => {
    setupdate(true);
    setIsEditMode(!isEditMode)
    setEditingProduct(product)

    editFormik.setFieldValue("transactionName", product.name)
    editFormik.setFieldValue("amount", product.price)
    editFormik.setFieldValue("description", product.description)

  }

  useEffect(() => {

    getAllProducts()

  }, [loadProduct])


  const myFormik = useFormik({
    initialValues: {
      transactionName: '',
      amount: '',
      description: '',
    },
    validationSchema:
      yup.object({
        transactionName: yup
          .string('Enter your transaction name')
          .required('transaction name is required')
          .min(3, "please enter more then 3 characters ")
          .max(20, "please enter within 20 characters "),

        amount: yup
          .number('Enter your amount')
          .positive("enter positive amount")
          .required('amount is required'),

        description: yup
          .string('Enter your transaction Description')
          .required('transaction description is required')
          .min(3, "please enter more then 3 characters ")
          .max(500, "please enter within 20 characters "),
      }),
    onSubmit: (values) => {
      console.log("values: ", values);
      myFormik.resetForm({ values: '' });

      axios.post(`${baseUrl}/api/v1/product`, {
        name: values.transactionName,
        price: values.amount,
        description: values.description,
      })
        .then(response => {
          console.log("response: ", response.data);
          setLoadProduct(!loadProduct)

        })
        .catch(err => {
          console.log("error: ", err);
        })
    },
  });


  const editFormik = useFormik({
    initialValues: {
      transactionName: '',
      amount: '',
      description: '',
    },
    validationSchema:
    yup.object({
      transactionName: yup
        .string('Enter your transaction name')
        .required('transaction name is required')
        .min(3, "please enter more then 3 characters ")
        .max(20, "please enter within 20 characters "),

      amount: yup
        .number('Enter your amount')
        .positive("enter positive amount")
        .required('amount is required'),

      description: yup
        .string('Enter your transaction Description')
        .required('transaction description is required')
        .min(3, "please enter more then 3 characters ")
        .max(500, "please enter within 20 characters "),
    }),
    onSubmit: (values) => {
      console.log("values: ", values);
      setupdate(false);

      axios.put(`${baseUrl}/api/v1/product/${editingProduct._id}`, {
        name: values.transactionName,
        price: values.amount,
        description: values.description,
      })
        .then(response => {
          console.log("response: ", response.data);
          setLoadProduct(!loadProduct)

        })
        .catch(err => {
          console.log("error: ", err);
        })
    },
  });


  return (
    <>
      <div className='container'>
        <div class="header">
          <h1 class="heading">Make New Transaction</h1>
        </div>
        <form className='inputf' onSubmit={myFormik.handleSubmit}>
          <input
            id="transactionName"
            placeholder="Transaction Name"
            value={myFormik.values.transactionName}
            onChange={myFormik.handleChange}
          />
          {
            (myFormik.touched.transactionName && Boolean(myFormik.errors.transactionName)) ?
              <span style={{ color: "red" }}>{myFormik.errors.transactionName}</span>
              :
              null
          }

          <br />
          <input
            id="amount"
            placeholder="Amount"
            value={myFormik.values.amount}
            onChange={myFormik.handleChange}
          />
          {
            (myFormik.touched.amount && Boolean(myFormik.errors.amount)) ?
              <span style={{ color: "red" }}>{myFormik.errors.amount}</span>
              :
              null
          }

          <br />
          <input
            id="description"
            placeholder="Transaction Description"
            value={myFormik.values.description}
            onChange={myFormik.handleChange}
          />
          {
            (myFormik.touched.description && Boolean(myFormik.errors.description)) ?
              <span style={{ color: "red" }}>{myFormik.errors.description}</span>
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



      <div className='my' >
        <h1>All Transactions</h1 >
        <table>
          <tr>
            <th>Transaction Name</th>
            <th>Amount</th>
            <th>Transaction Description</th>
            <th></th>
          </tr>

          {products.map((eachProduct, i) => (
            <tr key={eachProduct._id}>
              <td>{eachProduct.name}</td>
              <td>{eachProduct.price}</td>
              <td>{eachProduct.description}</td>
              <td style={{
                display: "flex",
                gap: "20px"
              }}>
                <button onClick={() => {
                  deleteProduct(eachProduct._id)
                }}>
                  <DeleteSharpIcon style={{color:"red"}}/>
                </button>

                <button onClick={() => {
                  editMode(eachProduct)
                }}>
                  <EditSharpIcon style={{color:"green"}}/>
                </button>
              </td>

              {(isEditMode && editingProduct._id === eachProduct._id && update === true) ?
                <div>

                  <form onSubmit={editFormik.handleSubmit}>
                    <input
                      id="transactionName"
                      placeholder="Product Name"
                      value={editFormik.values.transactionName}
                      onChange={editFormik.handleChange}
                    />
                    <br /> <br />
                    {
                      (editFormik.touched.transactionName && Boolean(editFormik.errors.transactionName)) ?
                        <span style={{ color: "red" }}>  {editFormik.errors.transactionName}</span>
                        :
                        null
                    }

                    <br />
                    <input
                      id="amount"
                      placeholder="Product Price"
                      value={editFormik.values.amount}
                      onChange={editFormik.handleChange}
                    />
                    {
                      (editFormik.touched.amount && Boolean(editFormik.errors.amount)) ?
                        <span style={{ color: "red" }}>{editFormik.errors.amount}</span>
                        :
                        null
                    }

                    <br />
                    <input
                      id="description"
                      placeholder="Product Description"
                      value={editFormik.values.description}
                      onChange={editFormik.handleChange}
                    />
                    {
                      (editFormik.touched.description && Boolean(editFormik.errors.description)) ?

                        <span style={{ color: "red" }}> {editFormik.errors.description}</span>
                        :
                        null
                    }

                    <br />
                    <button type="submit"> Submit </button>
                  </form>

                </div> : null}



            </tr>



          ))}
        </table>
      </div>

    </>

  );
}

export default Product;
