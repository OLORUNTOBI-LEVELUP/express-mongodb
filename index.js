const express = require("express");
const app = express();
const mongoose = require("mongoose"); 
const bcrypt = require("bcrypt");
const subjectRouter = require("./subjectRouter");
const teacherModel = require("./TeacherModel");
const port = process.env.PORT || 5000;


mongoose
.connect("mongodb://localhost:27017/levelup-db")
.then(() => {
    console.log("successfully connected to mongo db");
})
.catch(err => {
    console.log("an error occured while connecting to mongo db", err)
});


app.use(express.json());
app.use(express.urlencoded({ extended: false}));

app.use((req,res,next) => {
    const { url, method } = req;
    console.log(`got a ${method} request for ${url} at ${new Date().toLocaleTimeString()}`);
    next()
})

app.use("/subject", subjectRouter);

app.post("/teacher", async(req,res) => {
    try{
        req.body.password = await bcrypt.hash(req.body.password, 10);
        
        const teacher = await teacherModel.create(req.body)
        return res.status(200).json({
            status: 'success',
            data: teacher
        })

    }catch(error) {

        console.log(error)
            res.status(500).json({
                status: 'error',
                message: "an error occured while loading the page"
            })
    }
})

app.put("/teacher/:email", async(req, res) => {
    try {
            const updatedTeacher = teacherModel.findOneAndUpdate({ email: req.params.email }, req.body, { new: true});
            
            if(!updatedTeacher){
                res.status(404).json({
                    status: 'error',
                    message: "teacher does not exist"
                })
                return;
            }
    
            res.json({
                status: "success",
                date: updatedTeacher
            })
    }
    catch(error){
        console.log(error)
            res.status(500).json({
                status: 'error',
                message: "an error occured while updating the record"
            })

    }
})

app.delete("/teacher/:email", async(req,res) => {
    try {
            const deletedTeacher = await teacherModel.findOneAndDelete({ email: req.params.email}, req.body);
             
            if(!deletedTeacher){
                res.status(404).json({
                    status: 'error',
                    message: "you cannot delete a teacher that does not exist"
                })
                return;
            }
    
            res.json({
                status: "success",
                message: "successfully deleted teacher"
            })
    }
    catch(error){
        console.log(error)
            res.status(500).json({
                status: 'error',
                message: "an error occured deleting the record"
            })

    }
})

app.get("/teacher/:email", async function(req, res) {
    try {

        
        const teacher = await teacherModel.findOne({ email: req.params.email });

        if(!teacher){
            res.status(404).json({
                status: 'error',
                message: "teacher not found"
            })
            return;
        }

        res.status(200).json({
            status: "success",
            data: teacher
        })

    } catch(error) {
        console.log(error)
            res.status(500).json({
                status: 'error',
                message: "an error occured while loading the page"
            })

    }
})

app.get("/teacher", async (req, res) => {
    try {
        const search = req.query.gender ? { gender: req.query.gender } : {};
        const teachers = await teacherModel.find(search);
        res.status(200).json({
            status: "success",
            data: teachers 
        })

    }
    catch(error){
        console.log(error);
        res.status(500).json({
            status: "error",
            message: "an error occured while trying to get teachers"
        })
    }
})





app.listen(port, console.log(`listening on port ${port}`));