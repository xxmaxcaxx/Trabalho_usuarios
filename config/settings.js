const env = process.env.Node_ENV || "dev";

const config = () => {
    switch(env){
        case "dev":
            return{
                dbpath:
                "mongodb+srv://fernando:aluno123@cluster0.rxkgz.mongodb.net/myFirstDatabase?retryWrites=true&w=majority",
                jwt_key: "key_important",
                jwt_expires: "5d",
            };
            case "prod":
                return{
                    dbpath:
                    "mongodb+srv://fernando:aluno123@cluster0.rxkgz.mongodb.net/myFirstDatabase?retryWrites=true&w=majority",
                };
    }
};
module.exports = config();