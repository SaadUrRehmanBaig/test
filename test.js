const express = require("express");
const fs = require('fs')

accounts = fs.readFileSync('./accounts.json', "utf-8")
accounts = accounts.split("\r\n")
data_accounts = {}
accounts.map((item) => {
    data_accounts[JSON.parse(item).account_id["$numberInt"]] = { limit: JSON.parse(item).limit["$numberInt"], product: JSON.parse(item).products }
})

customers = fs.readFileSync('./customers.json', 'utf-8')
customers = customers.split("\r\n")
data_customers = {}
customers.map((item) => {
    data_customers[JSON.parse(item).username] = {
        name: JSON.parse(item).name, address: JSON.parse(item).address, birthdate: new Date(parseInt(JSON.parse(item).birthdate["$date"]["$numberLong"])),
        email: JSON.parse(item).email, accounts: JSON.parse(item).accounts.map((item) => { return data_accounts[item["$numberInt"]] }), tier_and_details: JSON.parse(item).tier_and_details
    }
})

const app = express()

app.use(express.json())
app.post("/account", (req, res) => {
    if (req.body.account_id in data_accounts) {
        res.send(data_accounts[req.body.account_id])
    }
    else {
        res.send('no account found')
    }
})

app.post("/customer", (req, res) => {
    if (req.body.username in data_customers) {
        res.send(data_customers[req.body.username])
    }
    else {
        res.send('no user exit with this username in our database')
    }
})
app.listen(4000, () => {
    console.log('listening to server on 4000')
})