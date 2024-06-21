const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const Users = require("./models/userModel.js");
const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const jwt = require("jsonwebtoken"); // used to create, sign, and verify tokens

const config = require("./config.js");

passport.use(new LocalStrategy(Users.authenticate()));
passport.serializeUser(Users.serializeUser());
passport.deserializeUser(Users.deserializeUser());

exports.getToken = function(user) {
    return jwt.sign(user, config.secretKey,
        {expiresIn: 3600});
};

const opts = {};
// Định nghĩa cách Passport sẽ lấy JWT từ header của yêu cầu HTTP.
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
// Khóa bí mật được sử dụng để ký và xác minh JWT.
opts.secretOrKey = config.secretKey;

// Cấu hình Passport để sử dụng JWT Strategy. Khi nhận được một yêu cầu có chứa JWT, 
//Passport sẽ giải mã và xác minh token này, sau đó tìm kiếm người dùng trong cơ sở dữ
//liệu dựa trên _id từ payload của JWT.
exports.jwtPassport = passport.use(new JwtStrategy(opts,
    (jwt_payload, done) => {
        console.log("JWT payload: ", jwt_payload);
        Users.findOne({_id: jwt_payload._id}, (err, user) => {
            if (err) {
                return done(err, false);
            }
            else if (user) {
                return done(null, user);
            }
            else {
                return done(null, false);
            }
        });
    }));

// Middleware này được sử dụng để bảo vệ các route. Nó yêu cầu người dùng phải có
//  một JWT hợp lệ để truy cập các route này. session: false có nghĩa là Passport
//   sẽ không sử dụng session để lưu trữ thông tin đăng nhập của người dùng.
exports.verifyUser = passport.authenticate('jwt', {session: false});


exports.verifyAdmin = (req, res, next)=>{
    passport.authenticate("jwt", {session: false}, (err, user)=>{
        if(err){
            return next(err)
        }
        if(!user || !user.admin){
            const err = new Error(
                "you are not auth"
            );
            err.status =403;
            return next(err)
        }
        next()
    })(req,res,next)
}