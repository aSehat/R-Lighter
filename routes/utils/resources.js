const Resource = require('../../models/Resource');

const createResources = async (annotations) => {
    try {
        const NewResources = await annotations.map( async (annotation) => {
            // console.log("annotation resource:", annotation.resource);
            let newResource = {};
            const content = annotation.highlight.content;
            const {type, resourceName, property} = annotation.resource;
            console.log(annotation);
            newResource.class = type;
            newResource.name = resourceName;
            newResource.property = {}
            newResource.property[property.label] = content;
            newResource.annotationId = annotation._id;
            console.log(newResource)
            try{
                const resource = await Resource.findOne({name: resourceName});
                let newResourceContent;
                if (!resource) {
                    console.log("making new Resource");
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
                return new Promise((resolve, _) => {
                    resolve(newResourceContent);
                })
            } catch (err) {
                console.log(err.message);
                return new Promise((_, reject) => {
                    reject(err.message);
                });
            }
        });
        return new Promise((resolve, _) => resolve(NewResources));
    } catch (err) {
        console.error(err.message);
        return new Promise((_, reject) => {
            reject(err.message);
        }); 
    }
}



module.exports = {
    createResources
}