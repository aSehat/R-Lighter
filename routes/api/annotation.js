const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const {check, validationResult} = require('express-validator');
const Annotation = require('../../models/Annotation');
const Project = require('../../models/Project');
const Resource = require('../../models/Resource');
const {createResources} = require('../utils/resources');
const {updateProjectResourcesAnnotations} = require('../utils/project');
const {deleteAnnotationsById} = require("../utils/annotation")
const resources = require('../utils/resources');
var ObjectId = require('mongodb').ObjectID;


// @route       POST api/annotation
// @desc        update annotations
// @access      Private
router.post('/', auth, async (req, res) => {
    const errors = validationResult(req);
    if (! errors.isEmpty()) {
        return res.status(400).json({errors: errors.array()});
    }
    const new_annotations = req.body.annotations;
    const project_id = req.body.project_id;
    const deleted_annotations = req.body.deletedAnnotations;
    try {
        let annotations = [];
        let resources = [];
        if(new_annotations.length > 0){
            annotations = await Annotation.collection.insertMany(new_annotations);
            let resourceAnnotations = [];
            let propertyAnnotations = [];
            for(let i = 0; i < annotations.ops.length; i++){
                if(annotations.ops[i].resource.type === "Property"){
                    propertyAnnotations.push(annotations.ops[i])
                }else {
                    resourceAnnotations.push(annotations.ops[i])
                }
            }
            resources = await createResources(resourceAnnotations, project_id);
            await updateProjectResourcesAnnotations(project_id, annotations.ops, resources); 
            await createResources(propertyAnnotations, project_id);  
        }
        if(deleted_annotations.length > 0 ){
            await deleteAnnotationsById(deleted_annotations, project_id); 
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
