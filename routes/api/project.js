const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const {check, validationResult} = require('express-validator');
const Project = require('../../models/Project');
const {getAnnotationsById} = require('../utils/annotation');
const {getResourceNamesById} = require('../utils/resources');

// @route       POST api/project
// @desc        Create or update a project
// @access      Private
router.post('/', auth, async (req, res) => {
    const errors = validationResult(req);
    if (! errors.isEmpty()) {
        return res.status(400).json({errors: errors.array()});
    }

    const {
        name,
        link,
        prefix,
        language
    } = req.body;

    const projectFields = {};
    projectFields.name = name;
    if (link) {
        projectFields.link = link;
    }
    if (language) {
        projectFields.language = language;
    }
    if(prefix) {
        projectFields.prefix = prefix;
    }

    projectFields.owner = req.user.id;

    try {
        project = new Project(projectFields);

        await project.save();
        res.json(project);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});


// @route       GET api/project/:project_id
// @desc        Get specific project
// @access      Private
router.get('/:project_id', auth, async (req, res) => {
    try {
        const project = await (await Project.findOne({_id: req.params.project_id}).populate('annotations').populate('resources'));
        console.log(project);
        if (! project) {
            return res.status(400).json({msg: 'Project not found'});
        }
        const {resources, classes} = await getResourceNamesById(project.resources);
        res.json({project, resources, classes});
    } catch (err) {
        if (err.kind == 'ObjectId') {
            return res.status(400).json({msg: 'Project not found'});
        }
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route       GET api/project
// @desc        Get all projects
// @access      Private
router.get('/', auth, async (req, res) => {
    try {
        const projects = await Project.find({owner: req.user.id});
        res.json(projects);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route       DELETE api/project
// @desc        Delete project
// @access      Private
router.delete('/:project_id', auth, async (req, res) => {
    try {
        await Project.findOneAndRemove({_id: req.params.project_id});
        
        res.json({msg: 'Project Deleted'});
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
