    require("fs").readFile(require("path").join(__dirname, "./database.json"), 'utf8', (err, data) => {
        if (err) console.log(err)
        const parsedData = JSON.parse(data)
        parsedData.users.push({user_id: 2, e: "email", p: "password"}) 
        console.log(JSON.stringify(newData))
        /* 
        fs.writeFile("./database.json", JSON.stringify(newData), err => {
          if (err) {
            console.error(err);
          }
        });
        */
      })
