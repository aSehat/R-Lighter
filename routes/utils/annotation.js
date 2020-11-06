var ObjectId = require('mongodb').ObjectID;
const Annotation = require('../../models/Annotation');


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


module.exports = {
    getAnnotationsById
}