require('dotenv/config');
const _console = require('consola');
const jwt = require('jsonwebtoken');
const AUTH_TOKEN_KEY = 'x-auth-token'
const auth = async(req, res, next)=>{
    //const token = req.headers[AUTH_TOKEN_KEY]
    const authToken = req.cookies[AUTH_TOKEN_KEY];
    //_console.info(`Token found in headers ${token}`);
    //_console.info('Cookies' , authToken);
    //const token = authHeader && authHeader.split(' ')[1]

    if (authToken == null) {
        _console.warn('No token provided')
        return res.sendStatus(401)
    }
    try{
        const deco = jwt.verify(authToken, process.env.JWT_SECRET);
        //console.log(deco);
        next();
    }catch (e) {
        res.clearCookie(AUTH_TOKEN_KEY);
        return res.sendStatus(403);
    }
}
module.exports = auth;