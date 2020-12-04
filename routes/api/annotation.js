const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const {validationResult} = require('express-validator');
const Annotation = require('../../models/Annotation');
const Project = require('../../models/Project');
const Resource = require('../../models/Resource');
const {deleteAnnotationsById} = require("../utils/annotation")
var ObjectId = require('mongodb').ObjectID;


router.post('/', auth, async (req, res) => {
    const errors = validationResult(req);
    if (! errors.isEmpty()) {
        return res.status(400).json({errors: errors.array()});
    }
    const annotations = req.body.annotations;
    const project_id = req.body.project_id;
    const bibtex = req.body.bibtex;
    const deleted_annotations = req.body.deletedAnnotations;

    if(bibtex){
        await Project.findOneAndUpdate({
            _id: ObjectId(project_id)
        }, {
            $set: {bibtex: bibtex}
        }, {new: true});
    }
    if(deleted_annotations.length > 0 ){
        await deleteAnnotationsById(deleted_annotations, project_id); 
    }
    let new_annotations = []

    annotations.forEach(async (annotation) => {
        try{
            if(!annotation._id){
                new_annotations.push(annotation); //basically unsaved highlights will not have an _id attribute
            } else {

            const {content, position, resource, _id } = annotation
            
            const new_annotation = {content, position, resource, _id }
            const projectAnnotation = await Project.findOne({
                _id: ObjectId(project_id),
                "annotations": {
                    $elemMatch: {_id: ObjectId(annotation._id)}
                }
            })
            if(projectAnnotation){
                await Project.updateOne(
                    {_id: ObjectId(project_id), "annotations._id": ObjectId(annotation._id)},
                    {
                        $set: { "annotations.$": new_annotation
                        }
                    }
                )
            } else {
                throw("annotation not found")
            } 
        }
    }catch (err){
        console.error(err)
        res.status(500).send('Server Error');
    }})

    try {
        let annotations = [];
        let resources = [];
        if(new_annotations.length > 0){
            annotations = await Project.findByIdAndUpdate(ObjectId(project_id), {
                $addToSet: { 
                    annotations: new_annotations
                }
            }, {new: true});
        }
        res.json({annotations, resources});
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

// @route       DELETE api/annotation
// @desc        Delete annotation
// @access      Private
router.delete('/', auth, async (req, res) => {
    
    const del_annotation_ids = req.body;

    const del_annotations_object_ids = del_annotation_ids.map((annotation_id) => {
        return ObjectId(annotation_id)
    })

    try {
        await Annotation.collection.deleteMany({_id: {$in: del_annotations_object_ids}});
        await Resource.collection.deleteMany({annotation_id: {$in: del_annotations_object_ids}});
        res.json({msg: 'Annotations Deleted'});
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
