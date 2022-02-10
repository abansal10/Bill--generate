const userNameUsed="admin"
const passWordUsed="Password@1234"

module.exports=(req,res,next)=>{
    const username=req.body.username
    const password=req.body.password
    if(username===userNameUsed && password===passWordUsed){
        res.render('admin/generate-bill', {
            pageTitle: 'Add Product',
            path: '/bill',
            editing: false,
          });
    }
    else{
        res.render('admin/login', {
            pageTitle: 'Add Product',
            path: '/login',
            editing: false,
            message: 10
          });
    }
}