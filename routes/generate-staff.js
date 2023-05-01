const bcrypt = require("bcrypt")
const fs = require("fs")
const path = require("path")
const uuid = require("uuid").v4
const email =  "staff@staff.staff"  // get the value of the input field which has the "name" attribute from the form 
  const password = "staff@staff.staff"
  bcrypt.hash(password, 10).then(hashedPassword => {
    // [refactor] maybe use async/await or promises? 
    fs.readFile(path.join(__dirname, "./database.json"), 'utf8', (err, data) => {
        if (err) console.log(err)
        const parsedData = JSON.parse(data)
        parsedData.users.map(user => {
            if (user.email == email && user.hasOwnProperty("is_staff")) {
                if (user.is_staff == true) {
                    console.log("There has already been a staff member generated", "username:staff@staff.staff\npassword:staff@staff.staff")
                } else {
                    console.log("Please delete the existing staff user staff@staff.staff or manually add the 'is_staff' property")
                }
                process.exit()
            }
        })
        const _uuid = uuid() 
        parsedData.users.push({user_id: _uuid, is_staff:true, email, password: hashedPassword, score: 0}) 
        const newData = parsedData
        fs.writeFile(path.join(__dirname, "./database.json"), JSON.stringify(newData), err => {
          if (err) {
            console.error(err);
            // [todo] res.render or redirect with "something went wrong" message 
          } else {
            console.log("Staff account generated: ",email , " password:", password)
          }
        });
      })
  })
