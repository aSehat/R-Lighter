const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const {check, validationResult} = require('express-validator');
const {exportSerialization} = require('../utils/serialization');
const {getAnnotationsById} = require('../utils/annotation');
const {getResourcesById} = require('../utils/resources');
const {getUserById} = require('../utils/user');
const Project = require('../../models/Project');

router.get('/:project_id', auth, async (req, res) => {
    try {

        const project = await Project.findOne({_id: req.params.project_id});
        const annotations =  project.annotations;
        const user = await getUserById(project.owner);
        const rdf = await exportSerialization(project, annotations, user);
        
        res.json({rdf});
    } catch (err) {
        if (err.kind == 'ObjectId') {
            return res.status(400).json({msg: 'Project not found'});
        }
        console.log(err);
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;