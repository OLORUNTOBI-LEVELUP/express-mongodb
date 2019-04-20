const express = require("express");
const router = express.Router();
const subjectModel = require("./subjectModel")


router.post("/", async(req,res) => {
    try{
        const subject = await subjectModel.create(req.body)
        return res.status(200).json({
            status: 'success',
            data: subject
        })

    }catch(error) {

        console.log(error)
            res.status(500).json({
                status: 'error',
                message: "an error occured while loading the page"
            })
    }
})

router.put("/:name", async(req, res) => {
    try {
            const updatedSubject = await subjectModel.findOneAndUpdate({ name: req.params.name }, req.body, { new: true});
            
            if(!updatedSubject){
                res.status(404).json({
                    status: 'error',
                    message: "subject does not exist"
                })
                return;
            }
    
            res.json({
                status: "success",
                date: updatedSubject
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

router.delete("/:name", async(req,res) => {
    try {
            const deletedSubject = await subjectModel.findOneAndDelete({ name: req.params.name}, req.body);
             
            if(!deletedSubject){
                res.status(404).json({
                    status: 'error',
                    message: "you cannot delete a subject that does not exist"
                })
                return;
            }
    
            res.json({
                status: "success",
                message: "successfully deleted subject"
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

router.get("/:name", async(req, res) => {
    try {

        const subject = await subjectModel.findOne({ name: req.params.name });

        if(!subject){
            res.status(404).json({
                status: 'error',
                message: "subject not found"
            })
            return;
        }

        res.status(200).json({
            status: "success",
            data: subject
        })

    } catch(error) {
        console.log(error)
            res.status(500).json({
                status: 'error',
                message: "an error occured while loading the page"
            })

    }
})

router.get("/", async (req, res) => {
    try {
        const search = req.query.name ? { name: req.query.name } : {};
        const subjects = await subjectModel.find(search);
        res.status(200).json({
            status: "success",
            data: subjects
        })

    }
    catch(error){
        console.log(error);
        res.status(500).json({
            status: "error",
            message: "an error occured while trying to get subjects"
        })
    }
})


module.exports = router;