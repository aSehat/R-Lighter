const Resource = require('../../models/Resource');
const Project = require('../../models/Project');
const N3 = require('n3');
const { DataFactory } = N3;
const { namedNode, literal, defaultGraph, quad } = DataFactory;
const prefix = 'https://rdf.ag/o/test';



const exportSerialization = async (project, resources, annotations) => { 
    console.log("project:",project);
    console.log("annotations:",annotations);
    console.log("resources:",resources);
    const primarySource = project._id;
    const writer = new N3.Writer({ prefixes: 
        {   //Prefixes goes here
            
            rdf: 'http://www.w3.org/1999/02/22-rdf-syntax-ns#',
            "": 'https://rdf.ag/o/test#' ,
            as: 'http://www.w3.org/ns/activitystreams#',
            cc: 'http://creativecommons.org/ns#',
            cereals: 'https://rdf.ag/o/cerealsToo#',
            dbpedia: 'http://dbpedia.org/resource/',
            bibo: 'http://purl.org/ontology/bibo/',
            dcterms: 'http://purl.org/dc/terms/',
            doap: 'http://usefulinc.com/ns/doap#',
            eurovoc: 'http://eurovoc.europa.eu/',
            foaf: 'http://xmlns.com/foaf/0.1/',
            "nif-core": 'http://persistence.uni-leipzig.org/nlp2rdf/ontologies/nif-core#',
            loc: 'http://id.loc.gov/vocabulary/relators/',
            oa: 'http://www.w3.org/ns/oa#',
            owl: 'http://www.w3.org/2002/07/owl#',
            prov: 'http://www.w3.org/ns/prov#',
            rdfs: 'http://www.w3.org/2000/01/rdf-schema#',
            skos: 'http://www.w3.org/2004/02/skos/core#',
            skosxl: 'http://www.w3.org/2008/05/skos-xl#',
            time: 'http://www.w3.org/2006/time#',
            vann: 'http://purl.org/vocab/vann/',
            void: 'http://rdfs.org/ns/void#',
            vs: 'http://www.w3.org/2003/06/sw-vocab-status/ns#',
            xsd: 'http://www.w3.org/2001/XMLSchema#'

        }, 
    });

    //Annotations 
    annotations.forEach(element => {
        var id = element._id;
        var text = element.content.text;
        writer.addQuad(quad(
            namedNode(prefix+id),
            namedNode("nif-core:isString"),
            literal(text)
        ));
        writer.addQuad(quad(
            namedNode(prefix+id),
            namedNode("a"),
            namedNode("nif-core:String")
        ));
        writer.addQuad(quad(
            namedNode(prefix+id),
            namedNode("prov:hadPrimarySource"),
            namedNode(primarySource)
        ));
    });
    //Resources
    resources.forEach(element=>{
        var name = element.name;
        var label = element.property.label;
        var description = element.property.description;
        var Class = element.class;
        var author = "author";
        writer.addQuad(quad(
            namedNode(name),
            namedNode("dcterms:creator"),
            literal(author)
       ));
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
       writer.addQuad(quad(
           namedNode(name),
           namedNode("a :"),
           literal(Class)
       ));
       

    })
    

    var output = "";
    writer.end((error, result) => output = result);
    console.log(output);

    return Promise.resolve(output);
}


module.exports = {
    exportSerialization
}