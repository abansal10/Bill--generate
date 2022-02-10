const Bill = require("../models/bill");
const createInvoice = require("../util/invoice");
const randomUser = require("../util/randomUser");
const jwt = require("jsonwebtoken");
const path = require("path");
const fs = require("fs");
exports.login = (req, res, next) => {
  try {
    res.render("admin/login", {
      pageTitle: "Add Product",
      path: "/login",
      editing: false,
      message: 0,
    });
  } catch (err) {
    console.log("Login Routing Error", err);
  }
};

exports.getBill = (req, res, next) => {
  try {
    res.render("admin/generate-bill", {
      pageTitle: "Add Product",
      path: "/bill",
      editing: false,
    });
  } catch (err) {
    console.log("Error Routing in Get Bill", e);
  }
};

exports.getBillDaily = (req, res, next) => {
  try {
    res.render("admin/daily-bill", {
      pageTitle: "Daily Bill",
      path: "/daily",
      records: [],
      editing: false,
    });
  } catch (err) {
    console.log("Error In Routes Daily Bill", err);
  }
};

exports.getBillMonthly = (req, res, next) => {
  try {
    res.render("admin/monthly-bill", {
      pageTitle: "Monthly Bill",
      path: "/monthly",
      editing: false,
      records:{},
      loggedIn: 1,
    });
  } catch (err) {
    console.log("Error In Routes Monthly Bill", err);
  }
};
exports.postBillMonthly = (req, res, next) => {
  const month = +req.body.months;
  const year = +req.body.years;
  Bill.find({
    $expr: {
      $and: [
        {
          $eq: [{ $year: "$date" }, year],
        },
        {
          $eq: [{ $month: "$date" }, month],
        },
      ],
    },
  }).sort({date: 1})
  .then((result) => {
    //console.log(result)
    let resultObj={}
    console.log(Object.keys(resultObj).length)
    result.forEach(element => {
      let dateOfMonth =  new Date(element.date).getDate() + "-"+ month+ "-"+year
      if(resultObj[dateOfMonth]){
        resultObj[dateOfMonth].totalBill=resultObj[dateOfMonth].totalBill+element.price * element.quantity
        resultObj[dateOfMonth].quantity=resultObj[dateOfMonth].quantity+element.quantity
      }
      else{
        resultObj[dateOfMonth]={}
        resultObj[dateOfMonth].totalBill=element.price * element.quantity
        resultObj[dateOfMonth].quantity=element.quantity
      }
    });
    try{ 
      res.render("admin/monthly-bill", {
        pageTitle: "Monthly Bill",
        path: "/monthly",
        records: resultObj
      });
    } catch (err) {
      console.log("Error In Routes Monthly Bill", err);
    }
    
  }).catch((err) => {
    console.log(err)
  });
  
};

exports.postAddBill = async (req, res, next) => {
  try{
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
      res.redirect("/bill");
    })
    .catch((err) => {
      console.log("err", err);
      res.redirect("/bill");
    });
  } catch (err) {
    console.log("Error In routes post add Bill", err);
  }
};
exports.postDailyBill = (req, res, next) => {
  try {
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
          dateValue: date,
          editing: false,
        });
      })
      .catch((err) => {
        console.log("err", err);
        next();
      });
  } catch (err) {
    console.log("Error In routes post Daily Bill", err);
  }
};

exports.getBillDownload = (req, res, next) => {
  const id = req.params.id;
  if (id) {
    Bill.findOne({ invoice: id })
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
          createInvoice(invoiceData, filename, res);
        }
      })
      .catch((err) => {
        console.log(`{id not found}`);
        res.status(500).send({ message: "id not found" });
      });
  }
};
