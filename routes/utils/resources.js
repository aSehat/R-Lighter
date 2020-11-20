const Resource = require('../../models/Resource');
const Project = require('../../models/Project');
var ObjectId = require('mongodb').ObjectID;

const getResourcesById = async (resourceIds) => {
    const resourceIdObjects = await Promise.all(resourceIds.map( (resourceId) => { return Promise.resolve(ObjectId(resourceId)); }));
    try{
        const resources = await Resource.find({_id: {$in: resourceIdObjects}});
        return Promise.resolve(resources);
    }catch (err){
        console.log(err.message);
        return Promise.reject("Server Error");
    } 
}

const getResourceNamesById = async (annotations) => {
    try{
        let resources = new Set();
        let classes = new Set(); 
        console.log(annotations);
        annotations.forEach(annotation => {
            if(annotation.resource.type === "Class"){
                classes.add(annotation.resource.resourceName);
            } else {
                resources.add(annotation.resource.resourceName);
            }
        })
        return Promise.resolve({resources: [...resources], classes: [...classes]});
    }catch (err){
        console.log(err);
        return Promise.reject("Server Error");
    } 
}


const createResources = async (annotations, projectId) => {
    try {
        const NewResources = await Promise.all(annotations.map( async (annotation) => {
            let newResource = {};
            const content = annotation.content.text;
            const {type, resourceName, property} = annotation.resource;
            let newResourceContent = {};
            try{
                if(type !== "Property"){
                    newResource.class = type;
                    newResource.name = resourceName;
                    newResource.property = {};
                    newResource.property[property.label] = content;
                    newResource.annotationId = [annotation._id];
                    newResource.projectId = ObjectId(projectId);
                    instanResource = new Resource(newResource);
                    newResourceContent = await instanResource.save();
                } else {
                    const resource = await Resource.findOne({name: resourceName, projectId: ObjectId(projectId)});
                    if (property.label == "label"){
                        newResourceContent = await Resource.findOneAndUpdate({
                            _id: resource._id
                        }, {
                            $set: {"property.label": content},
                            $addToSet: {annotationId: [annotation._id]}
                        }, {new: true});    
                    } else if (property.label == "description"){
                        newResourceContent = await Resource.findOneAndUpdate({
                            _id: resource._id
                        }, {
                            $set: {"property.description": content},
                            $addToSet: {annotationId: [annotation._id]}
                        }, {new: true});   
                    }   
                }
                if(type != 'Class' && type !='Property'){
                    const classResource = await Resource.findOne({name: type, projectId: ObjectId(projectId)});
                    await Resource.findOneAndUpdate({
                        _id: classResource._id
                    }, {
                        $addToSet: {resources: [newResourceContent._id]}
                    });
                } 
                return new Promise((resolve, _) => {
                    resolve(newResourceContent);
                })
            } catch (err) {
                console.log(err);
                return new Promise((_, reject) => {
                    reject(err.message);
                });
            }
        }));
        return new Promise((resolve, _) => resolve(NewResources));
    } catch (err) {
        console.error(err);
        return new Promise((_, reject) => {
            reject(err.message);
        }); 
    }
}



module.exports = {
    createResources,
    getResourcesById,
    getResourceNamesById
}