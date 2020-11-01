const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const {check, validationResult} = require('express-validator');
const Annotation = require('../../models/Annotation');
const Project = require('../../models/Project');
const Resource = require('../../models/Resource');
const {createResources} = require('../utils/resources');
var ObjectId = require('mongodb').ObjectID;

// @route       POST api/annotation
// @desc        update annotations
// @access      Private
router.post('/', auth, async (req, res) => {
    const errors = validationResult(req);
    if (! errors.isEmpty()) {
        return res.status(400).json({errors: errors.array()});
    }

    const new_annotations = req.body;

    try {
        const annotations = await Annotation.collection.insertMany(new_annotations); 
        const resources = await createResources(annotations.ops);
        console.log(resources);        
        res.json(annotations);
    } catch (err) {
        console.error(err.message);
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
    console.log(del_annotations_object_ids);

    try {
        const annotations_deleted = await Annotation.collection.deleteMany({_id: {$in: del_annotations_object_ids}});
        // console.log(annotations_deleted);
        res.json({msg: 'Annotations Deleted'});
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
