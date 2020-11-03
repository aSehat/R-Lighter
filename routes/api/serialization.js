const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const {check, validationResult} = require('express-validator');
const {exportSerialization} = require('../utils/serialization');
const {getAnnotationsById} = require('../utils/annotation');
const {getResourcesById} = require('../utils/resources');
const Project = require('../../models/Project');


router.get('/:project_id', auth, async (req, res) => {
    try {

        const project = await Project.findOne({_id: req.params.project_id});
        const resources = await getResourcesById(project.resources);   
        const annotations =  await getAnnotationsById(project.annotations);
        const rdf = await exportSerialization(project, resources, annotations);

        res.json({rdf});
    } catch (err) {
        if (err.kind == 'ObjectId') {
            return res.status(400).json({msg: 'Project not found'});
        }
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;