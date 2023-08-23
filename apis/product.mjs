import express from 'express';
import { userModel, productModel } from './../dbRepo/models.mjs'
import mongoose from 'mongoose';

const router = express.Router();


router.post('/transactions', (req, res) => {

    const body = req.body;

    if ( // validation`
        !body.name
        || !body.price
        || !body.description
    ) {
        res.status(400).send({
            message: "required parameters missing",
        });
        return;
    }

    console.log(body.name)
    console.log(body.price)
    console.log(body.description)

    // products.push({
    //     id: `${new Date().getTime()}`,
    //     name: body.name,
    //     price: body.price,
    //     description: body.description
    // });


    productModel.create({
        name: body.name,
        price: body.price,
        description: body.description,
        owner: new mongoose.Types.ObjectId(body.token._id)
    },
        (err, saved) => {
            if (!err) {
                console.log(saved);

                res.send({
                    message: "transaction added successfully"
                });
            } else {
                res.status(500).send({
                    message: "server error"
                })
            }
        })

})

router.get('/alltransactions', (req, res) => {
    const userId = new mongoose.Types.ObjectId(req.body.token._id);
    productModel.find({owner:userId},{},
        {
            sort: { "_id": -1 },
            limit: 100,
            skip: 0
        },
         (err, data) => {
        if (!err) {
            res.send({
                message: "got all transactions successfully",
                data: data
            })
        } else {
            res.status(500).send({
                message: "server error"
            })
        }
    });
})

// router.get('/product/:id', (req, res) => {

//     const id = req.params.id;

//     // let isFound = false;
//     // for (let i = 0; i < products.length; i++) {

//     //     if (products[i].id === id) {
//     //         res.send({
//     //             message: `get product by id: ${products[i].id} success`,
//     //             data: products[i]
//     //         });

//     //         isFound = true
//     //         break;
//     //     }
//     // }
//     // if (isFound === false) {
//     //     res.status(404)
//     //     res.send({
//     //         message: "product not found"
//     //     });
//     // }
//     // return;

//     productModel.findOne({ _id: id }, (err, data) => {
//         if (!err) {
//             if (data) {
//                 res.send({
//                     message: `get product by id: ${data._id} success`,
//                     data: data
//                 });
//             } else {
//                 res.status(404).send({
//                     message: "product not found",
//                 })
//             }
//         } else {
//             res.status(500).send({
//                 message: "server error"
//             })
//         }
//     });


// })

router.delete('/transaction/:id', (req, res) => {
    const id = req.params.id;

    // let isFound = false;
    // for (let i = 0; i < products.length; i++) {
    //     if (products[i].id === id) {
    //         products.splice(i, 1);
    //         res.send({
    //             message: "product deleted successfully"
    //         });
    //         isFound = true
    //         break;
    //     }
    // }
    // if (isFound === false) {
    //     res.status(404)
    //     res.send({
    //         message: "delete fail: product not found"
    //     });
    // }


    productModel.deleteOne({ _id: id }, (err, deletedData) => {
        console.log("deleted: ", deletedData);
        if (!err) {

            if (deletedData.deletedCount !== 0) {
                res.send({
                    message: "transaction has been deleted successfully",
                })
            } else {
                res.status(404);
                res.send({
                    message: "No transaction found with this id: " + id,
                });
            }
        } else {
            res.status(500).send({
                message: "server error"
            })
        }
    });

})

router.put('/transaction/:id', async (req, res) => {

    const body = req.body;
    const id = req.params.id;

    if ( // validation
        !body.name
        || !body.price
        || !body.description
    ) {
        res.status(400).send({
            message: "required parameters missing"
        });
        return;
    }

    console.log(body.name)
    console.log(body.price)
    console.log(body.description)

    // let isFound = false;
    // for (let i = 0; i < products.length; i++) {
    //     if (products[i].id === id) {

    //         products[i].name = body.name;
    //         products[i].price = body.price;
    //         products[i].description = body.description;

    //         res.send({
    //             message: "product modified successfully"
    //         });
    //         isFound = true
    //         break;
    //     }
    // }
    // if (!isFound) {
    //     res.status(404)
    //     res.send({
    //         message: "edit fail: product not found"
    //     });
    // }
    // res.send({
    //     message: "product added successfully"
    // });


    try {
        let data = await productModel.findByIdAndUpdate(id,
            {
                name: body.name,
                price: body.price,
                description: body.description
            },
            { new: true }
        ).exec();

        console.log('updated: ', data);

        res.send({
            message: "transaction modified successfully"
        });

    } catch (error) {
        res.status(500).send({
            message: "server error"
        })
    }

})
export default router