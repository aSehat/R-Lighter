const Project = require('../../models/Project');

const updateProjectAnnotations = async (projectId, annotations) => {
    const annotationIds = await Promise.all(annotations.map(annotation => {
        return Promise.resolve(annotation._id);    
    }));

    try {
        project = await Project.findById(projectId);

        if(!project){
            throw("ERROR: project not found");
        } else {
            const updatedProject = await Project.findByIdAndUpdate(projectId, {
                $addToSet: { 
                    annotations : annotationIds
                }
            }, {new: true});
        }
        return Promise.resolve("Success") ;
    } catch (err){
        console.log(err)
        return Promise.reject("Server Error");
    }
}

const updateProjectResourcesAnnotations = async (projectId, annotations, resources) => {
    const resourceIds = await Promise.all(resources.map(resource => {
        return Promise.resolve(resource._id);    
    }));
    const annotationIds = await Promise.all(annotations.map(annotation => {
        return Promise.resolve(annotation._id);    
    }));

    try {
        project = await Project.findById(projectId);

        if(!project){
            throw("ERROR: project not found");
        } else {
            const updatedProject = await Project.findByIdAndUpdate(projectId, {
                $addToSet: { 
                    annotations : annotationIds,
                    resources : resourceIds
                }
            }, {new: true});
        }
        return Promise.resolve("Success") ;
    } catch (err){
        console.log(err)
        return Promise.reject("Server Error");
    }
}

module.exports = {
    updateProjectResourcesAnnotations,
    updateProjectAnnotations
}