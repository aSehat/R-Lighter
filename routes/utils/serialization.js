const Resource = require('../../models/Resource');
const Project = require('../../models/Project');
const N3 = require('n3');
const { DataFactory, Store } = N3;
const { namedNode, literal, defaultGraph, quad } = DataFactory;



const exportSerialization = async (project, resources, annotations, user) => { 
    console.log("project:",project);
    console.log('user', user);
    var prefix = project.prefix;
    const primarySource = project._id;
    const writer = new N3.Writer({ prefixes: 
        {   //Prefixes goes here
            
            rdf: 'http://www.w3.org/1999/02/22-rdf-syntax-ns#',
            //"": project.prefix,
            bibo: 'http://purl.org/ontology/bibo/',
            dcterms: 'http://purl.org/dc/terms/',
            foaf: 'http://xmlns.com/foaf/0.1/',
            "nif-core": 'http://persistence.uni-leipzig.org/nlp2rdf/ontologies/nif-core#',
            owl: 'http://www.w3.org/2002/07/owl#',
            prov: 'http://www.w3.org/ns/prov#',
            rdfs: 'http://www.w3.org/2000/01/rdf-schema#',
            skos: 'http://www.w3.org/2004/02/skos/core#',
            skosxl: 'http://www.w3.org/2008/05/skos-xl#',
            void: 'http://rdfs.org/ns/void#',
        }, 
    });
    const pdfResourcesUri = prefix + "#" + "00000";
    const projectResourcesUri = prefix + "#" + project._id;
    //Project Resource
    writer.addQuad(quad(
        namedNode(projectResourcesUri),
        namedNode("dcterms:creator"),
        namedNode(":"+user.name)
    ));
    writer.addQuad(quad(
        namedNode(projectResourcesUri),
        namedNode("dcterms:title"),
        literal(project.name, project.language)
    ));
    writer.addQuad(quad(
        namedNode(projectResourcesUri),
        namedNode("void:inDataset"),
        namedNode(":datasetdefinition")
    ));
    writer.addQuad(quad(
        namedNode(projectResourcesUri),
        namedNode("rdf:type"),
        namedNode("http://purl.org/vocommons/voaf#Vocabulary"),   
    ));
    writer.addQuad(quad(
        namedNode(projectResourcesUri),
        namedNode("rdf:type"),
        namedNode("owl:Ontology"),   
    ));
    writer.addQuad(quad(
        namedNode(projectResourcesUri),
        namedNode("rdfs:label"),
        literal(project.name, project.language),   
    ));
    writer.addQuad(quad(
        namedNode(projectResourcesUri),
        namedNode("foaf:name"),
        literal(project.name, project.language),   
    ));
////////////////////////////////////////////

    writer.addQuad(quad(
        namedNode(pdfResourcesUri),
        namedNode("dcterms:creator"),
        namedNode(":"+user.name)
    ));
    writer.addQuad(quad(
        namedNode(pdfResourcesUri),
        namedNode("rdf:type"),
        namedNode("bibo:Article")
    )); 


    const datasetdefinitionUri = prefix + "#datasetdefinition" 
    writer.addQuad(quad(
        namedNode(datasetdefinitionUri),
        namedNode("dcterms:creator"),
        namedNode(":"+user.name)
    ));
    writer.addQuad(quad(
        namedNode(datasetdefinitionUri),
        namedNode("dcterms:title"),
        literal(project.name, project.language)
    ));
    writer.addQuad(quad(
        namedNode(datasetdefinitionUri),
        namedNode("rdf:type"),
        namedNode("void:Dataset")
    ));
    writer.addQuad(quad(
        namedNode(datasetdefinitionUri),
        namedNode("rdfs:label"),
        literal(project.name, project.language),   
    ));
    writer.addQuad(quad(
        namedNode(datasetdefinitionUri),
        namedNode("foaf:name"),
        literal(project.name, project.language),   
    ));
    
    
    //Annotations 
    annotations.forEach(element => {
        const id = element._id;
        const text = element.content.text;
        const resourceUri = prefix+"#"+id;  
        writer.addQuad(quad(
            namedNode(resourceUri),
            namedNode("nif-core:isString"),
            literal(text)
        ));
        writer.addQuad(quad(
            namedNode(resourceUri),
            namedNode("rdf:type"),
            namedNode("nif-core:String")
        ));
        writer.addQuad(quad(
            namedNode(resourceUri),
            namedNode("prov:hadPrimarySource"),
            namedNode(pdfResourcesUri)
        ));
    });
    //Resources
    resources.forEach(element=>{
        var name = element.name;
        var label = element.property.label;
        var description = element.property.description;
        var Class = element.class;
        var author = user.name;
        const resourceUri = ":"+name;
        writer.addQuad(quad(
            namedNode(resourceUri),
            namedNode("dcterms:creator"),
            namedNode(author)
       ));
        if(label){
            writer.addQuad(quad(
            namedNode(resourceUri),
            namedNode("rdfs:label"),
            literal(label, project.language.toLowerCase())
            ));
        }
       if(description){
            writer.addQuad(quad(
                namedNode(resourceUri),
                namedNode("skos:description"),
                literal(description, project.language.toLowerCase())
            ));
       }
       writer.addQuad(quad(
           namedNode(resourceUri),
           namedNode("rdf:type"),
           literal(Class)
       ));

       writer.addQuad(quad(
        namedNode(resourceUri),
        namedNode("prov:hadPrimarySource"),
        namedNode(pdfResourcesUri)
        ));
        writer.addQuad(quad(
            namedNode(resourceUri),
            namedNode("prov:wasDerivedFrom"),
            namedNode(prefix+"#" +element.annotationId)
        ));
    })
    

    var output = "";
    //const predicates = writer.getPredicates();
    //console.log(predicates);
    writer.end((error, result) => output = result);
    console.log(output);

    return Promise.resolve(output);
}


module.exports = {
    exportSerialization
}