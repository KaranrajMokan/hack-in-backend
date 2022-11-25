var express = require('express');
var router = express.Router();
var path = require('path');
var fs = require('fs');
var sandBox = require('./DockerSandbox');

function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
}

router.post('/code', function (req, res, next) {
    var code = "#!/usr/bin/python2\n\nimport sys\n\ndef failed():\n\tprint \"Please try again!\"\n\tsys.exit(1)\n\nwith open(\"password.txt\", 'w') as file:\n\tfile.write(\"7393649572701274\")\n\ntry:\n\tuser_password = input(\"\")\nexcept:\n\tfailed()\n\nwith open(\"password.txt\") as pass_file:\n\tdoor_key = pass_file.readline().strip()\n\ttry:\n\t\tif (user_password == int(door_key)):\n\t\t\tprint \"Door can be opened!\"\n\texcept:\n\t\tfailed()";
    var stdin = req.body.stdin;

    var compilerArray = [
        ["python", "file.py", "", "Python", ""],
        ["'g++ -o /usercode/a.out' ", "file.cpp", "/usercode/a.out", "C/C++", ""],
        ["javac", "file.java", "'./usercode/javaRunner.sh'", "Java", ""],
        ["nodejs", "file.js", "", "Nodejs", ""]
    ];

    var obj = getRandomInt(5000);
    var objectId = obj.toString();

    var userDirectory = path.join(process.cwd() + '/compiler/' + objectId + '/');
    if (!fs.existsSync(userDirectory)) {
        fs.mkdirSync(userDirectory, {
            recursive: true
        });
    }
    console.log(userDirectory);
    var ts = Math.round((new Date()).getTime() / 1000);
    // fs.writeFile(userDirectory + ts.toString() + '.py', code, function (err) {
    //     if (err) {
    //         return console.log(err);
    //     }
    // });
    // fs.writeFile(userDirectory + 'compile.py', code, function (err) {
    //     if (err) {
    //         return console.log(err);
    //     }
    // });

    var language = '0';

    var folder = 'temp' + objectId + '/' + getRandomInt(10); //folder in which the temporary folder will be saved

    var work_path = __dirname + "/"; //current working path
    var vm_name = 'virtual_machine'; //name of virtual machine that we want to execute
    var timeout_value = 15; //Timeout Value, In Seconds

    //details of this are present in DockerSandbox.js
    var sandboxType = new sandBox(timeout_value, work_path, folder, vm_name, "python", "file.py", code, "", "Python", "", stdin);


    //data will contain the output of the compiled/interpreted code
    //the result maybe normal program output, list of error messages or a Timeout error
    sandboxType.run(function (data, exec_time, err) {
        console.log("Data received: " + data);
        console.log("Error :");
        console.log(err);
        console.log("Exec time :");
        console.log(exec_time);
        res.send({
            output: data,
            //langid: language,
            //code: code,
            errors: err,
            time: exec_time
        });
    });

})

module.exports = router;