const Resource = require('../../models/Resource');
const Project = require('../../models/Project');
const N3 = require('n3');
const { DataFactory } = N3;
const { namedNode, literal, defaultGraph, quad } = DataFactory;
const prefix = 'https://rdf.ag/o/test';
const primarySource = '<https://rdf.ag/o/test#00000>';


const exportSerialization = async (project, resources, annotations) => { 
    console.log("project:",project);
    console.log("annotations:",annotations);
    console.log("resources:",resources);
    const writer = new N3.Writer();

    //Annotations 
    annotations.forEach(element => {
        var id = element._id;
        var text = element.content.text;
        writer.addQuad(quad(
            namedNode(prefix+id),
            literal("nif-core:isString"),
            literal(text)
        ));
        writer.addQuad(quad(
            namedNode(prefix+id),
            literal("a nif-core"),
            literal("String")
        ));
        writer.addQuad(quad(
            namedNode(prefix+id),
            literal("prov"),
            literal("hadPrimarySource"+primarySource)
        ));
    });
    //Resources
    resources.forEach(element=>{
        var name = element.name;
        var label = element.property.label;
        var description = element.property.description;
        if(label){
            writer.addQuad(quad(
            namedNode(name),
            namedNode("rdfs:label"),
            literal(label)
            ));
        }
       if(description){
            writer.addQuad(quad(
                namedNode(name),
                namedNode("skos:description"),
                literal(description)
            ));
       }

    })
    

    var output = "";
    writer.end((error, result) => output = result);
    console.log(output);

    return Promise.resolve(output);
}


module.exports = {
    exportSerialization
}