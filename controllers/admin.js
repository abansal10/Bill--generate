const Bill = require("../models/bill");
const createInvoice = require("../util/invoice");
const randomUser = require("../util/randomUser");
const jwt = require("jsonwebtoken");
const path = require("path");
const fs= require('fs')
exports.login = (req, res, next) => {
  res.render("admin/login", {
    pageTitle: "Add Product",
    path: "/login",
    editing: false,
    message: 0,
  });
};

exports.getBill = (req, res, next) => {
  const authcookie = req.cookies.authcookie;

  //verify token which is in cookie value
  jwt.verify(authcookie, "AkashKumar", (err, data) => {
    if (err) {
      console.log(err);
    } else if (data) {
      console.log(data);
    }
  });
  res.render("admin/generate-bill", {
    pageTitle: "Add Product",
    path: "/bill",
    editing: false,
  });
};

exports.getBillDaily = (req, res, next) => {
  res.render("admin/daily-bill", {
    pageTitle: "Daily Bill",
    path: "/daily",
    records: [],
    editing: false,
  });
};

exports.getBillMonthly = (req, res, next) => {
  res.render("admin/monthly-bill", {
    pageTitle: "Monthly Bill",
    path: "/monthly",
    editing: false,
  });
};

exports.postAddBill = async (req, res, next) => {
  let address = req.body.address;
  const price = req.body.price;
  const quantity = req.body.quantity;
  let name = req.body.name;
  const date = req.body.date;
  if (!name || !address) {
    name = randomUser().name;
    address = randomUser().address;
  }
  if (!date) {
    res.send("No date selected");
  }
  const bill = new Bill({
    address: address,
    price: price,
    quantity: quantity,
    name: name,
    date: date,
  });
  Bill.create(bill)
    .then((result) => {
      if (result) {
        const invoiceData = {
          shipping: {
            name: result.name,
            address: result.address,
            date: new Date(result.date),
          },
          items: [
            {
              quantity: result.quantity,
              amount: result.price,
            },
          ],
          invoice_nr: result.invoice,
        };

        const filename = "invoice_" + result.invoice + ".pdf";
        console.log(filename)
        createInvoice(invoiceData, filename,(created)=>{
          setTimeout(() => {
              try {
                if (fs.existsSync("D://Node-js Practice//Bill- generate//"+filename)) {
                console.log("fileExirs")
                if(created==='created'){
                  res.setHeader("Content-Type", "text/pdf");
                  res.download(filename,(error)=>{
                    console.log("Error--- : ", error)
                  })
                  console.log("File Download started")
                }
                }
                else{
                  console.log("not fileExirs")
                }
              } catch(err) {
                console.error(err)
              }
        }, 50);
          
        });
        
      }
      //
    })
    .catch((err) => {
      console.log("err", err);
      res.redirect("/bill");
    });
};
exports.postDailyBill = (req, res, next) => {
  const date = req.body.date;
  if (!date) {
    res.send("No date selected");
  }
  Bill.find({ date: date })
    .then((result) => {
      res.render("admin/daily-bill", {
        pageTitle: "Daily Bill",
        path: "/daily",
        records: result,
        editing: false,
      });
    })
    .catch((err) => {
      console.log("err", err);
      next();
    });
};
