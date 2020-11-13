const Resource = require('../../models/Resource');
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

const getResourceNamesById = async (resourceIds) => {
    const resourceIdObjects = await Promise.all(resourceIds.map( (resourceId) => { return Promise.resolve(ObjectId(resourceId)); }));
    console.log(resourceIdObjects);
    try{
        const resourceObjects = await Resource.find({_id: {$in: resourceIdObjects}});
        let resources = [];
        let classes = []; 
        
        resourceObjects.forEach(resource => {
            if(resource.class === "Class"){
                classes.push(resource.name);
            } else {
                resources.push(resource.name);
            }
        })

        return Promise.resolve({resources, classes});
    }catch (err){
        console.log(err.message);
        return Promise.reject("Server Error");
    } 
}


const createResources = async (annotations) => {
    try {
        const NewResources = await Promise.all(annotations.map( async (annotation) => {
            let newResource = {};
            const content = annotation.content.text;
            const {type, resourceName, property} = annotation.resource;
            newResource.class = type;
            newResource.name = resourceName;
            newResource.property = {}
            newResource.property[property.label] = content;
            newResource.annotationId = annotation._id;

            try{
                const resource = await Resource.findOne({name: resourceName});
                let newResourceContent;
                if (!resource) {
                    instanResource = new Resource(newResource);
                    newResourceContent = await instanResource.save();
                } else {
                    let newProperty = {}
                    if (property.label == "label"){
                        newProperty.label = content
                    } else if (property.label == "description"){
                        newProperty.description = content
                    }
                    newResourceContent = await Resource.findOneAndUpdate({
                        name: resourceName
                    }, {
                        $set: {property: newProperty}
                    }, {new: true});    
                }
                if(type != 'Class'){
                    await Resource.findOneAndUpdate({
                        name: type
                    }, {
                        $addToSet: {resources: [newResourceContent._id]}
                    });
                    
                } 
                return new Promise((resolve, _) => {
                    resolve(newResourceContent);
                })
            } catch (err) {
                console.log(err.message);
                return new Promise((_, reject) => {
                    reject(err.message);
                });
            }
        }));
        return new Promise((resolve, _) => resolve(NewResources));
    } catch (err) {
        console.error(err.message);
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