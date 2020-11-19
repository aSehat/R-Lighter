const Resource = require('../../models/Resource');
const Project = require('../../models/Project');
const N3 = require('n3');
const { DataFactory, Store } = N3;
const { namedNode, literal, quad } = DataFactory;

const exportResources = async(project, prefix, pdfResourcesUri, projectResourcesUri, annotations, user, store) => {
    var seenResources = {};
    annotations.forEach(annotation => {
        const resourceInfo = annotation.resource
        const name = resourceInfo.resourceName.replace(" ", "");
        const type = resourceInfo.type.replace(" ", "");
        const propertyType = resourceInfo.property.label
        const propertyText = annotation.content.text
        var author = ":"+user.name;
        const resourceUri = ":"+name;
        store.addQuad(quad(
            namedNode(resourceUri),
            namedNode("dcterms:creator"),
            namedNode(author)
       ));
        if(propertyType === 'label'){
            store.addQuad(quad(
            namedNode(resourceUri),
            namedNode("rdfs:label"),
            literal(propertyText, project.language.toLowerCase())
            ));
        }
       else if(propertyType === 'description'){
            store.addQuad(quad(
                namedNode(resourceUri),
                namedNode("skos:description"),
                literal(propertyText, project.language.toLowerCase())
            ));
       }

       if(seenResources[name]){
        if (type !== 'Property') {
                    store.addQuad(quad(
                        namedNode(resourceUri),
                        namedNode("rdf:type"),
                        literal(type, project.language.toLowerCase())
                    ));
                }
                store.addQuad(quad(
                    namedNode(resourceUri),
                    namedNode("prov:hadPrimarySource"),
                    namedNode(pdfResourcesUri)
                    ));
        }
        store.addQuad(
            namedNode(resourceUri),
            namedNode('prov:wasDerivedFrom'),
            namedNode(prefix+"#" +annotation._id)
        );

        if(!seenResources[resourceUri]){
            seenResources[resourceUri] = true;
        }
    })

    return Promise.resolve()
}

const exportSerialization = async (project, annotations, user) => { 
    var prefix = project.prefix;
    const primarySource = project._id;
    const store = new N3.Store({ prefixes: 
        {   //Prefixes goes here
            
            rdf: 'http://www.w3.org/1999/02/22-rdf-syntax-ns#',
            "": project.prefix,
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
    const projectResourcesUri = prefix + "#" + primarySource;
    //Project Resource
    store.addQuad(quad(
        namedNode(projectResourcesUri),
        namedNode("dcterms:creator"),
        namedNode(":"+user.name)
    ));
    store.addQuad(quad(
        namedNode(projectResourcesUri),
        namedNode("dcterms:title"),
        literal(project.name, project.language)
    ));
    store.addQuad(quad(
        namedNode(projectResourcesUri),
        namedNode("void:inDataset"),
        namedNode(":datasetdefinition")
    ));
    store.addQuad(quad(
        namedNode(projectResourcesUri),
        namedNode("rdf:type"),
        namedNode("http://purl.org/vocommons/voaf#Vocabulary"),   
    ));
    store.addQuad(quad(
        namedNode(projectResourcesUri),
        namedNode("rdf:type"),
        namedNode("owl:Ontology"),   
    ));
    store.addQuad(quad(
        namedNode(projectResourcesUri),
        namedNode("rdfs:label"),
        literal(project.name, project.language),   
    ));
    store.addQuad(quad(
        namedNode(projectResourcesUri),
        namedNode("foaf:name"),
        literal(project.name, project.language),   
    ));
////////////////////////////////////////////

    store.addQuad(quad(
        namedNode(pdfResourcesUri),
        namedNode("dcterms:creator"),
        namedNode(":"+user.name)
    ));
    store.addQuad(quad(
        namedNode(pdfResourcesUri),
        namedNode("rdf:type"),
        namedNode("bibo:Article")
    )); 


    const datasetdefinitionUri = prefix + "#datasetdefinition" 
    store.addQuad(quad(
        namedNode(datasetdefinitionUri),
        namedNode("dcterms:creator"),
        namedNode(":"+user.name)
    ));
    store.addQuad(quad(
        namedNode(datasetdefinitionUri),
        namedNode("dcterms:title"),
        literal(project.name, project.language)
    ));
    store.addQuad(quad(
        namedNode(datasetdefinitionUri),
        namedNode("rdf:type"),
        namedNode("void:Dataset")
    ));
    store.addQuad(quad(
        namedNode(datasetdefinitionUri),
        namedNode("rdfs:label"),
        literal(project.name, project.language),   
    ));
    store.addQuad(quad(
        namedNode(datasetdefinitionUri),
        namedNode("foaf:name"),
        literal(project.name, project.language),   
    ));
    
    
    //Annotations 
    annotations.forEach(element => {
        const id = element._id;
        const text = element.content.text;
        const resourceUri = prefix+"#"+id;  
        store.addQuad(quad(
            namedNode(resourceUri),
            namedNode("nif-core:isString"),
            literal(text, project.language)
        ));
        store.addQuad(quad(
            namedNode(resourceUri),
            namedNode("rdf:type"),
            namedNode("nif-core:String")
        ));
        store.addQuad(quad(
            namedNode(resourceUri),
            namedNode("prov:hadPrimarySource"),
            namedNode(pdfResourcesUri)
        ));
    });
    //Resources

    await exportResources(project, prefix, pdfResourcesUri, projectResourcesUri, annotations, user, store);


    var output = "";

    
    const rdfTriples = store.getQuads(null, null, null);
    const writer = new N3.Writer({ prefixes: 
        {   //Prefixes goes here
            
            rdf: 'http://www.w3.org/1999/02/22-rdf-syntax-ns#',
            "": project.prefix,
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
    })
    rdfTriples.forEach(quad => {
        writer.addQuad(quad);
    })
    writer.end((error, result) => output = result);
    console.log(output);

    return Promise.resolve(output);
}


module.exports = {
    exportSerialization
}