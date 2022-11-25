var bcrypt = require("bcrypt");

bcrypt.hash("passwd890", 10, (err, hash) => {
    if (err != null) {}
    console.log(hash)
});