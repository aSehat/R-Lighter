var ObjectId = require('mongodb').ObjectID;
const Annotation = require('../../models/Annotation');
const Resource = require('../../models/Resource');
const Project = require('../../models/Project');


const getAnnotationsById = async (annotationIds) => {
    const annotationIdObjects = await Promise.all(annotationIds.map( (annotationId) => { return Promise.resolve(ObjectId(annotationId)); }));
    try{
        const annotations = await Annotation.find({_id: {$in: annotationIdObjects}});
        return Promise.resolve(annotations);
    }catch (err){
        console.log(err.message);
        return Promise.reject("Server Error");
    } 
}

const deleteAnnotationsById = async (annotationIds, projectId) => {

    const delAnnotationsObjectIds = await Promise.all(annotationIds.map((annotation_id) => {
        return Promise.resolve(ObjectId(annotation_id))
    }))

    try {
        if(delAnnotationsObjectIds.length > 0){
            const resources = await Resource.find({annotationId: {$in: delAnnotationsObjectIds}});
            const delResourceIds = await Promise.all(resources.map((resource) => {return Promise.resolve(resource._id)}));
            await Resource.collection.deleteMany({annotationId: {$in: delAnnotationsObjectIds}});
            await Project.collection.updateMany({_id: ObjectId(projectId)}, {$pull: {"resources": {$in: delResourceIds}}})
            
            await Annotation.collection.deleteMany({_id: {$in: delAnnotationsObjectIds}});
            await Project.collection.updateMany({_id: ObjectId(projectId)}, {$pull: {"annotations": {$in: delAnnotationsObjectIds}}})
        }
        Promise.resolve("annotations deleted")
    } catch (err) {
        console.error(err.message);
        Promise.reject('Server Error');
    }
}


module.exports = {
    getAnnotationsById,
    deleteAnnotationsById
}