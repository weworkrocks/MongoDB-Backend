//mongodb+srv://Vicktree:Vicktree@ascend-5edon.mongodb.net/test?retryWrites=true&w=majority

const express = require('express');
const app = express();


app.get('/', (req, res) => res.send("API Running"));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server Started On Port ${PORT}`));

