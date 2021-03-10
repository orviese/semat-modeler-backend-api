require('dotenv/config');
const _console = require('consola');
const jwt = require('jsonwebtoken');

const auth = async(req, res, next)=>{
    const token = req.headers['x-auth-token']
    _console.info('Cookies' ,req.cookies)
    //const token = authHeader && authHeader.split(' ')[1]
    if (token == null) {
        _console.warn('No token provided')
        return res.sendStatus(401)
    }
    try{
        const deco = jwt.verify(token, process.env.JWT_SECRET);
        //console.log(deco);
        next();
    }catch (e) {
        return res.sendStatus(403);
    }
}
module.exports = auth;