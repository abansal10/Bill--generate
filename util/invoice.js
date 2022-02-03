const fs = require("fs");
const PDFDocument = require("pdfkit");

module.exports= function  createInvoice(invoice, path,callback) {
  console.log("invoice date",invoice.shipping.date)
    let doc = new PDFDocument({ margin: 50 });
  
    generateHeader(doc);
    generateCustomerInformation(doc, invoice);
    generateInvoiceTable(doc, invoice);
  //  generateFooter(doc);
    doc.pipe(fs.createWriteStream(path));
    doc.end();
    callback("created")
  }


  
function generateHeader(doc) {
    doc
      //.image("logo.png", 50, 45, { width: 50 })
      .fillColor("#444444")
      .fontSize(20)
      .text("M/S Akash Bhandar", 110, 57)
      .fontSize(10)
      .text("GHARA PATTI DALTONGANJ", 200, 50, { align: "right" })
      .text("Mobile No. 8051235186", 200, 65, { align: "right" })
      .text("GSTIN 20ALHPK9071H1Z6", 200, 80, { align: "right" })
      .moveDown();
  }
  
  function generateCustomerInformation(doc, invoice) {
    doc
      .fillColor("#444444")
      .fontSize(20)
      .text("Tax Invoice", 50, 160);
  
    generateHr(doc, 185);
  
    const customerInformationTop = 200;
  
    doc
      .fontSize(10)
      .text("Invoice Number:", 50, customerInformationTop)
      .font("Helvetica-Bold")
      .text(invoice.invoice_nr, 150, customerInformationTop)
      .font("Helvetica")
      .text("Invoice Date:", 50, customerInformationTop + 15)
      .text(formatDate(invoice.shipping.date), 150, customerInformationTop + 15)
      .text("Consumer: ", 50, customerInformationTop + 30)
      .text(
        (invoice.shipping.name + ' '+ invoice.shipping.address),
        150,
        customerInformationTop + 30
      )
  
   
  
    generateHr(doc, 252);
  }
  
  function generateInvoiceTable(doc, invoice) {
    let i;
    const invoiceTableTop = 330;
  
    doc.font("Helvetica-Bold");
    generateTableRow(
      doc,
      invoiceTableTop,
      "Description",
      "HSN Code",
      "Quantity",
      "Rate",
      "Amount"
    );
    generateHr(doc, invoiceTableTop + 20);
    doc.font("Helvetica");
  
    for (i = 0; i < invoice.items.length; i++) {
      const item = invoice.items[i];
      const position = invoiceTableTop + (i + 1) * 30;
      generateTableRow(
        doc,
        position,
        "Cane Jaggery (GUR)",
        "1701",
        item.quantity,
        item.amount,
        formatCurrency(item.amount,item.quantity)
      );
  
      generateHr(doc, position + 20);
    }
  
    const subtotalPosition = invoiceTableTop + (i + 1) * 30;
    doc.font("Helvetica-Bold");
    generateTableRow(
      doc,
      subtotalPosition,
      "",
      "",
      "Subtotal",
      "",
      formatCurrency(invoice.items[0].amount,invoice.items[0].quantity)
    );
    doc.font("Helvetica");
  }
  
  
  function generateTableRow(
    doc,
    y,
    item,
    description,
    unitCost,
    quantity,
    lineTotal
  ) {
    doc
      .fontSize(10)
      .text(item, 50, y)
      .text(description, 150, y)
      .text(unitCost, 280, y, { width: 90, align: "right" })
      .text(quantity, 370, y, { width: 90, align: "right" })
      .text(lineTotal, 0, y, { align: "right" });
  }
  
  function generateHr(doc, y) {
    doc
      .strokeColor("#aaaaaa")
      .lineWidth(1)
      .moveTo(50, y)
      .lineTo(550, y)
      .stroke();
  }
  
  function formatCurrency(rupees,quantity) {
    return  (rupees * quantity);
  }
  
  function formatDate(date) {
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
  
    return day + "/" + month + "/" + year;
  }
  